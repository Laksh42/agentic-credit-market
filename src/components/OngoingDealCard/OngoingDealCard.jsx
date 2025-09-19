import { format } from 'date-fns'

const OngoingDealCard = ({ deal, currentRole, permissions, onCloseDeal }) => {
  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), 'MMM dd, yyyy HH:mm')
  }

  const handleCloseDeal = () => {
    if (permissions.canCloseDeal && !permissions.isReadOnly) {
      onCloseDeal(deal.intentId, deal.bankName)
    }
  }

  const canCloseDeal = () => {
    return permissions.canCloseDeal && !permissions.isReadOnly
  }

  return (
    <div className="bg-white border border-warning-200 rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-200 hover:-translate-y-1 animate-slide-up">
      {/* Card Header */}
      <div className="p-4 pb-3 border-b border-gray-100 bg-gradient-to-r from-warning-50/50 to-warning-100/50">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-warning-700">
            Intent #{deal.intentId}
          </h3>
          <span className="text-xs text-gray-600 font-medium mt-0.5">
            Started: {formatTimestamp(deal.timestamp)}
          </span>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-4 space-y-4">
        <div className="text-lg font-semibold text-gray-900">
          {deal.companyName}
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Bank:</span>
            <span className="text-sm font-bold text-gray-900">{deal.bankName}</span>
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-warning-100 text-warning-800 rounded-full text-xs font-semibold w-fit">
            <span>⏳</span>
            In Negotiation
          </div>
        </div>
      </div>
      
      {/* Card Actions */}
      {canCloseDeal() && (
        <div className="p-4 pt-3 border-t border-gray-100 bg-gradient-to-r from-warning-50/30 to-warning-100/30">
          <button 
            className="w-full btn btn-success hover:scale-105 transition-transform duration-200"
            onClick={handleCloseDeal}
          >
            Close Deal with {deal.bankName}
          </button>
        </div>
      )}
    </div>
  )
}

export default OngoingDealCard