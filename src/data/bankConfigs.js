export const bankConfigs = {
  "Alpha Bank": {
    riskTolerance: "medium",
    preferredInterestRate: "6-8%",
    maxLoanAmount: 5000000,
    minLoanAmount: 100000,
    preferredDuration: "12-36 months",
    requiredCollateral: "property or assets",
    creditScoreRequirement: "700+",
    processingFee: "1-2%",
    negotiationStyle: "conservative",
    specializations: ["technology", "healthcare"],
    decisionSpeed: "fast",
    flexibility: "medium",
    esgFocusAreas: [
      "clean technology scale-ups",
      "resource-efficient manufacturing"
    ],
    esgExclusionList: [
      "coal expansion",
      "unsustainable palm oil",
      "weapons manufacturing"
    ],
    esgMinimumScore: 72,
    esgIncentives: "0.20% rate reduction for SBTi-validated plans and additional principal grace for emissions-linked KPIs",
    esgReportingExpectations: "Quarterly sustainability reports referencing TCFD and GRI metrics with audited carbon accounting",
    esgScoringWeights: { environmental: 0.45, social: 0.35, governance: 0.2 },
    impactPreference: "Looks for measurable Scope 1 and 2 carbon reductions and workforce transition plans",
    transitionFinancePolicy: "Supports borrowers with interim science-based targets for 2030 and board oversight on sustainability"
  },
  "Beta Financial": {
    riskTolerance: "high",
    preferredInterestRate: "5-7%",
    maxLoanAmount: 10000000,
    minLoanAmount: 250000,
    preferredDuration: "24-60 months",
    requiredCollateral: "flexible",
    creditScoreRequirement: "650+",
    processingFee: "0.5-1.5%",
    negotiationStyle: "aggressive",
    specializations: ["renewable energy", "manufacturing"],
    decisionSpeed: "medium",
    flexibility: "high",
    esgFocusAreas: [
      "renewable energy infrastructure",
      "circular economy manufacturing"
    ],
    esgExclusionList: [
      "thermal coal",
      "single-use plastics expansion"
    ],
    esgMinimumScore: 68,
    esgIncentives: "0.35% rate reduction for verified carbon-neutral operations with step-down incentives when impact KPIs are met",
    esgReportingExpectations: "Semi-annual sustainability dashboards referencing SASB and EU taxonomy metrics",
    esgScoringWeights: { environmental: 0.5, social: 0.3, governance: 0.2 },
    impactPreference: "Prioritizes projects delivering grid decarbonization or green job creation",
    transitionFinancePolicy: "Finances transition plans with transparent capex allocation to decarbonisation levers"
  },
  "Gamma Capital": {
    riskTolerance: "low",
    preferredInterestRate: "7-9%",
    maxLoanAmount: 3000000,
    minLoanAmount: 50000,
    preferredDuration: "6-24 months",
    requiredCollateral: "required",
    creditScoreRequirement: "750+",
    processingFee: "2-3%",
    negotiationStyle: "cautious",
    specializations: ["retail", "services"],
    decisionSpeed: "slow",
    flexibility: "low",
    esgFocusAreas: [
      "community health outcomes",
      "responsible retail supply chains"
    ],
    esgExclusionList: [
      "gambling expansion",
      "tobacco manufacturing",
      "labor-rights controversies"
    ],
    esgMinimumScore: 75,
    esgIncentives: "0.15% rate reduction when social impact KPIs are verified and payment holidays for inclusive hiring goals",
    esgReportingExpectations: "Annual impact reporting aligned to B Corp standards and independent social audits",
    esgScoringWeights: { environmental: 0.3, social: 0.45, governance: 0.25 },
    impactPreference: "Emphasizes supplier diversity programmes and patient access metrics",
    transitionFinancePolicy: "Prefers borrowers with board-level ESG committees overseeing ethics compliance"
  },
  "Delta Bank": {
    riskTolerance: "medium-high",
    preferredInterestRate: "5.5-7.5%",
    maxLoanAmount: 7500000,
    minLoanAmount: 200000,
    preferredDuration: "18-48 months",
    requiredCollateral: "preferred but flexible",
    creditScoreRequirement: "680+",
    processingFee: "1-2%",
    negotiationStyle: "balanced",
    specializations: ["technology", "manufacturing", "healthcare"],
    decisionSpeed: "fast",
    flexibility: "high",
    esgFocusAreas: [
      "smart manufacturing efficiency",
      "low-carbon logistics",
      "healthcare innovation"
    ],
    esgExclusionList: [
      "coal-fired power procurement",
      "deforestation-linked sourcing"
    ],
    esgMinimumScore: 70,
    esgIncentives: "0.25% blended-rate reduction for digital energy monitoring and green fleet conversion milestones",
    esgReportingExpectations: "Quarterly KPI tracking via shared sustainability dashboards aligned with ISO 14001",
    esgScoringWeights: { environmental: 0.4, social: 0.3, governance: 0.3 },
    impactPreference: "Targets measurable energy intensity reductions and workforce safety improvements",
    transitionFinancePolicy: "Requires transition plans with 2028 interim emissions targets and supplier engagement strategy"
  },
  "Epsilon Trust": {
    riskTolerance: "low-medium",
    preferredInterestRate: "6.5-8.5%",
    maxLoanAmount: 4000000,
    minLoanAmount: 75000,
    preferredDuration: "12-30 months",
    requiredCollateral: "required",
    creditScoreRequirement: "720+",
    processingFee: "1.5-2.5%",
    negotiationStyle: "methodical",
    specializations: ["real estate", "construction"],
    decisionSpeed: "medium",
    flexibility: "medium",
    esgFocusAreas: [
      "green buildings",
      "climate resilience infrastructure"
    ],
    esgExclusionList: [
      "single-use plastics manufacturing",
      "land speculation without community benefit"
    ],
    esgMinimumScore: 74,
    esgIncentives: "0.30% margin reduction for LEED Gold or WELL certified projects with resilience KPIs",
    esgReportingExpectations: "Biannual ESG reporting aligned to GRESB benchmarks and climate scenario analysis",
    esgScoringWeights: { environmental: 0.5, social: 0.25, governance: 0.25 },
    impactPreference: "Prioritizes projects delivering community resilience and sustainable materials sourcing",
    transitionFinancePolicy: "Mandates climate risk assessments aligned to NGFS scenarios and board-level oversight"
  },
  "Zeta Commercial": {
    riskTolerance: "high",
    preferredInterestRate: "4.5-6.5%",
    maxLoanAmount: 15000000,
    minLoanAmount: 500000,
    preferredDuration: "36-72 months",
    requiredCollateral: "not required for established companies",
    creditScoreRequirement: "600+",
    processingFee: "0.25-1%",
    negotiationStyle: "competitive",
    specializations: ["technology", "renewable energy", "innovation"],
    decisionSpeed: "very fast",
    flexibility: "very high",
    esgFocusAreas: [
      "innovation-driven climate solutions",
      "advanced recycling"
    ],
    esgExclusionList: [
      "fossil fuel exploration",
      "human rights controversies"
    ],
    esgMinimumScore: 66,
    esgIncentives: "0.40% rate reduction plus milestone-based grant tranches for breakthrough emissions technology",
    esgReportingExpectations: "Monthly KPI updates with API access to a shared sustainability data warehouse",
    esgScoringWeights: { environmental: 0.55, social: 0.25, governance: 0.2 },
    impactPreference: "Seeks outsized decarbonisation outcomes with scalable market potential",
    transitionFinancePolicy: "Backs transition plans tied to science-based trajectories with equity upside sharing"
  }
}