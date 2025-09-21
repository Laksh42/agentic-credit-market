import axios from 'axios'

const formatList = (items, fallback = 'None specified') => {
  if (Array.isArray(items) && items.length > 0) {
    return items.join(', ')
  }
  return fallback
}

const formatNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString()
  }
  return value ?? 'Not specified'
}

const formatESGWeights = (weights) => {
  if (!weights || typeof weights !== 'object') {
    return 'Environmental 40%, Social 30%, Governance 30%'
  }

  return Object.entries(weights)
    .map(([key, value]) => {
      let display = value
      if (typeof value === 'number') {
        display = value <= 1 ? `${Math.round(value * 100)}%` : `${Math.round(value)}%`
      }
      const label = key.charAt(0).toUpperCase() + key.slice(1)
      return `${label} ${display}`
    })
    .join(', ')
}

const safeText = (value, fallback = 'Not specified') => {
  if (value === null || value === undefined) {
    return fallback
  }
  return String(value)
}

const toArray = (value) => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.filter(item => item !== null && item !== undefined && String(item).trim() !== '')
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }
  return [value].filter(Boolean)
}

const buildIntentContext = (intent = {}) => {
  return {
    companyName: intent.companyName || 'Unknown company',
    request: {
      amountUSD: intent.amount,
      durationMonths: intent.duration,
      purpose: intent.purpose,
      useOfFundsDetail: intent.useOfFundsDetail,
      esgFocusAreas: toArray(intent.esgFocusAreas),
      impactObjectives: intent.impactObjectives,
      collateralOffered: intent.collateralOffered,
      requestedIncentives: intent.requestedIncentives,
      additionalNotes: intent.additionalNotes || null
    }
  }
}

const formatIntentSummary = (intent = {}) => {
  const focusAreas = toArray(intent.esgFocusAreas)
  const lines = [
    `- Company: ${safeText(intent.companyName, 'Not specified')}`,
    `- Requested Amount: $${formatNumber(intent.amount)}`,
    `- Tenor: ${safeText(intent.duration, 'Not specified')} months`,
    `- Purpose: ${safeText(intent.purpose, 'Not provided')}`
  ]

  if (intent.useOfFundsDetail) {
    lines.push(`- Detailed Use of Funds: ${safeText(intent.useOfFundsDetail)}`)
  }

  if (focusAreas.length > 0) {
    lines.push(`- ESG Focus Areas: ${focusAreas.join(', ')}`)
  }

  if (intent.impactObjectives) {
    lines.push(`- Impact Objectives: ${safeText(intent.impactObjectives)}`)
  }

  if (intent.collateralOffered) {
    lines.push(`- Collateral Offered: ${safeText(intent.collateralOffered)}`)
  }

  if (intent.requestedIncentives) {
    lines.push(`- Incentives Requested: ${safeText(intent.requestedIncentives)}`)
  }

  if (intent.additionalNotes) {
    lines.push(`- Additional Notes: ${safeText(intent.additionalNotes)}`)
  }

  return lines.join('\n')
}

const extractJsonObject = (text) => {
  if (!text || typeof text !== 'string') {
    return null
  }

  const cleaned = text
    .replace(/```json/gi, '```')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch (error) {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')

    if (start !== -1 && end !== -1 && end > start) {
      const candidate = cleaned.slice(start, end + 1)
      try {
        return JSON.parse(candidate)
      } catch (nestedError) {
        console.warn('Failed to parse model JSON block', nestedError)
      }
    }
  }

  return null
}

// Mock identity verification function
export const verifyIdentity = async (companyName, intent) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return Math.random() > 0.2
}

// Generate initial bank offer using LLM
export const generateOfferLLM = async (intent, bankConfig = {}, bankName) => {
  try {
    const intentContext = buildIntentContext(intent)

    const systemPrompt = `You are the structured credit AI officer for ${bankName}. Use the bank's credit guardrails and ESG commitments to craft a sustainability-aware proposal.


Bank Credit & ESG Parameters:
- Risk Appetite: ${safeText(bankConfig.riskTolerance)}
- Preferred Interest Rate Range: ${safeText(bankConfig.preferredInterestRate)}
- Ticket Size: $${formatNumber(bankConfig.minLoanAmount)} - $${formatNumber(bankConfig.maxLoanAmount)}
- Preferred Tenor: ${safeText(bankConfig.preferredDuration)}
- Collateral Position: ${safeText(bankConfig.requiredCollateral)}
- Credit Score Requirement: ${safeText(bankConfig.creditScoreRequirement)}
- Processing Fee: ${safeText(bankConfig.processingFee)}
- Negotiation Style: ${safeText(bankConfig.negotiationStyle)}
- Specialisations: ${formatList(bankConfig.specializations)}
- Decision Speed: ${safeText(bankConfig.decisionSpeed)}
- Flexibility: ${safeText(bankConfig.flexibility)}
- ESG Focus Areas: ${formatList(bankConfig.esgFocusAreas)}
- ESG Exclusion List: ${formatList(bankConfig.esgExclusionList)}
- Minimum ESG Score: ${safeText(bankConfig.esgMinimumScore)}
- ESG Incentives: ${safeText(bankConfig.esgIncentives)}
- ESG Reporting Expectations: ${safeText(bankConfig.esgReportingExpectations)}
- ESG Scoring Weights: ${formatESGWeights(bankConfig.esgScoringWeights)}
- Impact Preference: ${safeText(bankConfig.impactPreference)}
- Transition Finance Policy: ${safeText(bankConfig.transitionFinancePolicy)}

Respond with a single JSON object matching this schema:
{
  "intent_context": <echo the provided intent JSON with any clarifying annotations>,
  "bank_offer": {
    "summary": "One paragraph overview",
    "credit_terms": {
      "loan_amount": "...",
      "interest_rate": "...",
      "tenor_months": "...",
      "collateral_requirements": "...",
      "fees": "...",
      "other_terms": "..."
    },
    "esg_alignment": {
      "fit": "How the offer aligns to ESG policies",
      "incentives": "Applicable sustainability-linked incentives",
      "monitoring": "Reporting or KPI expectations"
    },
    "conditions": ["..."],
    "next_steps": "Closing guidance"
  },
  "offer_explanation": "Narrative justification and tone for the bank to share"
}
Use valid JSON with double quotes and no trailing commentary.`

    const userContent = `Intent Summary:
${formatIntentSummary(intent)}

Intent JSON:
${JSON.stringify(intentContext, null, 2)}

Generate the JSON response now.`

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-oss-20b:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`
        }
      }
    )

    const responseContent = response.data.choices[0].message.content || ''
    const parsed = extractJsonObject(responseContent)

    const explanationRaw = parsed?.offer_explanation || parsed?.explanation || parsed?.rationale || ''

    return {
      intentContext: parsed?.intent_context || intentContext,
      offerPayload: parsed?.bank_offer || parsed?.offer || null,
      explanation: typeof explanationRaw === 'string'
        ? explanationRaw
        : explanationRaw
          ? JSON.stringify(explanationRaw, null, 2)
          : '',
      raw: responseContent
    }
  } catch (error) {
    console.error('OpenRouter API error:', error)
    throw new Error('Failed to generate offer. Please try again.')
  }
}

// Generate bank counter-offer using chat history
export const generateCounterOfferLLM = async (conversation, bankConfig = {}, bankName, intent) => {
  try {
    const chatHistory = conversation.map(msg => `${msg.sender}: ${msg.content}`).join('\n')

    const systemPrompt = `You are the negotiation lead for ${bankName}. Craft a counter-offer that respects the bank's credit policy and ESG parameters while progressing the deal.

Bank Profile Snapshot:
- Risk Appetite: ${safeText(bankConfig.riskTolerance)}
- Interest Rate Range: ${safeText(bankConfig.preferredInterestRate)}
- Flexibility: ${safeText(bankConfig.flexibility)}
- Negotiation Style: ${safeText(bankConfig.negotiationStyle)}
- ESG Focus Areas: ${formatList(bankConfig.esgFocusAreas)}
- ESG Incentives: ${safeText(bankConfig.esgIncentives)}
- Minimum ESG Score: ${safeText(bankConfig.esgMinimumScore)}
- Transition Finance Policy: ${safeText(bankConfig.transitionFinancePolicy)}

Respond in this structure:
Response Summary:
- Revised Rate:
- Tenor:
- Collateral:
ESG Alignment Update:
- How the counter maintains ESG guardrails
Conditions & Monitoring:
- Any additional requirements or reporting cadence
Negotiation Message:
- 2 short paragraphs addressed to ${intent.companyName} summarising rationale.`

    const userContent = `Intent context:
${formatIntentSummary(intent)}

Negotiation conversation so far:
${chatHistory || 'No prior messages'}

Provide the counter-offer using the specified structure.`

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-oss-20b:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`
        }
      }
    )

    return response.data.choices[0].message.content
  } catch (error) {
    console.error('OpenRouter API error:', error)
    throw new Error('Failed to generate counter-offer. Please try again.')
  }
}

// Evaluate offer and generate company response
export const evaluateOfferLLM = async (intent, bankOffer, companyConfig = {}, bankConfig = {}, bankName, conversation = []) => {
  try {
    const chatHistory = conversation.length > 0
      ? conversation.map(msg => `${msg.sender}: ${msg.content}`).join('\n')
      : 'This is the first offer from the bank.'

    const systemPrompt = `You are the sustainability-focused credit lead for ${intent.companyName}. Assess ${bankName}'s latest offer against the company's credit preferences and ESG commitments, then craft an appropriate response.

Company Credit & ESG Profile:
- Urgency: ${safeText(companyConfig.urgency)}
- Acceptable Interest Rate: ${safeText(companyConfig.acceptableInterestRate)}
- Max Acceptable Rate: ${safeText(companyConfig.maxAcceptableRate)}%
- Preferred Duration: ${safeText(companyConfig.preferredDuration)}
- Collateral Availability: ${safeText(companyConfig.collateralAvailability)}
- Credit Score: ${safeText(companyConfig.creditScore)}
- Negotiation Style: ${safeText(companyConfig.negotiationStyle)}
- Priority Factors: ${formatList(companyConfig.priorityFactors)}
- ESG Score: ${safeText(companyConfig.esgScore)}
- ESG Certifications: ${formatList(companyConfig.esgCertifications)}
- Impact Metrics: ${formatList(companyConfig.impactMetrics)}
- Sustainability Goals: ${safeText(companyConfig.sustainabilityGoals)}
- ESG Reporting Frameworks: ${formatList(companyConfig.esgReportingFrameworks)}
- ESG Constraints: ${formatList(companyConfig.esgConstraints)}

Bank Offer Context:
- Bank Negotiation Style: ${safeText(bankConfig.negotiationStyle)}
- ESG Focus Areas: ${formatList(bankConfig.esgFocusAreas)}
- Minimum ESG Score: ${safeText(bankConfig.esgMinimumScore)}
- ESG Incentives: ${safeText(bankConfig.esgIncentives)}
- Reporting Expectations: ${safeText(bankConfig.esgReportingExpectations)}
- Impact Preference: ${safeText(bankConfig.impactPreference)}
- Transition Policy: ${safeText(bankConfig.transitionFinancePolicy)}

Respond with a message that begins with "Decision: ACCEPT", "Decision: COUNTER", or "Decision: DECLINE". After the decision line, include:
ESG Assessment:
- Bullet list on ESG alignment or gaps
Key Considerations:
- Credit or structuring factors influencing the decision
Negotiation Message:
- 2 short paragraphs addressed to ${bankName} summarising the rationale and, if countering, the revised terms (interest rate, tenor, collateral expectations).
Keep the overall response concise.`

    const userContent = `Intent Summary:
${formatIntentSummary(intent)}

Conversation so far:
${chatHistory}

Current Bank Offer:
${bankOffer}

Produce the decision-oriented response now.`

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-oss-20b:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`
        }
      }
    )

    const responseContent = response.data.choices[0].message.content?.trim() || ''

    const decisionMatch = responseContent.match(/Decision\s*:\s*([^\n]+)/i)
    const rawDecision = decisionMatch ? decisionMatch[1].trim() : null
    const normalizedDecision = rawDecision ? rawDecision.toUpperCase() : null
    const isAcceptance = normalizedDecision
      ? normalizedDecision.includes('ACCEPT') || normalizedDecision.includes('APPROVE')
      : false

    return {
      content: responseContent,
      isAcceptance,
      decision: normalizedDecision
    }
  } catch (error) {
    console.error('OpenRouter API error:', error)
    throw new Error('Failed to evaluate offer. Please try again.')
  }
}

// Evaluate multiple offers collectively for a single intent
export const evaluateAllOffersLLM = async (intent, offers = [], companyConfig = {}) => {
  try {
    const offersOverview = offers.map((offer, index) => {
      const bankConfig = offer.bankConfig || {}
      return `Offer ${index + 1} - ${offer.bankName}:
Status: ${safeText(offer.negotiationStatus, 'unknown')}
Latest Offer Summary: ${offer.latestOffer || 'No formalised offer.'}
Bank ESG Focus: ${formatList(bankConfig.esgFocusAreas)}
ESG Exclusion List: ${formatList(bankConfig.esgExclusionList)}
Minimum ESG Score: ${safeText(bankConfig.esgMinimumScore)}
ESG Incentives: ${safeText(bankConfig.esgIncentives)}
Reporting Expectations: ${safeText(bankConfig.esgReportingExpectations)}
Impact Preference: ${safeText(bankConfig.impactPreference)}
Conversation Highlights:
${offer.conversationExcerpt || 'No conversation history captured yet.'}`
    }).join('\n\n---\n\n')

    const systemPrompt = `You are the sustainability credit strategist advising ${intent.companyName}. Review all bank proposals at once and recommend the path that best balances credit fit with ESG commitments.

Company Credit & ESG Profile:
- Urgency: ${safeText(companyConfig.urgency)}
- Acceptable Interest Rate: ${safeText(companyConfig.acceptableInterestRate)}
- Max Acceptable Rate: ${safeText(companyConfig.maxAcceptableRate)}%
- Preferred Duration: ${safeText(companyConfig.preferredDuration)}
- Collateral Availability: ${safeText(companyConfig.collateralAvailability)}
- Credit Score: ${safeText(companyConfig.creditScore)}
- Negotiation Style: ${safeText(companyConfig.negotiationStyle)}
- Priority Factors: ${formatList(companyConfig.priorityFactors)}
- ESG Score: ${safeText(companyConfig.esgScore)}
- ESG Certifications: ${formatList(companyConfig.esgCertifications)}
- Impact Metrics: ${formatList(companyConfig.impactMetrics)}
- Sustainability Goals: ${safeText(companyConfig.sustainabilityGoals)}
- ESG Reporting Frameworks: ${formatList(companyConfig.esgReportingFrameworks)}
- ESG Constraints: ${formatList(companyConfig.esgConstraints)}

Respond with:
Decision: SELECT <Bank Name> | REQUEST_REVISIONS | DECLINE_ALL
Recommended Partner: <Bank Name or NONE>
Rationale:
- Bullet list explaining the recommendation
Offer Ranking:
1. ...
2. ...
ESG Alignment Summary:
- Bullet list referencing how each offer meets or misses ESG requirements
Next Steps:
- Actionable items for the company team`

    const userContent = `Intent Details:
${formatIntentSummary(intent)}

Offers Under Review:
${offersOverview || 'No offers have been submitted yet.'}

Deliver the decision using the required format.`

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-oss-20b:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`
        }
      }
    )

    const responseContent = response.data.choices[0].message.content?.trim() || ''
    const decisionMatch = responseContent.match(/Decision\s*:\s*([^\n]+)/i)
    const recommendedMatch = responseContent.match(/Recommended Partner\s*:\s*([^\n]+)/i)

    return {
      content: responseContent,
      decision: decisionMatch ? decisionMatch[1].trim().toUpperCase() : null,
      recommendedPartner: recommendedMatch ? recommendedMatch[1].trim() : null
    }
  } catch (error) {
    console.error('OpenRouter API error:', error)
    throw new Error('Failed to evaluate offers collectively. Please try again.')
  }
}
