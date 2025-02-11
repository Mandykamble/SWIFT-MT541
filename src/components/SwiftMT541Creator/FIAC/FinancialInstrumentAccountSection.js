import React, { useState } from 'react';

const FinancialInstrumentAccountSection = () => {
  const [formData, setFormData] = useState({
    // Mandatory Fields
    financialQuantityOption: '',
    financialQuantityQualifier: '',
    financialQuantityType: '',
    financialQuantityValue: '',
    safekeepingAccountOption: '',
    safekeepingAccountQualifier: '',
    safekeepingAccountValue: '',

    // Optional Fields
    denominationNarrative: '',
    certificateNumber: '',
    partyOption: '',
    partyQualifier: '',
    partyIdentifier: '',
    accountOption: '',
    accountQualifier: '',
    accountTypeCode: '',
    accountNumber: '',
    placeOption: '',
    placeQualifier: '',
    placeDataSource: '',
    placeCode: '',
    placeNarrative: ''
  });

  const [errors, setErrors] = useState({});

  // Validation Functions
  const validateQuantity = (option, qualifier, type, value) => {
    if (!option || !qualifier || !type) return 'All fields are required for quantity';
    if (!/^[A-Z]{4}$/.test(type)) return 'Quantity type must be 4 uppercase letters';

    switch (option) {
      case 'B':
        return /^\d{1,15}(\.\d{0,2})?$/.test(value) ? '' : 'Invalid quantity format for option B';
      case 'D':
        return /^\d{1,30}(\.\d{0,2})?$/.test(value) ? '' : 'Invalid quantity format for option D';
      default:
        return 'Invalid quantity option';
    }
  };

  const validateParty = (option, value) => {
    if (!option) return '';
    switch (option) {
      case 'L':
        return /^[A-Z0-9]{18}[0-9]{2}$/.test(value) ? '' : 'Invalid format for Option L (LEI)';
      case 'P':
        return /^[A-Z]{4}[A-Z0-9]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value) ? '' : 'Invalid format for Option P';
      case 'R':
        return /^[A-Z0-9]{8,34}$/.test(value) ? '' : 'Invalid format for Option R';
      default:
        return 'Invalid party option';
    }
  };

  const validateAccount = (option, value) => {
    if (!option) return '';
    switch (option) {
      case 'A':
        return /^[A-Z0-9]{1,35}$/.test(value) ? '' : 'Invalid format for Option A';
      case 'B':
        return /^[A-Z0-9]{1,35}$/.test(value) ? '' : 'Invalid format for Option B';
      case 'D':
        return /^[A-Z0-9]{1,140}$/.test(value) ? '' : 'Invalid format for Option D';
      case 'E':
        return /^[A-Z0-9]{1,34}$/.test(value) ? '' : 'Invalid format for Option E';
      default:
        return 'Invalid account option';
    }
  };

  const validateCertificateNumber = (value) => {
    return /^[A-Z0-9]{1,30}$/.test(value) ? '' : 'Certificate Number must be up to 30 characters';
  };

  const validateNarrative = (value) => {
    return value.length <= 210 ? '' : 'Narrative must be up to 210 characters';
  };

  const validatePlace = (option, dataSource, code, narrative) => {
    if (!option) return '';
    switch (option) {
      case 'B':
        return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}(\/[A-Z0-9]{0,30})?$/.test(`${dataSource}/${code}${narrative ? '/' + narrative : ''}`)
          ? ''
          : 'Invalid format for Option B';
      case 'L':
        return /^[A-Z0-9]{18}[0-9]{2}$/.test(code) ? '' : 'Invalid format for Option L (LEI)';
      default:
        return 'Invalid place option';
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    switch (name) {
      case 'financialQuantityValue':
        error = validateQuantity(
          formData.financialQuantityOption,
          formData.financialQuantityQualifier,
          formData.financialQuantityType,
          value
        );
        break;
      case 'partyIdentifier':
        error = validateParty(formData.partyOption, value);
        break;
      case 'safekeepingAccountValue':
        error = validateAccount(formData.safekeepingAccountOption, value);
        break;
      case 'certificateNumber':
        error = validateCertificateNumber(value);
        break;
      case 'denominationNarrative':
        error = validateNarrative(value);
        break;
      case 'placeCode':
        error = validatePlace(formData.placeOption, formData.placeDataSource, value, formData.placeNarrative);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  return (
    <div className="form-section">
      <h2>Financial Instrument/Account</h2>

      {/* Quantity of Financial Instrument (Mandatory) */}
      <div className="form-group">
        <label>Quantity of Financial Instrument *:</label>
        <input type="text" name="financialQuantityValue" value={formData.financialQuantityValue} onChange={handleInputChange} />
        {errors.financialQuantityValue && <span className="error">{errors.financialQuantityValue}</span>}
      </div>

      {/* Certificate Number (Optional) */}
      <div className="form-group">
        <label>Certificate Number:</label>
        <input type="text" name="certificateNumber" value={formData.certificateNumber} onChange={handleInputChange} />
        {errors.certificateNumber && <span className="error">{errors.certificateNumber}</span>}
      </div>

      {/* Party (Optional) */}
      <div className="form-group">
        <label>Party:</label>
        <input type="text" name="partyIdentifier" value={formData.partyIdentifier} onChange={handleInputChange} />
        {errors.partyIdentifier && <span className="error">{errors.partyIdentifier}</span>}
      </div>

      {/* Account (Mandatory) */}
      <div className="form-group">
        <label>Account *:</label>
        <input type="text" name="safekeepingAccountValue" value={formData.safekeepingAccountValue} onChange={handleInputChange} />
        {errors.safekeepingAccountValue && <span className="error">{errors.safekeepingAccountValue}</span>}
      </div>

      {/* Narrative (Optional) */}
      <div className="form-group">
        <label>Narrative:</label>
        <textarea name="denominationNarrative" value={formData.denominationNarrative} onChange={handleInputChange}></textarea>
        {errors.denominationNarrative && <span className="error">{errors.denominationNarrative}</span>}
      </div>

      {/* Place of Safekeeping (Optional) */}
      <div className="form-group">
        <label>Place of Safekeeping:</label>
        <input type="text" name="placeCode" value={formData.placeCode} onChange={handleInputChange} />
        {errors.placeCode && <span className="error">{errors.placeCode}</span>}
      </div>
    </div>
  );
};

export default FinancialInstrumentAccountSection;
