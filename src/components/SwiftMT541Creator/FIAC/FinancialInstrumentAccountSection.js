import React, { useState } from 'react';

const FinancialInstrumentForm = () => {
  const [formData, setFormData] = useState({
    startBlock: 'FIAC',
    quantity: {
      option: '',
      qualifierType: '',
      quantityValue: ''
    },
    narrativeDenomination: '',
    certificateNumber: '',
    party: {
      option: '',
      identifier: '',
      dataSourceScheme: '',
      proprietaryCode: ''
    },
    account: {
      option: '',
      accountNumber: '',
      dataSourceScheme: '',
      accountTypeCode: '',
      blockchainId: '',
      iban: ''
    },
    place: {
      option: '',
      dataSourceScheme: '',
      placeCode: '',
      narrative: '',
      countryCode: '',
      identifierCode: '',
      lei: ''
    }
  });

  const [errors, setErrors] = useState({});

  // Validation Functions
  const validateQuantityB = (value) => {
    return /^[A-Z]{4}\/\/[A-Z]{4}\/\d{1,15}$/.test(value)
      ? ''
      : 'Format must be 4!c//4!c/15d';
  };

  const validateQuantityD = (value) => {
    return /^[A-Z]{4}\/\/[A-Z]{4}\/\d{1,30}$/.test(value)
      ? ''
      : 'Format must be 4!c//4!c/30d';
  };

  const validateLEI = (value) => {
    return /^[A-Z0-9]{18}\d{2}$/.test(value)
      ? ''
      : 'Must be 18 alphanumeric characters followed by 2 numbers';
  };

  const validateBIC = (value) => {
    return /^[A-Z]{4}[A-Z]{2}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?$/.test(value)
      ? ''
      : 'Invalid BIC format';
  };

  const validateAccount = (option, value) => {
    if (!option) return '';
    if (!value) return 'Account information is required';

    switch (option) {
      case 'A':
        return value.length <= 35 ? '' : 'Account number must not exceed 35 characters';
      case 'E':
        return value.length <= 34 ? '' : 'IBAN must not exceed 34 characters';
      default:
        return '';
    }
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

    // Validate based on field type
    if (name === 'quantity.value') {
      error = formData.quantity.option === 'B' 
        ? validateQuantityB(value)
        : validateQuantityD(value);
    } else if (name === 'party.identifier') {
      error = formData.party.option === 'L'
        ? validateLEI(value)
        : validateBIC(value);
    } else if (name === 'account.value') {
      error = validateAccount(formData.account.option, value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  return (
    <div className="form-section">

      <h2>Financial Instrument/Account</h2>

      {/* Quantity (36a) */}
      <div className="form-group">
        <label>Quantity of Financial Instrument (36a) *</label>
        <select 
          name="quantity.option"
          value={formData.quantity.option}
          onChange={handleInputChange}
        >
          <option value="">Select format option</option>
          <option value="B">Option B (Standard Quantity)</option>
          <option value="D">Option D (Digital Tokens)</option>
        </select>

        {formData.quantity.option && (
          <div className="nested-fields">
            <input
              type="text"
              name="quantity.value"
              value={formData.quantity.value}
              onChange={handleInputChange}
              placeholder={`Format: ${formData.quantity.option === 'B' ? 'QUAL//TYPE/12345' : 'QUAL//TYPE/123456789'}`}
            />
            {errors['quantity.value'] && (
              <span className="error">{errors['quantity.value']}</span>
            )}
          </div>
        )}
      </div>

      {/* Party (95a) */}
      <div className="form-group">
        <label>Party (95a)</label>
        <select
          name="party.option"
          value={formData.party.option}
          onChange={handleInputChange}
        >
          <option value="">Select party option</option>
          <option value="L">Option L (LEI)</option>
          <option value="P">Option P (BIC)</option>
          <option value="R">Option R (Proprietary)</option>
        </select>

        {formData.party.option && (
          <div className="nested-fields">
            <input
              type="text"
              name="party.identifier"
              value={formData.party.identifier}
              onChange={handleInputChange}
              placeholder={formData.party.option === 'L' ? 'Enter LEI (20 characters)' : 'Enter BIC'}
            />
            {errors['party.identifier'] && (
              <span className="error">{errors['party.identifier']}</span>
            )}
          </div>
        )}
      </div>

      {/* Account (97a) */}
      <div className="form-group">
        <label>Account (97a) *</label>
        <select
          name="account.option"
          value={formData.account.option}
          onChange={handleInputChange}
        >
          <option value="">Select account option</option>
          <option value="A">Option A (Account Number)</option>
          <option value="B">Option B (Account Type)</option>
          <option value="D">Option D (Blockchain)</option>
          <option value="E">Option E (IBAN)</option>
        </select>

        {formData.account.option && (
          <div className="nested-fields">
            <input
              type="text"
              name="account.value"
              value={formData.account.value}
              onChange={handleInputChange}
              placeholder={`Enter ${formData.account.option === 'E' ? 'IBAN' : 'account number'}`}
            />
            {errors['account.value'] && (
              <span className="error">{errors['account.value']}</span>
            )}
          </div>
        )}
      </div>

      {/* Place (94a) */}
      <div className="form-group">
        <label>Place of Safekeeping (94a)</label>
        <select
          name="place.option"
          value={formData.place.option}
          onChange={handleInputChange}
        >
          <option value="">Select place option</option>
          <option value="B">Option B (Place Code)</option>
          <option value="C">Option C (Country Code)</option>
          <option value="F">Option F (Identifier Code)</option>
          <option value="L">Option L (LEI)</option>
        </select>

        {formData.place.option && (
          <div className="nested-fields">
            {formData.place.option === 'C' ? (
              <input
                type="text"
                name="place.countryCode"
                value={formData.place.countryCode}
                onChange={handleInputChange}
                maxLength={2}
                placeholder="Enter country code (2 characters)"
              />
            ) : (
              <input
                type="text"
                name="place.value"
                value={formData.place.value}
                onChange={handleInputChange}
                placeholder={`Enter ${formData.place.option === 'L' ? 'LEI' : 'place code'}`}
              />
            )}
            {errors['place.value'] && (
              <span className="error">{errors['place.value']}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialInstrumentForm;