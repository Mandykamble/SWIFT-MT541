import React, { useState } from 'react';
import './SwiftForm.css';
import Navbar from '../SwiftMT541Creator/Navbar/Navbar';

const SwiftMT541Creator = () => {
  // Define format specifications and validation patterns
  const SWIFT_FORMATS = {
    FOUR_CHAR: /^[A-Z]{4}$/,
    FOUR_CHAR_SLASH_FOUR: /^[A-Z]{4}(\/[A-Z]{4})?$/,
    REF_4C_16X: /^[A-Z]{4}\/\/[A-Za-z0-9]{1,16}$/,
    DATE_8N: /^\d{8}$/,
    ISIN: /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/,
    INDICATOR_4C_8C_4C: /^:?[A-Z]{4}(\/[A-Z0-9]{1,8})?\/[A-Z]{4}$/,
    CURRENCY_3A: /^:?[A-Z]{4}\/\/[A-Z]{3}$/,
    QUANTITY_15D: /^[0-9]{1,15}(,[0-9]{1,2})?$/,
    NUMBER_3N: /^[0-9]{1,3}$/,
    NARRATIVE_35X: /^[A-Za-z0-9/\-?:().,'\+ ]{1,35}$/,
    NUMBER_COUNT: /^[NBC]$/
  };

  // Field options based on specifications
  const FIELD_OPTIONS = {
    dateTimeOptions: ['A', 'B', 'C', 'E'],
    numberCountOptions: ['B', 'C'],
    qualifierOptions: {
      link: ['POOL', 'PREV', 'RELA', 'COMM'],
      party: ['SELL', 'BUYR', 'DEAG', 'REAG', 'DEI1', 'REI1', 'PSET', 'DEPT']
    },
    functionOptions: ['NEWM', 'PREA', 'COPY', 'DUPL']
  };

  // Initial form state
  const [formData, setFormData] = useState({
    // Sequence A - General Information
    senderReference: '',               // M - 20C
    functionOfMessage: '',             // M - 23G
    preparationDateTime: '',           // O - 98a
    numberCount: '',                   // O - 99a
    
    // Sequence A1 - Linkages
    linkageType: '',                   // O - 22F
    linkedMessage: '',                 // O - 13a
    linkedReference: '',               // M - 20a
    linkageQuantity: '',               // O - 36a
    
    // Sequence B - Trade Details
    placeOfTrade: '',                 // O - 94a
    tradeDateTime: '',                // M - 98a
    dealPrice: '',                    // O - 90a
    daysAccrued: '',                  // O - 99A
    isin: '',                         // M - 35B
    
    // Sequence B1 - Financial Instrument Attributes
    placeOfListing: '',              // O - 94B
    financialIndicator: '',          // O - 22F
    instrumentType: '',              // O - 12a
    denomination: '',                // O - 11A
    instrumentDateTime: '',          // O - 98A
    instrumentRate: '',              // O - 92A
    certificateNumber: '',           // O - 13a
    instrumentFlag: '',              // O - 17B
    instrumentPrice: '',             // O - 90a
    instrumentQuantity: '',          // O - 36a
    instrumentId: '',                // O - 35B
    instrumentNarrative: '',         // O - 70E
    
    // Sequence C - Financial Instrument Account
    settlementQuantity: '',          // M - 36a
    denominationChoice: '',          // O - 70D
    certNumber: '',                  // O - 13B
    partyDetails: '',               // O - 95a
    accountDetails: '',             // M - 97a
    safekeepingPlace: '',           // O - 94a
    
    // Sequence C1 - Break Down
    lotNumber: '',                  // O - 13B
    lotQuantity: '',               // O - 36a
    lotDateTime: '',               // O - 98a
    lotPrice: '',                  // O - 90a
    priceTypeIndicator: '',        // O - 22F
    
    // Sequence D - Repo Details
    repoDateTime: '',              // O - 98a
    repoIndicator: '',            // O - 22F
    repoReference: '',            // O - 20C
    repoRate: '',                 // O - 92a
    repoCount: '',                // O - 99B
    repoAmount: '',               // O - 19A
    secondLegNarrative: '',       // O - 70C
    
    // Sequence E - Settlement Details
    settlementIndicator: ''        // M - 22F
  });

  // State for section visibility
  const [visibleSections, setVisibleSections] = useState({
    linkages: false,
    financialInstrument: false,
    breakdown: false,
    repo: false
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Validation function
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'senderReference':
        if (!SWIFT_FORMATS.REF_4C_16X.test(value)) {
          error = 'Format must be :4!c//16x';
        }
        break;
      case 'functionOfMessage':
        if (!SWIFT_FORMATS.FOUR_CHAR_SLASH_FOUR.test(value)) {
          error = 'Format must be 4!c[/4!c]';
        }
        break;
      case 'isin':
        if (!SWIFT_FORMATS.ISIN.test(value)) {
          error = 'Invalid ISIN format';
        }
        break;
      case 'tradeDateTime':
        if (!SWIFT_FORMATS.DATE_8N.test(value)) {
          error = 'Date must be in YYYYMMDD format';
        }
        break;
      // Add other validations based on format specifications
    }
    
    return error;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Toggle section visibility
  const toggleSection = (section) => {
    setVisibleSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Generate SWIFT message
  const generateSwiftMessage = () => {
    let message = `{1:F01XXXXXXXXXXXXXXX0000000000}
{2:I541XXXXXXXXXXXXXN}
{4:
:16R:GENL
:20C::SEME//${formData.senderReference}
:23G:${formData.functionOfMessage}`;

    if (formData.preparationDateTime) {
      message += `\n:98A::PREP//${formData.preparationDateTime}`;
    }

    // Add other sequences based on form data...
    
    message += '\n-}';
    return message;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate mandatory fields
    const mandatoryErrors = {};
    if (!formData.senderReference) {
      mandatoryErrors.senderReference = 'Sender Reference is required';
    }
    if (!formData.functionOfMessage) {
      mandatoryErrors.functionOfMessage = 'Function of Message is required';
    }
    // Add other mandatory field validations
    
    if (Object.keys(mandatoryErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        ...mandatoryErrors
      }));
      return;
    }
    
    // Generate and set message output
    const message = generateSwiftMessage();
    console.log(message);
  };

  return (
    <div>
      <Navbar />
      <div className="swift-container">
        <h1>SWIFT MT541 Message Generator</h1>
        <form onSubmit={handleSubmit} className="swift-form">
          {/* Sequence A - General Information */}
          <div className="form-section">
            <h2>General Information</h2>
            <div className="form-group">
              <label>Sender Reference (20C) *:</label>
              <input
                type="text"
                name="senderReference"
                value={formData.senderReference}
                onChange={handleInputChange}
                placeholder=":4!c//16x"
                required
              />
              {errors.senderReference && <span className="error">{errors.senderReference}</span>}
            </div>
            
            <div className="form-group">
              <label>Function of Message (23G) *:</label>
              <select
                name="functionOfMessage"
                value={formData.functionOfMessage}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Function</option>
                {FIELD_OPTIONS.functionOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.functionOfMessage && <span className="error">{errors.functionOfMessage}</span>}
            </div>
            
            <div className="form-group">
              <label>Preparation Date/Time (98a):</label>
              <select
                name="preparationDateTime"
                value={formData.preparationDateTime}
                onChange={handleInputChange}
              >
                <option value="">Select Format</option>
                {FIELD_OPTIONS.dateTimeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Number Count (99a):</label>
              <select
                name="numberCount"
                value={formData.numberCount}
                onChange={handleInputChange}
              >
                <option value="">Select Format</option>
                {FIELD_OPTIONS.numberCountOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add all other sequences with their respective fields */}
          {/* Each sequence should follow the same pattern of form groups with proper validation */}
          
          <button type="submit" className="generate-button">
            Generate MT541 Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default SwiftMT541Creator;