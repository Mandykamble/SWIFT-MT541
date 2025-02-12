import React, { useState } from 'react';

const TwoLegTransactionForm = () => {
  const [formData, setFormData] = useState({
    startBlock: 'REPO',
    dateTime: {
      option: '',
      qualifier: '',
      dataSource: '',
      date: '',
      time: '',
      dateCode: ''
    },
    indicator: {
      qualifier: '',
      dataSource: '',
      value: ''
    },
    reference: {
      qualifier: '',
      value: ''
    },
    rate: {
      option: '',
      qualifier: '',
      dataSource: '',
      sign: '',
      value: '',
      rateName: ''
    },
    numberCount: {
      qualifier: '',
      value: ''
    },
    amount: {
      qualifier: '',
      currency: '',
      sign: '',
      value: ''
    },
    narrative: {
      value: ''
    },
    endBlock: 'REPO'
  });

  const [errors, setErrors] = useState({});

  // Qualifier options
  const dateTimeQualifiers = [
    { value: 'TERM', label: 'Closing Date/Time' },
    { value: 'RERA', label: 'Rate Change Date/Time' }
  ];

  const rateQualifiers = [
    { value: 'VASU', label: 'Variable Rate Support' },
    { value: 'REPO', label: 'Repurchase Rate' },
    { value: 'RSPR', label: 'Spread Rate' },
    { value: 'PRIC', label: 'Pricing Rate' },
    { value: 'SLMG', label: 'Stock Loan Margin' },
    { value: 'SHAI', label: 'Securities Haircut' }
  ];

  // Validation Functions
  const validateDateTime = (option, qualifier, date, time, dateCode, dataSource) => {
    if (!qualifier) return 'Qualifier is required';

    switch (option) {
      case 'A':
        return /^\d{8}$/.test(date) ? '' : 'Date must be in format YYYYMMDD';
      case 'B':
        if (!dataSource || dataSource.length > 8) return 'Invalid data source scheme';
        if (!/^[A-Z0-9]{4}$/.test(dateCode)) return 'Date code must be 4 characters';
        return '';
      case 'C':
        if (!/^\d{8}$/.test(date)) return 'Date must be in format YYYYMMDD';
        if (!/^\d{6}$/.test(time)) return 'Time must be in format HHMMSS';
        return '';
      default:
        return 'Invalid option';
    }
  };

  const validateRate = (option, qualifier, value, dataSource, rateName) => {
    if (!qualifier) return 'Qualifier is required';

    switch (option) {
      case 'A':
        return /^[N]?\d{1,15}(\.\d+)?$/.test(value) ? '' : 'Invalid rate format';
      case 'C':
        if (!dataSource || dataSource.length > 8) return 'Invalid data source scheme';
        if (!rateName || rateName.length > 24) return 'Invalid rate name';
        return '';
      default:
        return 'Invalid option';
    }
  };

  const validateReference = (value) => {
    return /^[A-Za-z0-9]{1,16}$/.test(value)
      ? ''
      : 'Reference must be up to 16 alphanumeric characters';
  };

  const validateNumberCount = (value) => {
    return /^\d{1,3}$/.test(value)
      ? ''
      : 'Number count must be 1-3 digits';
  };

  const validateAmount = (value, currency) => {
    if (!/^[A-Z]{3}$/.test(currency)) return 'Invalid currency code';
    return /^[N]?\d{1,15}(\.\d+)?$/.test(value)
      ? ''
      : 'Invalid amount format';
  };

  const validateNarrative = (value) => {
    const lines = value.split('\n');
    return lines.length <= 4 && lines.every(line => line.length <= 35)
      ? ''
      : 'Maximum 4 lines of 35 characters each';
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    setFormData(prev => {
      const updatedData = { ...prev };
      const path = name.split('.');
      
      if (path.length === 1) {
        updatedData[name] = value;
      } else {
        let current = updatedData;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
      }
      
      return updatedData;
    });

    // Validate based on field
    if (name.startsWith('dateTime.')) {
      error = validateDateTime(
        formData.dateTime.option,
        formData.dateTime.qualifier,
        formData.dateTime.date,
        formData.dateTime.time,
        formData.dateTime.dateCode,
        formData.dateTime.dataSource
      );
    } else if (name.startsWith('rate.')) {
      error = validateRate(
        formData.rate.option,
        formData.rate.qualifier,
        formData.rate.value,
        formData.rate.dataSource,
        formData.rate.rateName
      );
    } else if (name === 'reference.value') {
      error = validateReference(value);
    } else if (name === 'numberCount.value') {
      error = validateNumberCount(value);
    } else if (name === 'amount.value') {
      error = validateAmount(value, formData.amount.currency);
    } else if (name === 'narrative.value') {
      error = validateNarrative(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  return (
    <div className="form-section">

    <h2>Two Leg Transaction </h2>
      {/* Start Block */}
      <div className="form-group">
        <label>Start Block (16R) *</label>
        <input type="text" value="REPO" disabled />
      </div>

      {/* Date/Time (98a) */}
      <div className="form-group">
        <label>Date/Time (98a)</label>
        <select
          name="dateTime.qualifier"
          value={formData.dateTime.qualifier}
          onChange={handleInputChange}
        >
          <option value="">Select qualifier</option>
          {dateTimeQualifiers.map(q => (
            <option key={q.value} value={q.value}>{q.label}</option>
          ))}
        </select>

        {formData.dateTime.qualifier && (
          <select
            name="dateTime.option"
            value={formData.dateTime.option}
            onChange={handleInputChange}
          >
            <option value="">Select format</option>
            <option value="A">Option A (Date only)</option>
            <option value="B">Option B (Date Code)</option>
            <option value="C">Option C (Date and Time)</option>
          </select>
        )}

        {formData.dateTime.option && (
          <div className="nested-fields">
            {formData.dateTime.option === 'A' && (
              <input
                type="text"
                name="dateTime.date"
                value={formData.dateTime.date}
                onChange={handleInputChange}
                placeholder="Date (YYYYMMDD)"
              />
            )}

            {formData.dateTime.option === 'B' && (
              <>
                <input
                  type="text"
                  name="dateTime.dataSource"
                  value={formData.dateTime.dataSource}
                  onChange={handleInputChange}
                  placeholder="Data Source Scheme (8c)"
                />
                <input
                  type="text"
                  name="dateTime.dateCode"
                  value={formData.dateTime.dateCode}
                  onChange={handleInputChange}
                  placeholder="Date Code (4!c)"
                />
              </>
            )}

            {formData.dateTime.option === 'C' && (
              <>
                <input
                  type="text"
                  name="dateTime.date"
                  value={formData.dateTime.date}
                  onChange={handleInputChange}
                  placeholder="Date (YYYYMMDD)"
                />
                <input
                  type="text"
                  name="dateTime.time"
                  value={formData.dateTime.time}
                  onChange={handleInputChange}
                  placeholder="Time (HHMMSS)"
                />
              </>
            )}
          </div>
        )}
        {errors['dateTime.date'] && (
          <span className="error">{errors['dateTime.date']}</span>
        )}
      </div>

      {/* Rate (92a) */}
      <div className="form-group">
        <label>Rate (92a)</label>
        <select
          name="rate.qualifier"
          value={formData.rate.qualifier}
          onChange={handleInputChange}
        >
          <option value="">Select qualifier</option>
          {rateQualifiers.map(q => (
            <option key={q.value} value={q.value}>{q.label}</option>
          ))}
        </select>

        {formData.rate.qualifier && (
          <select
            name="rate.option"
            value={formData.rate.option}
            onChange={handleInputChange}
          >
            <option value="">Select format</option>
            <option value="A">Option A (Rate)</option>
            <option value="C">Option C (Rate Name)</option>
          </select>
        )}

        {formData.rate.option && (
          <div className="nested-fields">
            {formData.rate.option === 'A' && (
              <input
                type="text"
                name="rate.value"
                value={formData.rate.value}
                onChange={handleInputChange}
                placeholder="Rate ([N]15d)"
              />
            )}

            {formData.rate.option === 'C' && (
              <>
                <input
                  type="text"
                  name="rate.dataSource"
                  value={formData.rate.dataSource}
                  onChange={handleInputChange}
                  placeholder="Data Source Scheme (8c)"
                />
                <input
                  type="text"
                  name="rate.rateName"
                  value={formData.rate.rateName}
                  onChange={handleInputChange}
                  placeholder="Rate Name (24x)"
                />
              </>
            )}
          </div>
        )}
        {errors['rate.value'] && (
          <span className="error">{errors['rate.value']}</span>
        )}
      </div>

      {/* Other fields ... */}
      <div className="form-group">
        <label>Reference (20C)</label>
        <input
          type="text"
          name="reference.value"
          value={formData.reference.value}
          onChange={handleInputChange}
          placeholder="Reference (16x)"
        />
        {errors['reference.value'] && (
          <span className="error">{errors['reference.value']}</span>
        )}
      </div>

      <div className="form-group">
        <label>Number Count (99B)</label>
        <input
          type="text"
          name="numberCount.value"
          value={formData.numberCount.value}
          onChange={handleInputChange}
          placeholder="Number Count (3!n)"
        />
        {errors['numberCount.value'] && (
          <span className="error">{errors['numberCount.value']}</span>
        )}
      </div>

      <div className="form-group">
        <label>Amount (19A)</label>
        <input
          type="text"
          name="amount.currency"
          value={formData.amount.currency}
          onChange={handleInputChange}
          placeholder="Currency (3!a)"
          maxLength={3}
        />
        <input
          type="text"
          name="amount.value"
          value={formData.amount.value}
          onChange={handleInputChange}
          placeholder="Amount ([N]15d)"
        />
        {errors['amount.value'] && (
          <span className="error">{errors['amount.value']}</span>
        )}
      </div>

      <div className="form-group">
        <label>Narrative (70C)</label>
        <textarea
          name="narrative.value"
          value={formData.narrative.value}
          onChange={handleInputChange}
          placeholder="Enter narrative (4 lines max, 35 characters each)"
          rows={4}
        />
        {errors['narrative.value'] && (
          <span className="error">{errors['narrative.value']}</span>
        )}
      </div>

      {/* End Block */}
      <div className="form-group">
        <label>End Block (16S) *</label>
        <input type="text" value="REPO" disabled />
      </div>
    </div>
  );
};

export default TwoLegTransactionForm;