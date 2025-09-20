import { format } from 'date-fns'

const ClosedDealCard = ({ deal, onOpenNegotiation }) => {
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

  const handleCardClick = () => {
    if (onOpenNegotiation) {
      // Create a deal object for closed deals to view chat history
      const dealForChat = {
        intentId: deal.id,
        companyName: deal.companyName,
        bankName: deal.winningBank
      }
      onOpenNegotiation(dealForChat)
    }
  }

  return (
    <div 
      className="bg-white border border-success-200 rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-200 hover:-translate-y-1 animate-slide-up cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Card Header */}
      <div className="flex justify-between items-start p-4 pb-3 border-b border-gray-100 bg-gradient-to-r from-success-50/50 to-success-100/50">
        <div className="flex flex-col">
          <div className="flex justify-between items-start w-full">
            <h3 className="text-base font-bold text-success-700">
              Intent #{deal.id}
            </h3>
            <div className="text-xs text-gray-500 font-medium ml-4">
              💬 View chat
            </div>
          </div>
          <span className="text-xs text-gray-600 font-medium mt-0.5">
            Closed: {formatTimestamp(deal.timestamp)}
          </span>
        </div>
        
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-success-100 text-success-800 rounded-md text-xs font-semibold">
          <span>✅</span>
          Completed
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-4 space-y-4">
        <div className="text-lg font-semibold text-gray-900">
          {deal.companyName}
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Winning Bank:</span>
            <span className="text-sm font-bold text-gray-900">{deal.winningBank}</span>
          </div>
          
          {deal.amount && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Amount:</span>
              <span className="text-sm font-bold text-success-700">
                {formatAmount(deal.amount)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClosedDealCard