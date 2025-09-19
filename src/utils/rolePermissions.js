export const rolePermissions = {
  company: {
    canCreateIntents: true,
    canViewOpenIntents: true,
    canViewOngoingDeals: true,
    canViewClosedDeals: true,
    canExpressInterest: false,
    canCloseDeal: true,
    canDelete: false,
    isReadOnly: false
  },
  bank: {
    canCreateIntents: false,
    canViewOpenIntents: true,
    canViewOngoingDeals: true, // Only their own deals
    canViewClosedDeals: true,
    canExpressInterest: true,
    canCloseDeal: false,
    canDelete: false,
    isReadOnly: false
  },
  admin: {
    canCreateIntents: true,
    canViewOpenIntents: true,
    canViewOngoingDeals: true,
    canViewClosedDeals: true,
    canExpressInterest: true, // Can act as any bank
    canCloseDeal: true,
    canDelete: true,
    isReadOnly: false,
    isAdmin: true
  },
  guest: {
    canCreateIntents: false,
    canViewOpenIntents: true,
    canViewOngoingDeals: true,
    canViewClosedDeals: true,
    canExpressInterest: false,
    canCloseDeal: false,
    canDelete: false,
    isReadOnly: true
  }
}

export const getRoleDisplayName = (roleId) => {
  const roleNames = {
    company: 'Company',
    bank: 'Bank',
    admin: 'Admin',
    guest: 'Guest'
  }
  return roleNames[roleId] || roleId
}

export const canViewOngoingDeal = (role, selectedBank, deal) => {
  if (role === 'admin' || role === 'company' || role === 'guest') {
    return true
  }
  
  if (role === 'bank') {
    return deal.bankName === selectedBank
  }
  
  return false
}