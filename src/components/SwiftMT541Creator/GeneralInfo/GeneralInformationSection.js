import React, { useState } from 'react';

const GeneralInformationSection = () => {
  const [formData, setFormData] = useState({
    senderReference: '',
    functionOfMessage: '',
    prepDateTimeOption: '',
    prepDateTimeValue: '',
    numberCountOption: '',
    numberCountQualifier: '',
    numberCountValue: ''
  });

  const [errors, setErrors] = useState({});

  // Validation Functions
  const validateSenderReference = (value) => {
    return /^[A-Z0-9]{1,16}$/.test(value) ? '' : 'Sender reference must be up to 16 alphanumeric characters';
  };

  const validateFunctionOfMessage = (value) => {
    return /^[A-Z]{4}(\/[A-Z]{4})?$/.test(value) ? '' : 'Invalid function format (4!c[/4!c])';
  };

  const validatePrepDateTime = (option, value) => {
    if (!option) return '';
    switch (option) {
      case 'A':
        return /^\d{8}$/.test(value) ? '' : 'Invalid format for Option A (YYYYMMDD)';
      case 'C':
        return /^\d{14}$/.test(value) ? '' : 'Invalid format for Option C (YYYYMMDDHHMMSS)';
      case 'E':
        return /^\d{14}(,\d{1,3})?(\/[N]?\d{2}(\d{2})?)?$/.test(value) ? '' : 'Invalid format for Option E';
      default:
        return 'Invalid preparation date/time option';
    }
  };

  const validateNumberCount = (option, qualifier, value) => {
    if (!option || !qualifier) return 'Qualifier is required';
    switch (option) {
      case 'B':
        return /^\d{3}$/.test(value) ? '' : 'Invalid format for Option B (3 digits)';
      case 'C':
        return /^\d{6}$/.test(value) ? '' : 'Invalid format for Option C (6 digits)';
      default:
        return 'Invalid number count option';
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    switch (name) {
      case 'senderReference':
        error = validateSenderReference(value);
        break;
      case 'functionOfMessage':
        error = validateFunctionOfMessage(value);
        break;
      case 'prepDateTimeValue':
        error = validatePrepDateTime(formData.prepDateTimeOption, value);
        break;
      case 'numberCountValue':
        error = validateNumberCount(formData.numberCountOption, formData.numberCountQualifier, value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  return (
    <div className="form-section">
      <h2>General Information</h2>

      {/* Form Grid Container */}
      <div className="form-grid">
        {/* Row 1: Sender Reference and Function of Message */}
        <div className="form-row">
          {/* Sender Reference */}
          <div className="field-container">
            <label>Sender Reference *</label>
            <input 
              type="text" 
              name="senderReference" 
              value={formData.senderReference} 
              onChange={handleInputChange} 
              required 
            />
            {errors.senderReference && <span className="error">{errors.senderReference}</span>}
          </div>

          {/* Function of the Message */}
          <div className="field-container">
            <label>Function of the Message *</label>
            <input 
              type="text" 
              name="functionOfMessage" 
              value={formData.functionOfMessage} 
              onChange={handleInputChange} 
              required 
            />
            {errors.functionOfMessage && <span className="error">{errors.functionOfMessage}</span>}
          </div>
        </div>

        {/* Row 2: Preparation Date/Time */}
        <div className="form-row">
          {/* Preparation Date/Time Option */}
          <div className="field-container">
            <label>Preparation Date/Time Option</label>
            <select 
              name="prepDateTimeOption" 
              value={formData.prepDateTimeOption} 
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="A">Option A - YYYYMMDD</option>
              <option value="C">Option C - YYYYMMDDHHMMSS</option>
              <option value="E">Option E - Extended Format</option>
            </select>
          </div>

          {/* Preparation Date/Time Value */}
          <div className="field-container">
            <label>Preparation Date/Time Value</label>
            <input 
              type="text" 
              name="prepDateTimeValue" 
              value={formData.prepDateTimeValue} 
              onChange={handleInputChange} 
              placeholder="Enter date/time" 
            />
            {errors.prepDateTimeValue && <span className="error">{errors.prepDateTimeValue}</span>}
          </div>
        </div>

        {/* Row 3: Number Count Options and Value */}
        <div className="form-row">
          {/* Number Count Option */}
          <div className="field-container">
            <label>Number Count Option</label>
            <select 
              name="numberCountOption" 
              value={formData.numberCountOption} 
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="B">Option B - 3 Digits</option>
              <option value="C">Option C - 6 Digits</option>
            </select>
          </div>

          {/* Number Count Qualifier (conditionally rendered) */}
          <div className="field-container">
            <label>Number Count Qualifier</label>
            {formData.numberCountOption ? (
              <select 
                name="numberCountQualifier" 
                value={formData.numberCountQualifier} 
                onChange={handleInputChange}
              >
                <option value="">Select Qualifier</option>
                <option value="SETT">SETT - Current Settlement Instruction Number</option>
                <option value="TOSE">TOSE - Total Linked Settlement Instructions</option>
              </select>
            ) : (
              <select disabled>
                <option value="">Select Option First</option>
              </select>
            )}
          </div>
        </div>

        {/* Row 4: Number Count Value (conditionally rendered) */}
        {formData.numberCountOption && formData.numberCountQualifier && (
          <div className="form-row">
            <div className="field-container full-width">
              <label>Number Count Value</label>
              <input 
                type="text" 
                name="numberCountValue" 
                value={formData.numberCountValue} 
                onChange={handleInputChange} 
                placeholder={formData.numberCountOption === 'B' ? 'Enter 3 digits' : 'Enter 6 digits'} 
              />
              {errors.numberCountValue && <span className="error">{errors.numberCountValue}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralInformationSection;