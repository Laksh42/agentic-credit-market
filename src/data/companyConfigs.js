// Company configurations for negotiation preferences
export const companyConfigs = {
  "TechStart Solutions": {
    urgency: "high",
    acceptableInterestRate: "up to 8%",
    collateralAvailability: "limited equipment",
    creditScore: 720,
    cashFlow: "positive but variable",
    businessStage: "growth",
    negotiationStyle: "flexible",
    priorityFactors: ["speed", "low collateral requirements"],
    maxAcceptableRate: 8.5,
    preferredDuration: "12-24 months",
    industry: "technology",
    riskProfile: "medium"
  },
  "Green Energy Corp": {
    urgency: "medium",
    acceptableInterestRate: "up to 6%",
    collateralAvailability: "substantial assets and equipment",
    creditScore: 780,
    cashFlow: "strong and stable",
    businessStage: "expansion",
    negotiationStyle: "thorough",
    priorityFactors: ["low interest rate", "long term"],
    maxAcceptableRate: 7.0,
    preferredDuration: "36-60 months",
    industry: "renewable energy",
    riskProfile: "low-medium"
  },
  "HealthTech Innovations": {
    urgency: "medium-high",
    acceptableInterestRate: "up to 7%",
    collateralAvailability: "intellectual property and equipment",
    creditScore: 690,
    cashFlow: "growing but uneven",
    businessStage: "development",
    negotiationStyle: "cautious",
    priorityFactors: ["flexible terms", "understanding of industry"],
    maxAcceptableRate: 7.5,
    preferredDuration: "18-36 months",
    industry: "healthcare technology",
    riskProfile: "medium-high"
  },
  "Manufacturing Plus": {
    urgency: "low",
    acceptableInterestRate: "up to 6.5%",
    collateralAvailability: "extensive machinery and property",
    creditScore: 750,
    cashFlow: "stable and predictable",
    businessStage: "established",
    negotiationStyle: "methodical",
    priorityFactors: ["competitive rates", "established relationship"],
    maxAcceptableRate: 7.0,
    preferredDuration: "24-48 months",
    industry: "manufacturing",
    riskProfile: "low"
  },
  "Retail Dynamics": {
    urgency: "high",
    acceptableInterestRate: "up to 9%",
    collateralAvailability: "inventory and store assets",
    creditScore: 680,
    cashFlow: "seasonal variations",
    businessStage: "mature",
    negotiationStyle: "results-oriented",
    priorityFactors: ["quick approval", "seasonal flexibility"],
    maxAcceptableRate: 9.5,
    preferredDuration: "12-30 months",
    industry: "retail",
    riskProfile: "medium"
  }
}

// Generate company config for any company not in the predefined list
export const generateCompanyConfig = (companyName, intent) => {
  // Determine industry from purpose or company name
  const purpose = intent.purpose.toLowerCase()
  let industry = "general business"
  
  if (purpose.includes("tech") || purpose.includes("software") || purpose.includes("digital")) {
    industry = "technology"
  } else if (purpose.includes("health") || purpose.includes("medical") || purpose.includes("pharma")) {
    industry = "healthcare"
  } else if (purpose.includes("energy") || purpose.includes("solar") || purpose.includes("renewable")) {
    industry = "renewable energy"
  } else if (purpose.includes("manufacturing") || purpose.includes("production") || purpose.includes("factory")) {
    industry = "manufacturing"
  } else if (purpose.includes("retail") || purpose.includes("store") || purpose.includes("shop")) {
    industry = "retail"
  }

  // Generate config based on loan amount and industry
  const amount = intent.amount
  let urgency = "medium"
  let maxRate = 7.5
  let riskProfile = "medium"
  
  if (amount > 1000000) {
    urgency = "low"
    maxRate = 7.0
    riskProfile = "low-medium"
  } else if (amount < 250000) {
    urgency = "high"
    maxRate = 9.0
    riskProfile = "medium-high"
  }

  return {
    urgency,
    acceptableInterestRate: `up to ${maxRate}%`,
    collateralAvailability: "standard business assets",
    creditScore: 650 + Math.floor(Math.random() * 100),
    cashFlow: "variable",
    businessStage: "growth",
    negotiationStyle: "balanced",
    priorityFactors: ["competitive terms", "reasonable timeline"],
    maxAcceptableRate: maxRate,
    preferredDuration: `${intent.duration}-${intent.duration + 12} months`,
    industry,
    riskProfile
  }
}