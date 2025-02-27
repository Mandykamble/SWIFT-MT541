import React, { useState } from 'react';

const TwoLegTransactionForm = ({ formData, setFormData }) => {
  const repoDateTime = formData.repoDateTime || {
    qualifier: '',
    dataSource: '',
    date: '',
    time: '',
    dateCode: '',
    option: 'A' // Default option
  };

  const repoIndicator = formData.repoIndicator || {
    indicator: '',
    scheme: '',
    code: ''
  };

  const repoReference = formData.repoReference || {
    reference: '',
    referenceNumber: ''
  };

  const repoRate = formData.repoRate || {
    qualifier: '',
    dataSource: '',
    rateName: '',
    rate: '',
    option: 'A' // Default option
  };

  const repoNumberCount = formData.repoNumberCount || {
    qualifier: '',
    count: ''
  };

  const repoAmount = formData.repoAmount || {
    qualifier: '',
    currency: '',
    amount: ''
  };

  const repoNarrative = formData.repoNarrative || {
    narrative: ''
  };

  // Validation state
  const [errors, setErrors] = useState({});

  // Date qualifier options
  const dateQualifierOptions = [
    { value: 'TERM', label: 'Closing Date/Time' },
    { value: 'RERA', label: 'Rate Change Date/Time' }
  ];

  // Rate qualifier options
  const rateQualifierOptions = [
    { value: 'VASU', label: 'Variable Rate Support' },
    { value: 'REPO', label: 'Repurchase Rate' },
    { value: 'RSPR', label: 'Spread Rate' },
    { value: 'PRIC', label: 'Pricing Rate' },
    { value: 'SLMG', label: 'Stock Loan Margin' },
    { value: 'SHAI', label: 'Securities Haircut' }
  ];

  // Date/Time format options
  const dateTimeFormatOptions = [
    { value: 'A', label: 'Option A: Qualifier//Date' },
    { value: 'B', label: 'Option B: Qualifier/DataSource/DateCode' },
    { value: 'C', label: 'Option C: Qualifier//DateTime' }
  ];

  // Rate format options
  const rateFormatOptions = [
    { value: 'A', label: 'Option A: Qualifier//Rate' },
    { value: 'C', label: 'Option C: Qualifier/DataSource/RateName' }
  ];

  // Input validation functions
  const validateDate = (date) => {
    if (!date) return '';
    const regex = /^\d{8}$/;
    if (!regex.test(date)) return 'Date must be in YYYYMMDD format';
    return '';
  };

  const validateTime = (time) => {
    if (!time) return '';
    const regex = /^\d{6}$/;
    if (!regex.test(time)) return 'Time must be in HHMMSS format';
    return '';
  };

  const validateQualifier = (qualifier) => {
    if (!qualifier) return '';
    const regex = /^[A-Z0-9]{4}$/;
    if (!regex.test(qualifier)) return 'Qualifier must be 4 alphanumeric characters';
    return '';
  };

  const validateReference = (reference) => {
    if (!reference) return '';
    const regex = /^.{1,16}$/;
    if (!regex.test(reference)) return 'Reference must be 1-16 characters';
    return '';
  };

  const validateCount = (count) => {
    if (!count) return '';
    const regex = /^\d{1,3}$/;
    if (!regex.test(count)) return 'Count must be 1-3 digits';
    return '';
  };

  const validateAmount = (amount) => {
    if (!amount) return '';
    const regex = /^-?\d+(\.\d+)?$/;
    if (!regex.test(amount)) return 'Amount must be a valid number';
    return '';
  };

  const validateCurrency = (currency) => {
    if (!currency) return '';
    const regex = /^[A-Z]{3}$/;
    if (!regex.test(currency)) return 'Currency must be 3 alphabetic characters';
    return '';
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';
    
    if (name === 'date') {
      errorMessage = validateDate(value);
    } else if (name === 'time') {
      errorMessage = validateTime(value);
    } else if (name === 'qualifier') {
      errorMessage = validateQualifier(value);
    }
    
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage
    }));

    setFormData((prev) => ({
      ...prev,
      repoDateTime: {
        ...prev.repoDateTime,
        [name]: value,
      },
    }));
  };

  const handleIndicatorChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      repoIndicator: {
        ...prev.repoIndicator,
        [name]: value,
      },
    }));
  };

  const handleReferenceChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = name === 'referenceNumber' ? validateReference(value) : '';
    
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage
    }));

    setFormData((prev) => ({
      ...prev,
      repoReference: {
        ...prev.repoReference,
        [name]: value,
      },
    }));
  };

  const handleRateChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';
    
    if (name === 'rate') {
      errorMessage = validateAmount(value);
    } else if (name === 'qualifier') {
      errorMessage = validateQualifier(value);
    }
    
    setErrors((prev) => ({
      ...prev,
      [`rate_${name}`]: errorMessage
    }));

    setFormData((prev) => ({
      ...prev,
      repoRate: {
        ...prev.repoRate,
        [name]: value,
      },
    }));
  };

  const handleNumberCountChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = name === 'count' ? validateCount(value) : '';
    
    setErrors((prev) => ({
      ...prev,
      [`count_${name}`]: errorMessage
    }));

    setFormData((prev) => ({
      ...prev,
      repoNumberCount: {
        ...prev.repoNumberCount,
        [name]: value,
      },
    }));
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';
    
    if (name === 'amount') {
      errorMessage = validateAmount(value);
    } else if (name === 'currency') {
      errorMessage = validateCurrency(value);
    }
    
    setErrors((prev) => ({
      ...prev,
      [`amount_${name}`]: errorMessage
    }));

    setFormData((prev) => ({
      ...prev,
      repoAmount: {
        ...prev.repoAmount,
        [name]: value,
      },
    }));
  };

  const handleNarrativeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      repoNarrative: {
        ...prev.repoNarrative,
        [name]: value,
      },
    }));
  };

  return (
    <div className="swift-form">
      <h2>Two Leg Transaction</h2>
      
      {/* Date/Time - Field 98a */}
      <div className="form-section">
        <h3>Date/Time (Field 98a)</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Format Option:</label>
            <select
              name="option"
              value={repoDateTime.option}
              onChange={handleDateTimeChange}
            >
              {dateTimeFormatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-container">
            <label>Qualifier:</label>
            <select
              name="qualifier"
              value={repoDateTime.qualifier}
              onChange={handleDateTimeChange}
            >
              <option value="">Select qualifier</option>
              {dateQualifierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.value})
                </option>
              ))}
            </select>
            {errors.qualifier && <span className="error">{errors.qualifier}</span>}
          </div>

          {repoDateTime.option === 'B' && (
            <div className="field-container">
              <label>Data Source Scheme:</label>
              <input
                type="text"
                name="dataSource"
                value={repoDateTime.dataSource}
                onChange={handleDateTimeChange}
                placeholder="Data Source Scheme (8c)"
                maxLength={8}
              />
            </div>
          )}

          {repoDateTime.option === 'B' ? (
            <div className="field-container">
              <label>Date Code:</label>
              <input
                type="text"
                name="dateCode"
                value={repoDateTime.dateCode}
                onChange={handleDateTimeChange}
                placeholder="Date Code (4!c)"
                maxLength={4}
              />
            </div>
          ) : (
            <div className="field-container">
              <label>Date:</label>
              <input
                type="text"
                name="date"
                value={repoDateTime.date}
                onChange={handleDateTimeChange}
                placeholder="Date (YYYYMMDD)"
                maxLength={8}
              />
              {errors.date && <span className="error">{errors.date}</span>}
            </div>
          )}

          {repoDateTime.option === 'C' && (
            <div className="field-container">
              <label>Time:</label>
              <input
                type="text"
                name="time"
                value={repoDateTime.time}
                onChange={handleDateTimeChange}
                placeholder="Time (HHMMSS)"
                maxLength={6}
              />
              {errors.time && <span className="error">{errors.time}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Indicator - Field 22F */}
      <div className="form-section">
        <h3>Indicator (Field 22F)</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Indicator:</label>
            <input
              type="text"
              name="indicator"
              value={repoIndicator.indicator}
              onChange={handleIndicatorChange}
              placeholder="Indicator (4!c)"
              maxLength={4}
            />
          </div>

          <div className="field-container">
            <label>Scheme:</label>
            <input
              type="text"
              name="scheme"
              value={repoIndicator.scheme}
              onChange={handleIndicatorChange}
              placeholder="Scheme [8c]"
              maxLength={8}
            />
          </div>

          <div className="field-container">
            <label>Code:</label>
            <input
              type="text"
              name="code"
              value={repoIndicator.code}
              onChange={handleIndicatorChange}
              placeholder="Code (4!c)"
              maxLength={4}
            />
          </div>
        </div>
      </div>

      {/* Reference - Field 20C */}
      <div className="form-section">
        <h3>Reference (Field 20C)</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Reference:</label>
            <input
              type="text"
              name="reference"
              value={repoReference.reference}
              onChange={handleReferenceChange}
              placeholder="Reference (4!c)"
              maxLength={4}
            />
          </div>

          <div className="field-container">
            <label>Reference Number:</label>
            <input
              type="text"
              name="referenceNumber"
              value={repoReference.referenceNumber}
              onChange={handleReferenceChange}
              placeholder="Reference Number (16x)"
              maxLength={16}
            />
            {errors.referenceNumber && <span className="error">{errors.referenceNumber}</span>}
          </div>
        </div>
      </div>

      {/* Rate - Field 92a */}
      <div className="form-section">
        <h3>Rate (Field 92a)</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Format Option:</label>
            <select
              name="option"
              value={repoRate.option}
              onChange={handleRateChange}
            >
              {rateFormatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-container">
            <label>Qualifier:</label>
            <select
              name="qualifier"
              value={repoRate.qualifier}
              onChange={handleRateChange}
            >
              <option value="">Select qualifier</option>
              {rateQualifierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.value})
                </option>
              ))}
            </select>
            {errors.rate_qualifier && <span className="error">{errors.rate_qualifier}</span>}
          </div>

          {repoRate.option === 'A' ? (
            <div className="field-container">
              <label>Rate:</label>
              <input
                type="text"
                name="rate"
                value={repoRate.rate}
                onChange={handleRateChange}
                placeholder="Rate [N]15d"
              />
              {errors.rate_rate && <span className="error">{errors.rate_rate}</span>}
            </div>
          ) : (
            <>
              <div className="field-container">
                <label>Data Source Scheme:</label>
                <input
                  type="text"
                  name="dataSource"
                  value={repoRate.dataSource}
                  onChange={handleRateChange}
                  placeholder="Data Source Scheme [8c]"
                  maxLength={8}
                />
              </div>
              <div className="field-container">
                <label>Rate Name:</label>
                <input
                  type="text"
                  name="rateName"
                  value={repoRate.rateName}
                  onChange={handleRateChange}
                  placeholder="Rate Name (24x)"
                  maxLength={24}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Number Count - Field 99B */}
      <div className="form-section">
        <h3>Number Count (Field 99B)</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Qualifier:</label>
            <input
              type="text"
              name="qualifier"
              value={repoNumberCount.qualifier}
              onChange={handleNumberCountChange}
              placeholder="Qualifier (4!c)"
              maxLength={4}
            />
          </div>

          <div className="field-container">
            <label>Count:</label>
            <input
              type="text"
              name="count"
              value={repoNumberCount.count}
              onChange={handleNumberCountChange}
              placeholder="Count (3!n)"
              maxLength={3}
            />
            {errors.count_count && <span className="error">{errors.count_count}</span>}
          </div>
        </div>
      </div>

      {/* Amount - Field 19A */}
      <div className="form-section">
        <h3>Amount (Field 19A)</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Qualifier:</label>
            <input
              type="text"
              name="qualifier"
              value={repoAmount.qualifier}
              onChange={handleAmountChange}
              placeholder="Qualifier (4!c)"
              maxLength={4}
            />
          </div>

          <div className="field-container">
            <label>Currency:</label>
            <input
              type="text"
              name="currency"
              value={repoAmount.currency}
              onChange={handleAmountChange}
              placeholder="Currency (3!a)"
              maxLength={3}
            />
            {errors.amount_currency && <span className="error">{errors.amount_currency}</span>}
          </div>

          <div className="field-container">
            <label>Amount:</label>
            <input
              type="text"
              name="amount"
              value={repoAmount.amount}
              onChange={handleAmountChange}
              placeholder="Amount (15d)"
            />
            {errors.amount_amount && <span className="error">{errors.amount_amount}</span>}
          </div>
        </div>
      </div>

      {/* Narrative - Field 70C */}
      <div className="form-section">
        <h3>Second Leg Narrative (Field 70C SECO)</h3>
        <div className="form-grid">
          <div className="field-container full-width">
            <label>Narrative:</label>
            <textarea
              name="narrative"
              value={repoNarrative.narrative}
              onChange={handleNarrativeChange}
              placeholder="Narrative (4*35x)"
              rows={4}
              maxLength={140}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoLegTransactionForm;