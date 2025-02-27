import React from 'react';

const LinkagesSection = ({ formData, setFormData }) => {
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  // Reference qualifier options
  const referenceQualifierOptions = [
    { value: 'POOL', label: 'POOL - Pool Reference' },
    { value: 'PREA', label: 'PREA - Preadvice Message Reference' },
    { value: 'PREV', label: 'PREV - Previous Message Reference' },
    { value: 'RELA', label: 'RELA - Related Message Reference' },
    { value: 'TRRF', label: 'TRRF - Deal Reference' },
    { value: 'COMM', label: 'COMM - Common Reference' },
    { value: 'COLR', label: 'COLR - Collateral Reference' },
    { value: 'CORP', label: 'CORP - Corporate Action Reference' },
    { value: 'CLCI', label: 'CLCI - Client\'s Collateral Instruction Reference' },
    { value: 'CLTR', label: 'CLTR - Client\'s Triparty Collateral Transaction Reference' },
    { value: 'PCTI', label: 'PCTI - Processor Transaction Identification' },
    { value: 'TRCI', label: 'TRCI - Triparty-Agent\'s/Service-Provider\'s Collateral Instruction Reference' },
    { value: 'TCTR', label: 'TCTR - Triparty-Agent\'s/Service-Provider\'s Collateral Transaction Reference' }
  ];

  // Quantity qualifier options
  const quantityQualifierOptions = [
    { value: 'PAIR', label: 'PAIR - Quantity of Financial Instrument to be Paired-off' },
    { value: 'TURN', label: 'TURN - Quantity of Financial Instrument to be Turned' }
  ];

  // Number identification qualifier options
  const numberIdQualifierOptions = [
    { value: 'COUP', label: 'COUP - Coupon Number' },
    { value: 'POOL', label: 'POOL - Pool Number' }
  ];

  // Validation Functions
  const validateLinkIndicator = (value) => {
    if (!value) return 'Link indicator is required';
    return /^[A-Z0-9]{4}\/([A-Z0-9]{0,8}\/)?[A-Z0-9]{4}$/.test(value)
      ? ''
      : 'Format must be :4!c/[8c]/4!c';
  };

  const validateLinkedMessage = (data) => {
    const { linkedMessageOption, numberIdQualifier, linkedMessageNumber } = data;
    
    // Only validate if all three fields are filled, or if none are filled
    const allFilled = linkedMessageOption && numberIdQualifier && linkedMessageNumber;
    const noneFilled = !linkedMessageOption && !numberIdQualifier && !linkedMessageNumber;
    
    if (noneFilled) return ''; // Optional fields can be all empty
    if (!allFilled) {
      if (!linkedMessageOption) return 'Option selection is required';
      if (!numberIdQualifier) return 'Qualifier is required';
      if (!linkedMessageNumber) return 'Number identification is required';
    }

    // Validate format based on option
    switch (linkedMessageOption) {
      case 'A':
        return /^[A-Z0-9]{4}\/\/\d{3}$/.test(`${numberIdQualifier}//${linkedMessageNumber}`) 
          ? '' 
          : 'Format must be 4!c//3!c';
      case 'B':
        return /^[A-Z0-9]{4}\/([A-Z0-9]{0,8}\/)?[A-Z0-9]{1,30}$/.test(`${numberIdQualifier}/${data.numberIdScheme || ''}/${linkedMessageNumber}`) 
          ? '' 
          : 'Format must be 4!c/[8c]/30x';
      default:
        return 'Invalid option';
    }
  };

  const validateLinkedReference = (data) => {
    const { linkedReferenceOption, referenceQualifier, linkedReferenceValue } = data;
    
    // Reference fields are mandatory
    if (!linkedReferenceOption) return 'Option selection is required';
    if (!referenceQualifier) return 'Qualifier is required';
    if (!linkedReferenceValue) return 'Reference is required';

    switch (linkedReferenceOption) {
      case 'C':
        return /^[A-Z0-9]{1,16}$/.test(linkedReferenceValue) ? '' : 'Must be up to 16 characters';
      case 'U':
        return /^[A-Z0-9]{1,52}$/.test(linkedReferenceValue) ? '' : 'Must be up to 52 characters';
      default:
        return 'Invalid option';
    }
  };

  const validateQuantity = (data) => {
    const { quantityOption, quantityQualifier, quantityTypeCode, quantityValue } = data;
    
    // Quantity fields are optional, but if any are provided, all must be provided
    const allFilled = quantityOption && quantityQualifier && quantityTypeCode && quantityValue;
    const noneFilled = !quantityOption && !quantityQualifier && !quantityTypeCode && !quantityValue;
    
    if (noneFilled) return ''; // Optional fields can be all empty
    if (!allFilled) {
      if (!quantityOption) return 'Option selection is required';
      if (!quantityQualifier) return 'Qualifier is required';
      if (!quantityTypeCode) return 'Quantity type code is required';
      if (!quantityValue) return 'Quantity is required';
    }

    if (!/^[A-Z]{4}$/.test(quantityTypeCode)) {
      return 'Quantity type must be 4 uppercase letters (4!c)';
    }

    switch (quantityOption) {
      case 'B':
        return /^\d{1,15}(\.\d{0,2})?$/.test(quantityValue) ? '' : 'Invalid quantity format for option B (15d)';
      case 'D':
        return /^\d{1,30}(\.\d{0,2})?$/.test(quantityValue) ? '' : 'Invalid quantity format for option D (30d)';
      default:
        return 'Invalid option';
    }
  };

  // Validate entire form when needed
  const validateForm = (currentFormData) => {
    const newErrors = {};
    
    // Validate link indicator
    if (touched.linkIndicator) {
      newErrors.linkIndicator = validateLinkIndicator(currentFormData.linkIndicator);
    }
    
    // Validate linked message fields
    if (touched.linkedMessageNumber || touched.linkedMessageOption || touched.numberIdQualifier) {
      const messageError = validateLinkedMessage(currentFormData);
      if (messageError) {
        // Only set error on the field that was touched
        if (touched.linkedMessageNumber) newErrors.linkedMessageNumber = messageError;
        if (touched.linkedMessageOption) newErrors.linkedMessageOption = messageError;
        if (touched.numberIdQualifier) newErrors.numberIdQualifier = messageError;
      }
    }
    
    // Validate reference fields
    if (touched.linkedReferenceValue || touched.linkedReferenceOption || touched.referenceQualifier) {
      const refError = validateLinkedReference(currentFormData);
      if (refError) {
        // Only set error on the field that was touched
        if (touched.linkedReferenceValue) newErrors.linkedReferenceValue = refError;
        if (touched.linkedReferenceOption) newErrors.linkedReferenceOption = refError;
        if (touched.referenceQualifier) newErrors.referenceQualifier = refError;
      }
    }
    
    // Validate quantity fields
    if (touched.quantityValue || touched.quantityOption || touched.quantityQualifier || touched.quantityTypeCode) {
      const quantityError = validateQuantity(currentFormData);
      if (quantityError) {
        // Only set error on the field that was touched
        if (touched.quantityValue) newErrors.quantityValue = quantityError;
        if (touched.quantityOption) newErrors.quantityOption = quantityError;
        if (touched.quantityQualifier) newErrors.quantityQualifier = quantityError;
        if (touched.quantityTypeCode) newErrors.quantityTypeCode = quantityError;
      }
    }
    
    setErrors(newErrors);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Update form data
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: value
      };
      
      // Validate with the updated form data
      setTimeout(() => {
        validateForm(newFormData);
      }, 0);
      
      return newFormData;
    });
  };

  // For optional quantity fields, check if any are filled
  const isQuantityGroupActive = () => {
    return formData.quantityOption || formData.quantityQualifier || 
           formData.quantityTypeCode || formData.quantityValue;
  };

  // For optional number ID fields, check if any are filled
  const isNumberIdGroupActive = () => {
    return formData.linkedMessageOption || formData.numberIdQualifier || 
           formData.linkedMessageNumber;
  };

  return (
    <div className="swift-form">
      <h2>Linkages Section (Subsequence A1)</h2>
      
      <div className="form-grid">
        {/* Link Indicator field (22F) */}
        <div className="field-container">
          <label>Link Indicator (22F)</label>
          <input
            type="text"
            name="linkIndicator"
            value={formData.linkIndicator || ''}
            placeholder="e.g., LINK/ABCD/EFGH"
            onChange={handleInputChange}
          />
          {errors.linkIndicator && <span className="error">{errors.linkIndicator}</span>}
        </div>

        {/* Number Identification fields (13a) - Optional group */}
        <div className="field-container">
          <label>Number Identification Qualifier (13a)</label>
          <select
            name="numberIdQualifier"
            value={formData.numberIdQualifier || ''}
            onChange={handleInputChange}
          >
            <option value="">Select qualifier</option>
            {numberIdQualifierOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.numberIdQualifier && <span className="error">{errors.numberIdQualifier}</span>}
        </div>

        <div className="field-container">
          <label>Number Identification Option</label>
          <select
            name="linkedMessageOption"
            value={formData.linkedMessageOption || ''}
            onChange={handleInputChange}
          >
            <option value="">Select option</option>
            <option value="A">A - Format: 4!c//3!c (Qualifier//Number Id)</option>
            <option value="B">B - Format: 4!c/[8c]/30x (Qualifier/Data Source Scheme/Number)</option>
          </select>
          {errors.linkedMessageOption && <span className="error">{errors.linkedMessageOption}</span>}
        </div>

        {formData.linkedMessageOption === 'B' && (
          <div className="field-container">
            <label>Data Source Scheme (Optional for Option B)</label>
            <input
              type="text"
              name="numberIdScheme"
              value={formData.numberIdScheme || ''}
              placeholder="Data source scheme (up to 8 characters)"
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className="field-container">
          <label>Number Identification Value</label>
          <input
            type="text"
            name="linkedMessageNumber"
            value={formData.linkedMessageNumber || ''}
            placeholder={formData.linkedMessageOption === 'A' ? '3 digits' : 'Up to 30 characters'}
            onChange={handleInputChange}
          />
          {errors.linkedMessageNumber && <span className="error">{errors.linkedMessageNumber}</span>}
          {isNumberIdGroupActive() && !formData.linkedMessageNumber && 
            !errors.linkedMessageNumber && touched.linkedMessageNumber && 
            <span className="error">Number identification is required</span>}
        </div>

        {/* Reference fields (20a) */}
        <div className="field-container">
          <label>Reference Qualifier (20a) - Mandatory</label>
          <select
            name="referenceQualifier"
            value={formData.referenceQualifier || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Select qualifier</option>
            {referenceQualifierOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.referenceQualifier && <span className="error">{errors.referenceQualifier}</span>}
          {!formData.referenceQualifier && touched.referenceQualifier && <span className="error">Reference qualifier is required</span>}
        </div>

        <div className="field-container">
          <label>Reference Option</label>
          <select
            name="linkedReferenceOption"
            value={formData.linkedReferenceOption || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Select option</option>
            <option value="C">C - Format: 4!c//16x (Qualifier//Reference)</option>
            <option value="U">U - Format: 4!c//52x (Qualifier//UTI Reference)</option>
          </select>
          {errors.linkedReferenceOption && <span className="error">{errors.linkedReferenceOption}</span>}
          {!formData.linkedReferenceOption && touched.linkedReferenceOption && <span className="error">Option selection is required</span>}
        </div>

        <div className="field-container">
          <label>Reference Value</label>
          <input
            type="text"
            name="linkedReferenceValue"
            value={formData.linkedReferenceValue || ''}
            placeholder={formData.linkedReferenceOption === 'C' ? 'Up to 16 characters' : 'Up to 52 characters'}
            onChange={handleInputChange}
            required
          />
          {errors.linkedReferenceValue && <span className="error">{errors.linkedReferenceValue}</span>}
          {!formData.linkedReferenceValue && touched.linkedReferenceValue && <span className="error">Reference is required</span>}
        </div>

        {/* Quantity fields (36a) - Optional group */}
        <div className="field-container">
          <label>Quantity Qualifier (36a) - Optional</label>
          <select
            name="quantityQualifier"
            value={formData.quantityQualifier || ''}
            onChange={handleInputChange}
          >
            <option value="">Select qualifier</option>
            {quantityQualifierOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.quantityQualifier && <span className="error">{errors.quantityQualifier}</span>}
        </div>

        <div className="field-container">
          <label>Quantity Option</label>
          <select
            name="quantityOption"
            value={formData.quantityOption || ''}
            onChange={handleInputChange}
          >
            <option value="">Select option</option>
            <option value="B">B - Format: 4!c//4!c/15d (Qualifier//Type Code/Quantity)</option>
            <option value="D">D - Format: 4!c//4!c/30d (Qualifier//Type Code/Digital Tokens Quantity)</option>
          </select>
          {errors.quantityOption && <span className="error">{errors.quantityOption}</span>}
        </div>

        <div className="field-container">
          <label>Quantity Type Code (4!c)</label>
          <input
            type="text"
            name="quantityTypeCode"
            value={formData.quantityTypeCode || ''}
            placeholder="4 uppercase letters"
            onChange={handleInputChange}
          />
          {errors.quantityTypeCode && <span className="error">{errors.quantityTypeCode}</span>}
          {isQuantityGroupActive() && !formData.quantityTypeCode && 
            !errors.quantityTypeCode && touched.quantityTypeCode && 
            <span className="error">Quantity type code is required</span>}
        </div>

        <div className="field-container">
          <label>Quantity Value</label>
          <input
            type="text"
            name="quantityValue"
            value={formData.quantityValue || ''}
            placeholder={formData.quantityOption === 'B' ? 'Up to 15 digits' : 'Up to 30 digits'}
            onChange={handleInputChange}
          />
          {errors.quantityValue && <span className="error">{errors.quantityValue}</span>}
          {isQuantityGroupActive() && !formData.quantityValue && 
            !errors.quantityValue && touched.quantityValue && 
            <span className="error">Quantity is required</span>}
        </div>
      </div>
    </div>
  );
};

export default LinkagesSection;