import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { bankConfigs } from '../../data/bankConfigs'
import { companyConfigs, generateCompanyConfig } from '../../data/companyConfigs'
import { 
  verifyIdentity, 
  generateOfferLLM, 
  generateCounterOfferLLM, 
  evaluateOfferLLM 
} from '../../services/llmService'
import {
  getChatSession,
  addMessageToSession,
  updateSessionStatus,
  generateDealId
} from '../../utils/chatStorage'

const NegotiationDrawer = ({ 
  isOpen, 
  onClose, 
  deal, 
  intent, 
  currentRole, 
  selectedBank,
  onDealAccepted,
  onDealCancelled 
}) => {
  const [chatSession, setChatSession] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dealId, setDealId] = useState(null)

  // Initialize chat session when drawer opens
  useEffect(() => {
    if (isOpen && deal && intent) {
      const id = generateDealId(deal.intentId, deal.bankName)
      setDealId(id)
      
      const session = getChatSession(id)
      setChatSession(session)
      
      // Add initial system message if this is a new session
      if (session.messages.length === 0) {
        addMessageToSession(id, {
          sender: 'system',
          content: `Negotiation started for ${intent.companyName}'s credit request of $${intent.amount.toLocaleString()} for ${intent.duration} months.`,
          type: 'system'
        })
        setChatSession(getChatSession(id))
      }
    }
  }, [isOpen, deal, intent])

  // Get configurations
  const bankConfig = bankConfigs[deal?.bankName] || {}
  const companyConfig = companyConfigs[intent?.companyName] || 
    (intent ? generateCompanyConfig(intent.companyName, intent) : {})

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), 'HH:mm')
  }

  const handleVerifyIdentity = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const isAuthentic = await verifyIdentity(intent.companyName, intent)
      
      if (isAuthentic) {
        addMessageToSession(dealId, {
          sender: 'system',
          content: `✅ Identity verification successful for ${intent.companyName}. ${deal.bankName} can now proceed with the loan offer.`,
          type: 'verification_success'
        })
        updateSessionStatus(dealId, 'verified')
      } else {
        addMessageToSession(dealId, {
          sender: 'system',
          content: `❌ Identity verification failed for ${intent.companyName}. This deal has been cancelled due to authentication concerns.`,
          type: 'verification_failed'
        })
        updateSessionStatus(dealId, 'cancelled')
        
        // Auto-cancel the deal after a brief delay
        setTimeout(() => {
          onDealCancelled(deal.intentId)
          onClose()
        }, 2000)
      }
      
      setChatSession(getChatSession(dealId))
    } catch (error) {
      setError('Failed to verify identity. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateOffer = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const offer = await generateOfferLLM(intent, bankConfig, deal.bankName)
      
      addMessageToSession(dealId, {
        sender: deal.bankName,
        content: offer,
        type: 'offer'
      })
      
      updateSessionStatus(dealId, 'in_progress')
      setChatSession(getChatSession(dealId))
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateCounterOffer = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const conversation = chatSession.messages.filter(msg => msg.type !== 'system')
      const counterOffer = await generateCounterOfferLLM(
        conversation, 
        bankConfig, 
        deal.bankName, 
        intent
      )
      
      addMessageToSession(dealId, {
        sender: deal.bankName,
        content: counterOffer,
        type: 'counter_offer'
      })
      
      setChatSession(getChatSession(dealId))
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEvaluateOffer = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const lastBankMessage = chatSession.messages
        .filter(msg => msg.sender === deal.bankName)
        .pop()
      
      if (!lastBankMessage) {
        setError('No bank offer found to evaluate')
        return
      }
      
      const conversation = chatSession.messages.filter(msg => msg.type !== 'system')
      const evaluation = await evaluateOfferLLM(
        intent,
        lastBankMessage.content,
        companyConfig,
        bankConfig,
        deal.bankName,
        conversation
      )
      
      if (evaluation.isAcceptance) {
        addMessageToSession(dealId, {
          sender: intent.companyName,
          content: evaluation.content,
          type: 'acceptance'
        })
        
        updateSessionStatus(dealId, 'accepted')
        
        // Move deal to closed deals
        setTimeout(() => {
          onDealAccepted(deal.intentId, deal.bankName)
          onClose()
        }, 1000)
      } else {
        addMessageToSession(dealId, {
          sender: intent.companyName,
          content: evaluation.content,
          type: 'counter_offer'
        })
      }
      
      setChatSession(getChatSession(dealId))
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptOffer = () => {
    addMessageToSession(dealId, {
      sender: intent.companyName,
      content: `We accept ${deal.bankName}'s offer. Thank you for working with us!`,
      type: 'acceptance'
    })
    
    updateSessionStatus(dealId, 'accepted')
    
    setTimeout(() => {
      onDealAccepted(deal.intentId, deal.bankName)
      onClose()
    }, 1000)
  }

  const handleCancelDeal = () => {
    const senderName = currentRole === 'bank' ? deal.bankName : intent.companyName
    
    addMessageToSession(dealId, {
      sender: senderName,
      content: `This deal has been cancelled by ${senderName}.`,
      type: 'cancellation'
    })
    
    updateSessionStatus(dealId, 'cancelled')
    
    setTimeout(() => {
      onDealCancelled(deal.intentId)
      onClose()
    }, 1000)
  }

  const renderMessage = (message) => {
    const isOwnMessage = currentRole === 'bank' 
      ? message.sender === deal?.bankName 
      : message.sender === intent?.companyName
    
    if (message.type === 'system') {
      return (
        <div key={message.id} className="flex justify-center mb-4">
          <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm max-w-md text-center">
            {message.content}
          </div>
        </div>
      )
    }
    
    return (
      <div key={message.id} className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-sm px-4 py-3 rounded-lg ${
          isOwnMessage 
            ? 'bg-primary-500 text-white' 
            : message.sender === deal?.bankName
              ? 'bg-success-100 text-success-800'
              : 'bg-blue-100 text-blue-800'
        }`}>
          <div className="font-semibold text-sm mb-1">{message.sender}</div>
          <div className="text-sm leading-relaxed">{message.content}</div>
          <div className={`text-xs mt-1 ${isOwnMessage ? 'text-white/70' : 'text-gray-500'}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    )
  }

  const renderActionButtons = () => {
    if (!chatSession || chatSession.status === 'cancelled' || chatSession.status === 'accepted') {
      return null
    }

    if (currentRole === 'bank' || (currentRole === 'admin' && selectedBank === deal?.bankName)) {
      // Bank flow
      if (chatSession.status === 'pending_verification') {
        return (
          <div className="space-y-3">
            <button
              onClick={handleVerifyIdentity}
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? 'Verifying...' : '✅ Verify Identity'}
            </button>
            <button
              onClick={handleCancelDeal}
              className="w-full btn btn-danger"
            >
              ❌ Cancel Deal
            </button>
          </div>
        )
      }

      if (chatSession.status === 'verified' || chatSession.status === 'in_progress') {
        const hasOffers = chatSession.messages.some(msg => 
          msg.sender === deal.bankName && (msg.type === 'offer' || msg.type === 'counter_offer')
        )

        return (
          <div className="space-y-3">
            <button
              onClick={hasOffers ? handleGenerateCounterOffer : handleGenerateOffer}
              disabled={isLoading}
              className="w-full btn btn-success"
            >
              {isLoading ? 'Generating...' : hasOffers ? '🔁 Provide Counter-Offer' : '💬 Provide Offer'}
            </button>
            <button
              onClick={handleCancelDeal}
              className="w-full btn btn-danger"
            >
              ❌ Cancel Deal
            </button>
          </div>
        )
      }
    } else if (currentRole === 'company' || currentRole === 'admin') {
      // Company flow
      const hasBankOffers = chatSession.messages.some(msg => 
        msg.sender === deal.bankName && (msg.type === 'offer' || msg.type === 'counter_offer')
      )

      if (hasBankOffers && chatSession.status === 'in_progress') {
        return (
          <div className="space-y-3">
            <button
              onClick={handleAcceptOffer}
              className="w-full btn btn-success"
            >
              ✅ Accept Offer
            </button>
            <button
              onClick={handleEvaluateOffer}
              disabled={isLoading}
              className="w-full btn btn-warning"
            >
              {isLoading ? 'Evaluating...' : '🔁 Check/Negotiate Offer'}
            </button>
            <button
              onClick={handleCancelDeal}
              className="w-full btn btn-danger"
            >
              ❌ Cancel Deal
            </button>
          </div>
        )
      }

      return (
        <div className="space-y-3">
          <button
            onClick={handleCancelDeal}
            className="w-full btn btn-danger"
          >
            ❌ Cancel Deal
          </button>
        </div>
      )
    }

    return null
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-1/2 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold mb-2">
                Negotiation Chat
              </h2>
              <div className="text-primary-100 text-sm space-y-1">
                <div>Intent #{deal?.intentId} - {intent?.companyName}</div>
                <div>Bank: {deal?.bankName}</div>
                <div>Amount: ${intent?.amount?.toLocaleString()}</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-primary-200 transition-colors p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatSession?.messages?.map(renderMessage)}
          
          {isLoading && (
            <div className="flex justify-center">
              <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 pb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex-shrink-0">
          {renderActionButtons()}
        </div>
      </div>
    </>
  )
}

export default NegotiationDrawer