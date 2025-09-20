import { useState } from 'react'
import Header from './components/Header/Header'
import IntentForm from './components/IntentForm/IntentForm'
import KanbanBoard from './components/KanbanBoard/KanbanBoard'
import NegotiationDrawer from './components/NegotiationDrawer/NegotiationDrawer'
import { sampleData } from './data/sampleData'
import { rolePermissions } from './utils/rolePermissions'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const [currentRole, setCurrentRole] = useState('company')
  const [selectedBank, setSelectedBank] = useState('')
  const [intents, setIntents] = useState(sampleData.intents)
  const [ongoingDeals, setOngoingDeals] = useState(sampleData.ongoingDeals)
  const [closedDeals, setClosedDeals] = useState(sampleData.closedDeals)
  const [nextIntentId, setNextIntentId] = useState(1004)

  // Negotiation drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [selectedIntent, setSelectedIntent] = useState(null)

  const permissions = rolePermissions[currentRole] || {}

  const handleRoleChange = (role) => {
    setCurrentRole(role)
    setSelectedBank('')
    // Close drawer when role changes
    setIsDrawerOpen(false)
  }

  const handleBankSelection = (bank) => {
    setSelectedBank(bank)
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

    // Create closed deal
    const closedDeal = {
      id: intentId,
      companyName: intent.companyName,
      winningBank: winningBankName,
      amount: intent.amount,
      timestamp: new Date().toISOString()
    }

    // Remove intent from open intents
    setIntents(prev => prev.filter(i => i.id !== intentId))
    
    // Remove all ongoing deals for this intent
    setOngoingDeals(prev => prev.filter(deal => deal.intentId !== intentId))
    
    // Add to closed deals
    setClosedDeals(prev => [...prev, closedDeal])
  }

  const handleDeleteIntent = (intentId) => {
    if (!permissions.canDelete) return

    setIntents(prev => prev.filter(i => i.id !== intentId))
    setOngoingDeals(prev => prev.filter(deal => deal.intentId !== intentId))
  }

  // Negotiation drawer handlers
  const handleOpenNegotiation = (deal) => {
    // Find the corresponding intent for this deal
    const intent = intents.find(i => i.id === deal.intentId) || 
                  closedDeals.find(i => i.id === deal.intentId)
    
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentRole={currentRole}
        selectedBank={selectedBank}
        onRoleChange={handleRoleChange}
        onBankSelection={handleBankSelection}
        permissions={permissions}
      />
      
      {permissions.canCreateIntents && (
        <IntentForm
          onCreateIntent={handleCreateIntent}
          currentRole={currentRole}
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