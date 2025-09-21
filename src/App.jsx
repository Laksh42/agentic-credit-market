import { useState } from 'react'
import Header from './components/Header/Header'
import IntentForm from './components/IntentForm/IntentForm'
import KanbanBoard from './components/KanbanBoard/KanbanBoard'
import NegotiationDrawer from './components/NegotiationDrawer/NegotiationDrawer'
import { sampleData, availableCompanies } from './data/sampleData'
import { rolePermissions } from './utils/rolePermissions'
import { v4 as uuidv4 } from 'uuid'
import { evaluateAllOffersLLM } from './services/llmService'
import { bankConfigs } from './data/bankConfigs'
import { companyConfigs, generateCompanyConfig } from './data/companyConfigs'
import { getChatSession, generateDealId } from './utils/chatStorage'

function App() {
  const [currentRole, setCurrentRole] = useState('company')
  const [selectedBank, setSelectedBank] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(availableCompanies[0]?.name || '')
  const [intents, setIntents] = useState(sampleData.intents)
  const [ongoingDeals, setOngoingDeals] = useState(sampleData.ongoingDeals)
  const [closedDeals, setClosedDeals] = useState(sampleData.closedDeals)
  const [nextIntentId, setNextIntentId] = useState(1004)
  const [intentEvaluations, setIntentEvaluations] = useState({})
  const [evaluationLoading, setEvaluationLoading] = useState({})

  // Negotiation drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [selectedIntent, setSelectedIntent] = useState(null)

  const permissions = rolePermissions[currentRole] || {}

  const handleRoleChange = (role) => {
    setCurrentRole(role)
    setSelectedBank('')
    if (role === 'company' && !selectedCompany) {
      setSelectedCompany(availableCompanies[0]?.name || '')
    }
    // Close drawer when role changes
    setIsDrawerOpen(false)
  }

  const handleBankSelection = (bank) => {
    setSelectedBank(bank)
  }

  const handleCompanySelection = (company) => {
    setSelectedCompany(company)
  }

  const handleCreateIntent = (intentData) => {
    const newIntent = {
      id: nextIntentId,
      ...intentData,
      status: 'open',
      timestamp: new Date().toISOString()
    }
    
    setIntents(prev => [...prev, newIntent])
    setNextIntentId(prev => prev + 1)
  }

  const handleExpressInterest = (intentId, bankName) => {
    const intent = intents.find(i => i.id === intentId)
    if (!intent) return

    const existingDeal = ongoingDeals.find(
      deal => deal.intentId === intentId && deal.bankName === bankName
    )
    
    if (existingDeal) return // Bank already expressed interest

    const newDeal = {
      id: uuidv4(),
      intentId,
      companyName: intent.companyName,
      bankName,
      timestamp: new Date().toISOString()
    }

    setOngoingDeals(prev => [...prev, newDeal])
  }

  const handleCloseDeal = (intentId, winningBankName) => {
    const intent = intents.find(i => i.id === intentId)
    if (!intent) return

    // Create closed deal with complete intent data for chat history
    const closedDeal = {
      id: intentId,
      companyName: intent.companyName,
      winningBank: winningBankName,
      amount: intent.amount,
      duration: intent.duration,
      purpose: intent.purpose,
      useOfFundsDetail: intent.useOfFundsDetail,
      esgFocusAreas: intent.esgFocusAreas,
      impactObjectives: intent.impactObjectives,
      collateralOffered: intent.collateralOffered,
      requestedIncentives: intent.requestedIncentives,
      additionalNotes: intent.additionalNotes,
      timestamp: new Date().toISOString()
    }

    // Remove intent from open intents
    setIntents(prev => prev.filter(i => i.id !== intentId))

    // Remove all ongoing deals for this intent
    setOngoingDeals(prev => prev.filter(deal => deal.intentId !== intentId))

    // Add to closed deals
    setClosedDeals(prev => [...prev, closedDeal])

    setIntentEvaluations(prev => {
      const next = { ...prev }
      delete next[intentId]
      return next
    })

    setEvaluationLoading(prev => {
      const next = { ...prev }
      delete next[intentId]
      return next
    })
  }

  const handleDeleteIntent = (intentId) => {
    if (!permissions.canDelete) return

    setIntents(prev => prev.filter(i => i.id !== intentId))
    setOngoingDeals(prev => prev.filter(deal => deal.intentId !== intentId))

    setIntentEvaluations(prev => {
      const next = { ...prev }
      delete next[intentId]
      return next
    })

    setEvaluationLoading(prev => {
      const next = { ...prev }
      delete next[intentId]
      return next
    })
  }

  const handleEvaluateAllOffers = async (intentId) => {
    const intent = intents.find(i => i.id === intentId)
    if (!intent) return

    const relatedDeals = ongoingDeals.filter(deal => deal.intentId === intentId)

    if (relatedDeals.length === 0) {
      setIntentEvaluations(prev => ({
        ...prev,
        [intentId]: {
          content: 'No bank offers are available for this intent yet. Invite banks to submit proposals first.',
          decision: 'NO_OFFERS',
          recommendedPartner: null,
          generatedAt: new Date().toISOString()
        }
      }))
      return
    }

    setEvaluationLoading(prev => ({ ...prev, [intentId]: true }))

    try {
      const offerBundles = relatedDeals.map(deal => {
        const sessionId = generateDealId(deal.intentId, deal.bankName)
        let session = { messages: [], status: 'pending_verification' }

        if (typeof window !== 'undefined') {
          session = getChatSession(sessionId)
        }

        const bankMessages = (session.messages || []).filter(msg => msg.sender === deal.bankName)
        const latestBankMessage = bankMessages[bankMessages.length - 1]
        const conversationExcerpt = (session.messages || [])
          .map(msg => `${msg.sender}: ${msg.content}`)
          .slice(-6)
          .join('\n')

        return {
          bankName: deal.bankName,

          latestOffer: latestBankMessage?.rawOffer || latestBankMessage?.content || 'No formalised offer from this bank yet.',

          negotiationStatus: session.status || 'pending_verification',
          conversationExcerpt,
          bankConfig: bankConfigs[deal.bankName] || {}
        }
      })

      const companyConfig = companyConfigs[intent.companyName] ||
        generateCompanyConfig(intent.companyName, intent)

      const evaluation = await evaluateAllOffersLLM(intent, offerBundles, companyConfig)

      setIntentEvaluations(prev => ({
        ...prev,
        [intentId]: {
          ...evaluation,
          generatedAt: new Date().toISOString()
        }
      }))
    } catch (error) {
      setIntentEvaluations(prev => ({
        ...prev,
        [intentId]: {
          content: `Error evaluating offers: ${error.message}`,
          decision: 'ERROR',
          recommendedPartner: null,
          generatedAt: new Date().toISOString()
        }
      }))
    } finally {
      setEvaluationLoading(prev => {
        const next = { ...prev }
        delete next[intentId]
        return next
      })
    }
  }

  // Negotiation drawer handlers
  const handleOpenNegotiation = (deal) => {
    // Find the corresponding intent for this deal
    let intent = intents.find(i => i.id === deal.intentId)
    
    // If not found in open intents, check closed deals and reconstruct intent data
    if (!intent) {
      const closedDeal = closedDeals.find(i => i.id === deal.intentId)
      if (closedDeal) {
        // Reconstruct intent data from closed deal for chat history viewing
        intent = {
          id: closedDeal.id,
          companyName: closedDeal.companyName,
          amount: closedDeal.amount,
          duration: closedDeal.duration || 12, // Use stored duration or default
          purpose: closedDeal.purpose || "Credit facility", // Use stored purpose or default
          useOfFundsDetail: closedDeal.useOfFundsDetail,
          esgFocusAreas: closedDeal.esgFocusAreas,
          impactObjectives: closedDeal.impactObjectives,
          collateralOffered: closedDeal.collateralOffered,
          requestedIncentives: closedDeal.requestedIncentives,
          additionalNotes: closedDeal.additionalNotes,
          status: "closed",
          timestamp: closedDeal.timestamp
        }
      }
    }
    
    if (!intent) {
      console.error('Intent not found for deal:', deal)
      return
    }

    setSelectedDeal(deal)
    setSelectedIntent(intent)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedDeal(null)
    setSelectedIntent(null)
  }

  const handleDealAccepted = (intentId, winningBankName) => {
    handleCloseDeal(intentId, winningBankName)
  }

  const handleDealCancelled = (intentId) => {
    // Remove all ongoing deals for this intent
    setOngoingDeals(prev => prev.filter(deal => deal.intentId !== intentId))

    setIntentEvaluations(prev => {
      const next = { ...prev }
      delete next[intentId]
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentRole={currentRole}
        selectedBank={selectedBank}
        selectedCompany={selectedCompany}
        onRoleChange={handleRoleChange}
        onBankSelection={handleBankSelection}
        onCompanySelection={handleCompanySelection}
        permissions={permissions}
      />

      {permissions.canCreateIntents && (
        <IntentForm
          onCreateIntent={handleCreateIntent}
          currentRole={currentRole}
          selectedCompany={selectedCompany}
        />
      )}

      <KanbanBoard
        intents={intents}
        ongoingDeals={ongoingDeals}
        closedDeals={closedDeals}
        currentRole={currentRole}
        selectedBank={selectedBank}
        permissions={permissions}
        onExpressInterest={handleExpressInterest}
        onCloseDeal={handleCloseDeal}
        onDeleteIntent={handleDeleteIntent}
        onOpenNegotiation={handleOpenNegotiation}
        onEvaluateAllOffers={handleEvaluateAllOffers}
        evaluationSummaries={intentEvaluations}
        evaluationLoading={evaluationLoading}
      />

      {/* Negotiation Drawer */}
      <NegotiationDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        deal={selectedDeal}
        intent={selectedIntent}
        currentRole={currentRole}
        selectedBank={selectedBank}
        onDealAccepted={handleDealAccepted}
        onDealCancelled={handleDealCancelled}
      />
    </div>
  )
}

export default App