// Chat storage utilities for managing conversation history
const CHAT_STORAGE_KEY = 'agenticCreditMarket_chatSessions'

// Get all chat sessions from localStorage
export const getChatSessions = () => {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error reading chat sessions:', error)
    return {}
  }
}

// Save chat sessions to localStorage
export const saveChatSessions = (sessions) => {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions))
  } catch (error) {
    console.error('Error saving chat sessions:', error)
  }
}

// Get chat session for a specific deal
export const getChatSession = (dealId) => {
  const sessions = getChatSessions()
  return sessions[dealId] || {
    messages: [],
    status: 'pending_verification', // pending_verification, verified, in_progress, accepted, cancelled
    startedAt: new Date().toISOString(),
    lastActivity: new Date().toISOString()
  }
}

// Save chat session for a specific deal
export const saveChatSession = (dealId, session) => {
  const sessions = getChatSessions()
  sessions[dealId] = {
    ...session,
    lastActivity: new Date().toISOString()
  }
  saveChatSessions(sessions)
}

// Add message to chat session
export const addMessageToSession = (dealId, message) => {
  const session = getChatSession(dealId)
  const newMessage = {
    id: Date.now() + Math.random(),
    ...message,
    timestamp: new Date().toISOString()
  }
  
  session.messages.push(newMessage)
  saveChatSession(dealId, session)
  return newMessage
}

// Update chat session status
export const updateSessionStatus = (dealId, status) => {
  const session = getChatSession(dealId)
  session.status = status
  saveChatSession(dealId, session)
}

// Clear all chat sessions (for development/testing)
export const clearAllChatSessions = () => {
  localStorage.removeItem(CHAT_STORAGE_KEY)
}

// Generate a unique deal ID for ongoing deals
export const generateDealId = (intentId, bankName) => {
  return `${intentId}-${bankName.replace(/\s+/g, '-').toLowerCase()}`
}