// Company configurations for negotiation preferences
export const companyConfigs = {
  "Aurora Renewables": {
    urgency: "medium-high",
    acceptableInterestRate: "up to 6.2%",
    collateralAvailability: "portfolio of PPA contracts and turbine assets",
    creditScore: 785,
    cashFlow: "long-term PPAs with tier-1 utilities",
    businessStage: "scale-up",
    negotiationStyle: "impact-focused",
    priorityFactors: [
      "certainty of funding",
      "pricing incentives for science-based targets"
    ],
    maxAcceptableRate: 6.5,
    preferredDuration: "36-84 months",
    industry: "renewable energy",
    riskProfile: "low-medium",
    esgScore: 86,
    esgCertifications: ["Science Based Targets initiative", "ISO 14001"],
    impactMetrics: ["annual avoided emissions", "community energy access reinvestment"],
    sustainabilityGoals: "Net-zero operations by 2030 with 15% community energy access allocation",
    esgReportingFrameworks: ["TCFD", "GRI"],
    esgConstraints: ["no partnerships with coal-dependent suppliers"]
  },
  "BlueRiver Logistics": {
    urgency: "medium",
    acceptableInterestRate: "up to 7%",
    collateralAvailability: "fleet assets and logistics hubs",
    creditScore: 710,
    cashFlow: "stable contracted revenues with major retailers",
    businessStage: "established",
    negotiationStyle: "data-driven",
    priorityFactors: [
      "green fleet financing",
      "flexible amortisation aligned to peak seasons"
    ],
    maxAcceptableRate: 7.2,
    preferredDuration: "24-48 months",
    industry: "logistics",
    riskProfile: "medium",
    esgScore: 72,
    esgCertifications: ["SmartWay Transport Partner"],
    impactMetrics: ["scope 1 emissions intensity", "driver safety performance"],
    sustainabilityGoals: "50% electric fleet conversion by 2028 and 30% reduction in empty miles",
    esgReportingFrameworks: ["SASB Transportation", "CDP"],
    esgConstraints: ["avoid lenders without fleet decarbonisation incentives"]
  },
  "CivicWell Housing": {
    urgency: "high",
    acceptableInterestRate: "up to 6.8%",
    collateralAvailability: "municipal guarantees and property portfolio",
    creditScore: 735,
    cashFlow: "stable rent rolls with municipal subsidies",
    businessStage: "mission-driven nonprofit",
    negotiationStyle: "collaborative",
    priorityFactors: [
      "community affordability covenants",
      "extended tenor"
    ],
    maxAcceptableRate: 7.0,
    preferredDuration: "60-120 months",
    industry: "real estate development",
    riskProfile: "low-medium",
    esgScore: 78,
    esgCertifications: ["Enterprise Green Communities"],
    impactMetrics: ["affordable units created", "resident well-being index"],
    sustainabilityGoals: "Deliver 500 net-zero affordable homes with resilience retrofits by 2032",
    esgReportingFrameworks: ["GRESB", "IRIS+"],
    esgConstraints: ["requires lenders supporting social impact reporting"]
  },
  "MediBridge Health": {
    urgency: "medium-high",
    acceptableInterestRate: "up to 7.4%",
    collateralAvailability: "medical equipment and IP portfolio",
    creditScore: 690,
    cashFlow: "growing subscription revenue from hospital networks",
    businessStage: "growth",
    negotiationStyle: "evidence-led",
    priorityFactors: [
      "clinical outcome incentives",
      "structured drawdowns"
    ],
    maxAcceptableRate: 7.8,
    preferredDuration: "18-36 months",
    industry: "healthcare technology",
    riskProfile: "medium-high",
    esgScore: 69,
    esgCertifications: ["HIPAA compliance attestation"],
    impactMetrics: ["patient access hours enabled", "reduced readmission rates"],
    sustainabilityGoals: "Expand telehealth access for 200 rural clinics while maintaining data governance best practices",
    esgReportingFrameworks: ["SASB Health Care Delivery", "HITECH"],
    esgConstraints: ["partners must support data privacy oversight and responsible AI policy"]
  },
  "Harbor Manufacturing Group": {
    urgency: "low",
    acceptableInterestRate: "up to 6.4%",
    collateralAvailability: "advanced machinery and owned facilities",
    creditScore: 760,
    cashFlow: "predictable OEM contracts with backlog visibility",
    businessStage: "established",
    negotiationStyle: "methodical",
    priorityFactors: [
      "capex for electrification",
      "supply-chain resilience"
    ],
    maxAcceptableRate: 6.8,
    preferredDuration: "36-72 months",
    industry: "advanced manufacturing",
    riskProfile: "low-medium",
    esgScore: 80,
    esgCertifications: ["ISO 50001", "Responsible Business Alliance"],
    impactMetrics: ["energy intensity per unit produced", "supplier ESG compliance rate"],
    sustainabilityGoals: "Achieve 60% renewable-powered operations by 2029 and zero waste-to-landfill by 2030",
    esgReportingFrameworks: ["SASB Industrial Machinery", "CDP"],
    esgConstraints: ["must maintain supplier code-of-conduct enforcement"]
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
  let esgScore = 72
  let sustainabilityGoals = "Implement credible emissions reductions within project scope"

  if (amount > 1000000) {
    urgency = "low"
    maxRate = 7.0
    riskProfile = "low-medium"
    esgScore = 78
    sustainabilityGoals = "Deliver multi-year efficiency improvements while meeting climate disclosure expectations"
  } else if (amount < 250000) {
    urgency = "high"
    maxRate = 9.0
    riskProfile = "medium-high"
    esgScore = 65
    sustainabilityGoals = "Secure quick capital while maintaining minimum ESG compliance"
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
    riskProfile,
    esgScore,
    esgCertifications: ["ISO 14001 (in progress)"],
    impactMetrics: ["baseline emissions reduction", "employee well-being"],
    sustainabilityGoals,
    esgReportingFrameworks: ["TCFD"],
    esgConstraints: ["must avoid high-controversy suppliers"]
  }
}