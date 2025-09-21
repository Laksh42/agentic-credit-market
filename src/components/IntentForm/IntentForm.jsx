import { useEffect, useMemo, useState } from 'react'
import { companyConfigs, generateCompanyConfig } from '../../data/companyConfigs'

const IntentForm = ({ onCreateIntent, currentRole, selectedCompany }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    amount: '',
    duration: '',
    purpose: '',
    useOfFundsDetail: '',
    esgFocusAreas: '',
    impactObjectives: '',
    collateralOffered: '',
    requestedIncentives: '',
    additionalNotes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const isCompanyRole = currentRole === 'company'

  useEffect(() => {
    if (isCompanyRole) {
      setFormData(prev => ({
        ...prev,
        companyName: selectedCompany || ''
      }))

      if (selectedCompany) {
        setErrors(prev => ({
          ...prev,
          companyName: ''
        }))
      }
    }
  }, [selectedCompany, isCompanyRole])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'companyName' && isCompanyRole) {
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }

    if (isCompanyRole && !selectedCompany) {
      newErrors.companyName = 'Select a company before creating an intent'
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valid amount is required'
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Valid duration is required'
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required'
    }

    if (!formData.useOfFundsDetail.trim()) {
      newErrors.useOfFundsDetail = 'Provide a breakdown of how funds will be deployed'
    }

    if (!formData.esgFocusAreas.trim()) {
      newErrors.esgFocusAreas = 'List at least one ESG focus area'
    }

    if (!formData.impactObjectives.trim()) {
      newErrors.impactObjectives = 'Impact objectives are required'
    }

    if (!formData.collateralOffered.trim()) {
      newErrors.collateralOffered = 'Describe proposed collateral or guarantees'
    }

    if (!formData.requestedIncentives.trim()) {
      newErrors.requestedIncentives = 'Outline any pricing or ESG incentive requests'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const esgFocusAreas = formData.esgFocusAreas
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)

      await onCreateIntent({
        companyName: formData.companyName.trim(),
        amount: parseInt(formData.amount, 10),
        duration: parseInt(formData.duration, 10),
        purpose: formData.purpose.trim(),
        useOfFundsDetail: formData.useOfFundsDetail.trim(),
        esgFocusAreas,
        impactObjectives: formData.impactObjectives.trim(),
        collateralOffered: formData.collateralOffered.trim(),
        requestedIncentives: formData.requestedIncentives.trim(),
        additionalNotes: formData.additionalNotes.trim()
      })

      setFormData({
        companyName: isCompanyRole ? (selectedCompany || '') : '',
        amount: '',
        duration: '',
        purpose: '',
        useOfFundsDetail: '',
        esgFocusAreas: '',
        impactObjectives: '',
        collateralOffered: '',
        requestedIncentives: '',
        additionalNotes: ''
      })
    } catch (error) {
      console.error('Error creating intent:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const companyProfile = useMemo(() => {
    if (!isCompanyRole || !formData.companyName) {
      return null
    }

    const explicitConfig = companyConfigs[formData.companyName]
    if (explicitConfig) {
      return explicitConfig
    }

    const derivedIntent = {
      amount: parseInt(formData.amount, 10) || 0,
      duration: parseInt(formData.duration, 10) || 0,
      purpose: formData.purpose || ''
    }

    return generateCompanyConfig(formData.companyName, derivedIntent)
  }, [formData, isCompanyRole])

  const renderImplicitField = (label, value) => {
    if (!value) return null

    const displayValue = Array.isArray(value) ? value.join(', ') : value

    return (
      <li className="flex items-start gap-2 text-sm text-gray-700" key={label}>
        <span className="mt-1 text-xs">•</span>
        <div>
          <span className="font-semibold text-gray-900">{label}: </span>
          <span>{displayValue}</span>
        </div>
      </li>
    )
  }

  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="card max-w-4xl mx-auto overflow-hidden animate-fade-in">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Create New Credit Intent
            </h2>
            <p className="text-sm text-gray-600">
              Submit a new credit line request to the marketplace
            </p>
          </div>

          <form className="p-6 space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label htmlFor="companyName" className="form-label">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  className={`form-input ${errors.companyName ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''} ${isCompanyRole ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder={isCompanyRole ? 'Select a company from the header' : 'Enter company name'}
                  required
                  readOnly={isCompanyRole}
                />
                {errors.companyName && (
                  <p className="text-danger-600 text-sm font-medium flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.companyName}
                  </p>
                )}
                {isCompanyRole && !selectedCompany && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>ℹ️</span>
                    Choose a company above to auto-fill this field.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="amount" className="form-label">
                  Amount ($) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className={`form-input pl-8 ${errors.amount ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="500,000"
                    min="1000"
                    step="1000"
                    required
                  />
                </div>
                {errors.amount && (
                  <p className="text-danger-600 text-sm font-medium flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.amount}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="duration" className="form-label">
                  Duration (months) *
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  className={`form-input ${errors.duration ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="12"
                  min="1"
                  max="120"
                  required
                />
                {errors.duration && (
                  <p className="text-danger-600 text-sm font-medium flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.duration}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-1">
                <label htmlFor="purpose" className="form-label">
                  Purpose *
                </label>
                <textarea
                  id="purpose"
                  name="purpose"
                  className={`form-input resize-none ${errors.purpose ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Describe the purpose of this credit line..."
                  rows="3"
                  required
                />
                {errors.purpose && (
                  <p className="text-danger-600 text-sm font-medium flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.purpose}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1 md:col-span-2">
                <label htmlFor="useOfFundsDetail" className="form-label">
                  Detailed Use of Funds *
                </label>
                <textarea
                  id="useOfFundsDetail"
                  name="useOfFundsDetail"
                  className={`form-input resize-none ${errors.useOfFundsDetail ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                  value={formData.useOfFundsDetail}
                  onChange={handleChange}
                  placeholder="Break down how the facility will be deployed across projects, ESG programmes, or capital needs."
                  rows="3"
                  required
                />
                {errors.useOfFundsDetail && (
                  <p className="text-danger-600 text-sm font-medium flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.useOfFundsDetail}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="esgFocusAreas" className="form-label">
                  ESG Focus Areas *
                </label>
                <input
                  type="text"
                  id="esgFocusAreas"
                  name="esgFocusAreas"
                  className={`form-input ${errors.esgFocusAreas ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                  value={formData.esgFocusAreas}
                  onChange={handleChange}
                  placeholder="e.g. renewable energy, community benefits, data governance"
                  required
                />
                <p className="text-xs text-gray-500">
                  Separate multiple focus areas with commas.
                </p>
                {errors.esgFocusAreas && (
                  <p className="text-danger-600 text-sm font-medium flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.esgFocusAreas}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="impactObjectives" className="form-label">
                  Impact Objectives *
                </label>
                <textarea
                  id="impactObjectives"
                  name="impactObjectives"
                  className={`form-input resize-none ${errors.impactObjectives ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                  value={formData.impactObjectives}
                  onChange={handleChange}
                  placeholder="Define the measurable ESG or impact outcomes you expect to deliver with this financing."
                  rows="3"
                  required
                />
                {errors.impactObjectives && (
                  <p className="text-danger-600 text-sm font-medium flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.impactObjectives}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="collateralOffered" className="form-label">
                  Collateral or Guarantees *
                </label>
                <textarea
                  id="collateralOffered"
                  name="collateralOffered"
                  className={`form-input resize-none ${errors.collateralOffered ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                  value={formData.collateralOffered}
                  onChange={handleChange}
                  placeholder="Detail pledged assets, guarantees, or covenant protections offered."
                  rows="3"
                  required
                />
                {errors.collateralOffered && (
                  <p className="text-danger-600 text-sm font-medium flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.collateralOffered}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="requestedIncentives" className="form-label">
                  Requested Pricing / ESG Incentives *
                </label>
                <textarea
                  id="requestedIncentives"
                  name="requestedIncentives"
                  className={`form-input resize-none ${errors.requestedIncentives ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                  value={formData.requestedIncentives}
                  onChange={handleChange}
                  placeholder="Highlight sustainability-linked KPIs, pricing step-downs, or reporting expectations you need."
                  rows="3"
                  required
                />
                {errors.requestedIncentives && (
                  <p className="text-danger-600 text-sm font-medium flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.requestedIncentives}
                  </p>
                )}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label htmlFor="additionalNotes" className="form-label">
                  Additional Notes
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  className="form-input resize-none"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Optional context such as timing sensitivities, syndication preferences, or governance considerations."
                  rows="3"
                />
              </div>
            </div>

            {isCompanyRole && companyProfile && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-2">
                <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide">
                  Implicit Company Context Included Automatically
                </h3>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Your negotiation profile contributes additional guardrails alongside the fields above. We pre-fill the following items when sharing intents with banks:
                </p>
                <ul className="space-y-2">
                  {renderImplicitField('Urgency', companyProfile.urgency)}
                  {renderImplicitField('Acceptable Interest Rate', companyProfile.acceptableInterestRate)}
                  {renderImplicitField('Max Acceptable Rate', companyProfile.maxAcceptableRate && `${companyProfile.maxAcceptableRate}%`)}
                  {renderImplicitField('Preferred Duration', companyProfile.preferredDuration)}
                  {renderImplicitField('Collateral Availability', companyProfile.collateralAvailability)}
                  {renderImplicitField('Priority Factors', companyProfile.priorityFactors)}
                  {renderImplicitField('ESG Score', companyProfile.esgScore)}
                  {renderImplicitField('ESG Certifications', companyProfile.esgCertifications)}
                  {renderImplicitField('Impact Metrics', companyProfile.impactMetrics)}
                  {renderImplicitField('ESG Constraints', companyProfile.esgConstraints)}
                </ul>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                className={`btn btn-primary min-w-40 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:scale-105'}`}
                disabled={isSubmitting || (isCompanyRole && !selectedCompany)}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Intent'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default IntentForm
