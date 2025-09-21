export const sampleData = {
  intents: [
    {
      id: 1001,
      companyName: "Aurora Renewables",
      amount: 3500000,
      duration: 48,
      purpose: "Expand hybrid solar and battery storage assets for community energy contracts",
      status: "open",
      timestamp: "2025-09-20T01:30:00Z"
    },
    {
      id: 1002,
      companyName: "BlueRiver Logistics",
      amount: 1250000,
      duration: 36,
      purpose: "Electrify regional distribution fleet and install smart-charging depots",
      status: "open",
      timestamp: "2025-09-20T01:15:00Z"
    },
    {
      id: 1003,
      companyName: "MediBridge Health",
      amount: 800000,
      duration: 24,
      purpose: "Launch telehealth platform for rural clinics with responsible AI triage safeguards",
      status: "open",
      timestamp: "2025-09-20T02:00:00Z"
    }
  ],
  ongoingDeals: [
    {
      id: "deal-1",
      intentId: 1001,
      companyName: "Aurora Renewables",
      bankName: "Alpha Bank",
      timestamp: "2025-09-20T01:35:00Z"
    },
    {
      id: "deal-2",
      intentId: 1001,
      companyName: "Aurora Renewables",
      bankName: "Zeta Commercial",
      timestamp: "2025-09-20T01:36:30Z"
    },
    {
      id: "deal-3",
      intentId: 1002,
      companyName: "BlueRiver Logistics",
      bankName: "Delta Bank",
      timestamp: "2025-09-20T01:28:00Z"
    },
    {
      id: "deal-4",
      intentId: 1003,
      companyName: "MediBridge Health",
      bankName: "Gamma Capital",
      timestamp: "2025-09-20T02:05:00Z"
    }
  ],
  closedDeals: [
    {
      id: 1000,
      companyName: "Harbor Manufacturing Group",
      winningBank: "Delta Bank",
      amount: 2200000,
      duration: 48,
      purpose: "Factory electrification, robotics upgrade, and supplier ESG integration",
      timestamp: "2025-09-19T15:45:00Z"
    },
    {
      id: 999,
      companyName: "CivicWell Housing",
      winningBank: "Epsilon Trust",
      amount: 1500000,
      duration: 72,
      purpose: "Net-zero affordable housing retrofit programme with resilience upgrades",
      timestamp: "2025-09-19T10:30:00Z"
    }
  ]
}

export const availableBanks = [
  "Alpha Bank",
  "Beta Financial",
  "Gamma Capital",
  "Delta Bank",
  "Epsilon Trust",
  "Zeta Commercial"
]

export const availableCompanies = [
  {
    id: "aurora-renewables",
    name: "Aurora Renewables",
    description: "Utility-scale clean energy developer with community benefit agreements"
  },
  {
    id: "blueriver-logistics",
    name: "BlueRiver Logistics",
    description: "National logistics operator decarbonising fleet operations"
  },
  {
    id: "civicwell-housing",
    name: "CivicWell Housing",
    description: "Mission-driven housing developer delivering resilient net-zero communities"
  },
  {
    id: "medibridge-health",
    name: "MediBridge Health",
    description: "Healthcare technology company expanding telehealth access with robust governance"
  },
  {
    id: "harbor-manufacturing-group",
    name: "Harbor Manufacturing Group",
    description: "Advanced manufacturer electrifying operations and enforcing responsible supply chains"
  }
]

export const roles = [
  {
    id: "company",
    name: "Company",
    description: "Create intents and close deals"
  },
  {
    id: "bank", 
    name: "Bank",
    description: "Express interest and manage deals"
  },
  {
    id: "admin",
    name: "Admin", 
    description: "Full system access and management"
  },
  {
    id: "guest",
    name: "Guest",
    description: "View-only access to all data" 
  }
]