import { format } from 'date-fns'
import { availableBanks } from '../../data/sampleData'

const IntentCard = ({
  intent,
  currentRole,
  selectedBank,
  permissions,
  onExpressInterest,
  onDeleteIntent,
  hasOngoingDeals,
  deals = [],
  onEvaluateAllOffers,
  evaluationSummary,
  isEvaluating
}) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), 'MMM dd, yyyy HH:mm')
  }

  const formatList = (value) => {
    if (!value) return null
    const items = Array.isArray(value) ? value : String(value).split(',')
    const cleaned = items
      .map(item => (typeof item === 'string' ? item.trim() : item))
      .filter(Boolean)
    if (cleaned.length === 0) return null
    return cleaned.join(', ')
  }

  const normalizedDeals = Array.isArray(deals) ? deals : []

  const bankHasExpressedInterest = currentRole === 'bank' && selectedBank
    ? normalizedDeals.some(deal => deal.bankName === selectedBank)
    : false

  const adminNextAvailableBank = availableBanks.find(bank =>
    !normalizedDeals.some(deal => deal.bankName === bank)
  )

  const handleExpressInterest = () => {
    if (!onExpressInterest) {
      return
    }

    if (currentRole === 'admin') {
      if (adminNextAvailableBank) {
        onExpressInterest(intent.id, adminNextAvailableBank)
      }
    } else if (currentRole === 'bank' && selectedBank && !bankHasExpressedInterest) {
      onExpressInterest(intent.id, selectedBank)
    }
  }

  const canExpressInterest = () => {
    if (!permissions?.canExpressInterest || permissions?.isReadOnly) return false
    if (currentRole === 'admin') return Boolean(adminNextAvailableBank)
    if (currentRole === 'bank' && selectedBank) return !bankHasExpressedInterest
    return false
  }

  const handleDelete = () => {
    if (permissions.canDelete) {
      onDeleteIntent(intent.id)
    }
  }

  const handleEvaluateAllOffers = () => {
    if (onEvaluateAllOffers) {
      onEvaluateAllOffers(intent.id)
    }
  }

  const dealsCount = normalizedDeals.length
  const canRunCompanyEvaluation = currentRole === 'company' && permissions.canViewOpenIntents
  const hasOfferData = dealsCount > 0

  const renderDecisionBadge = (decision) => {
    if (!decision) return null

    const normalized = decision.toUpperCase()
    let badgeClass = 'bg-gray-100 text-gray-700'

    if (normalized.includes('SELECT') || normalized.includes('ACCEPT')) {
      badgeClass = 'bg-success-100 text-success-800'
    } else if (normalized.includes('REQUEST') || normalized.includes('COUNTER')) {
      badgeClass = 'bg-warning-100 text-warning-800'
    } else if (normalized.includes('DECLINE') || normalized.includes('NO_OFFERS') || normalized.includes('ERROR')) {
      badgeClass = 'bg-danger-100 text-danger-700'
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${badgeClass}`}>
        {normalized.replace(/_/g, ' ')}
      </span>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-200 hover:-translate-y-1 animate-slide-up">
      {/* Card Header */}
      <div className="flex justify-between items-start p-4 pb-3 border-b border-gray-100">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-primary-600">
            Intent #{intent.id}
          </h3>
          <span className="text-xs text-gray-500 font-medium mt-0.5">
            {formatTimestamp(intent.timestamp)}
          </span>
        </div>
        
        {permissions.canDelete && (
          <button 
            className="w-6 h-6 rounded-md bg-gray-100 hover:bg-danger-500 text-gray-600 hover:text-white font-bold transition-all duration-200 flex items-center justify-center text-lg leading-none"
            onClick={handleDelete}
            title="Delete Intent"
          >
            ×
          </button>
        )}
      </div>
      
      {/* Card Body */}
      <div className="p-4 space-y-4">
        <div className="text-lg font-semibold text-gray-900">
          {intent.companyName}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Amount
            </span>
            <div className="text-sm font-bold text-gray-900">
              {formatAmount(intent.amount)}
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Duration
            </span>
            <div className="text-sm font-bold text-gray-900">
              {intent.duration} months
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Purpose
          </span>
          <p className="text-sm text-gray-700 leading-relaxed">
            {intent.purpose}
          </p>
        </div>

        {intent.useOfFundsDetail && (
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Detailed Use of Funds
            </span>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {intent.useOfFundsDetail}
            </p>
          </div>
        )}

        {formatList(intent.esgFocusAreas) && (
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              ESG Focus Areas
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {formatList(intent.esgFocusAreas)}
            </p>
          </div>
        )}

        {intent.impactObjectives && (
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Impact Objectives
            </span>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {intent.impactObjectives}
            </p>
          </div>
        )}

        {intent.collateralOffered && (
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Collateral / Guarantees
            </span>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {intent.collateralOffered}
            </p>
          </div>
        )}

        {intent.requestedIncentives && (
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Requested Incentives
            </span>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {intent.requestedIncentives}
            </p>
          </div>
        )}

        {intent.additionalNotes && (
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Additional Notes
            </span>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {intent.additionalNotes}
            </p>
          </div>
        )}
        
        {hasOngoingDeals && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-warning-100 text-warning-800 rounded-full text-xs font-semibold">
            <span>🤝</span>
            Has Active Negotiations
          </div>
        )}

        {currentRole === 'company' && evaluationSummary && (
          <div className="mt-3 bg-primary-50 border border-primary-200 text-primary-900 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide">AI ESG Review</span>
              {renderDecisionBadge(evaluationSummary.decision)}
            </div>
            {evaluationSummary.recommendedPartner && (
              <p className="text-sm font-semibold">
                Recommended Partner: <span className="text-primary-700">{evaluationSummary.recommendedPartner}</span>
              </p>
            )}
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {evaluationSummary.content}
            </p>
            {evaluationSummary.generatedAt && (
              <p className="text-[10px] text-primary-700 uppercase tracking-wide">
                Generated {new Date(evaluationSummary.generatedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Card Actions */}
      {canExpressInterest() && !permissions?.isReadOnly && (
        <div className="p-4 pt-3 border-t border-gray-100 bg-gray-50">
          <button
            className="w-full btn btn-success hover:scale-105 transition-transform duration-200"
            onClick={handleExpressInterest}
          >
            {currentRole === 'admin' ? 'Express Interest (Admin)' : 'Express Interest'}
          </button>
        </div>
      )}

      {currentRole === 'bank' && bankHasExpressedInterest && (
        <div className="p-4 pt-3 border-t border-gray-100 bg-gray-50">
          <div className="text-center text-xs text-gray-500 italic py-2">
            Your bank has already expressed interest in this intent.
          </div>
        </div>
      )}

      {currentRole === 'bank' && !selectedBank && (
        <div className="p-4 pt-3 border-t border-gray-100 bg-gray-50">
          <div className="text-center text-xs text-gray-500 italic py-2">
            Select a bank to express interest
          </div>
        </div>
      )}

      {canRunCompanyEvaluation && (
        <div className="p-4 pt-3 border-t border-gray-100 bg-gray-50 space-y-3">
          <button
            className={`w-full btn btn-primary ${hasOfferData ? 'hover:scale-105' : 'opacity-70 cursor-not-allowed'} ${isEvaluating ? 'opacity-60 cursor-wait' : ''}`}
            onClick={handleEvaluateAllOffers}
            disabled={!hasOfferData || isEvaluating}
          >
            {isEvaluating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Evaluating offers...
              </div>
            ) : (
              'Run ESG Offer Review'
            )}
          </button>
          {!hasOfferData && (
            <p className="text-xs text-gray-500 text-center">
              Waiting for banks to submit offers before running the ESG review.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default IntentCard
