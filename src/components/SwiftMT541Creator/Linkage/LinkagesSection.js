import React, { useState } from 'react';

const LinkagesSection = () => {
  const [linkages, setLinkages] = useState([]);
  const [showLinkages, setShowLinkages] = useState(false);
  const [formData, setFormData] = useState({
    linkIndicator: '',
    linkedMessageOption: '',
    linkedMessageQualifier: '',
    linkedMessageDataSource: '',
    linkedMessageNumber: '',
    linkedReferenceOption: '',
    linkedReferenceQualifier: '',
    linkedReferenceValue: '',
    quantityOption: '',
    quantityQualifier: '',
    quantityTypeCode: '',
    quantityValue: ''
  });

  const [errors, setErrors] = useState({});

  // Validation Functions
  const validateLinkIndicator = (value) => {
    return /^[A-Z0-9]{4}\/[A-Z0-9]{0,8}\/[A-Z0-9]{4}$/.test(value)
      ? ''
      : 'Format must be 4!c/[8c]/4!c';
  };

  const validateLinkedMessage = (option, value) => {
    if (!option) return '';
    if (!value) return 'Number identification is required';

    switch (option) {
      case 'A':
        return /^\d{3}$/.test(value) ? '' : 'Must be 3 digits for option A';
      case 'B':
        return /^[A-Z0-9]{1,30}$/.test(value) ? '' : 'Must be up to 30 characters for option B';
      default:
        return 'Invalid option';
    }
  };

  const validateLinkedReference = (option, value) => {
    if (!option) return '';
    if (!value) return 'Reference is required';

    switch (option) {
      case 'C':
        return /^[A-Z0-9]{1,16}$/.test(value) ? '' : 'Must be up to 16 characters';
      case 'U':
        return /^[A-Z0-9]{1,52}$/.test(value) ? '' : 'Must be up to 52 characters';
      default:
        return 'Invalid option';
    }
  };

  const validateQuantity = (option, qualifier, type, value) => {
    if (!option || !qualifier || !type) return 'All fields are required for quantity';
    if (!value) return 'Quantity is required';

    if (!/^[A-Z]{4}$/.test(type)) {
      return 'Quantity type must be 4 uppercase letters';
    }

    switch (option) {
      case 'B':
        return /^\d{1,15}(\.\d{0,2})?$/.test(value) ? '' : 'Invalid quantity format for option B';
      case 'D':
        return /^\d{1,30}(\.\d{0,2})?$/.test(value) ? '' : 'Invalid quantity format for option D';
      default:
        return 'Invalid option';
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
      case 'linkIndicator':
        error = validateLinkIndicator(value);
        break;
      case 'linkedMessageNumber':
        error = validateLinkedMessage(formData.linkedMessageOption, value);
        break;
      case 'linkedReferenceValue':
        error = validateLinkedReference(formData.linkedReferenceOption, value);
        break;
      case 'quantityValue':
        error = validateQuantity(formData.quantityOption, formData.quantityQualifier, formData.quantityTypeCode, value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  const addLinkage = () => {
    setLinkages((prev) => [...prev, { ...formData }]);
    setFormData({
      linkIndicator: '',
      linkedMessageOption: '',
      linkedMessageQualifier: '',
      linkedMessageDataSource: '',
      linkedMessageNumber: '',
      linkedReferenceOption: '',
      linkedReferenceQualifier: '',
      linkedReferenceValue: '',
      quantityOption: '',
      quantityQualifier: '',
      quantityTypeCode: '',
      quantityValue: ''
    });
  };

  return (
    <div className="form-section">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="showLinkages"
          checked={showLinkages}
          onChange={() => setShowLinkages(!showLinkages)}
          className="form-checkbox"
        />
        <label htmlFor="showLinkages" className="font-medium">
          Include Linkages
        </label>
      </div>

      {showLinkages && (
        <div className="space-y-4">
          {/* Link Indicator */}
          <div className="form-group">
            <label>Link Indicator (4!c/[8c]/4!c):</label>
            <input type="text" name="linkIndicator" value={formData.linkIndicator} onChange={handleInputChange} />
            {errors.linkIndicator && <span className="error">{errors.linkIndicator}</span>}
          </div>

          {/* Linked Message */}
          <div className="form-group">
            <label>Linked Message:</label>
            <select name="linkedMessageOption" value={formData.linkedMessageOption} onChange={handleInputChange}>
              <option value="">Select option</option>
              <option value="A">A - 3 digit number</option>
              <option value="B">B - Up to 30 characters</option>
            </select>
            {formData.linkedMessageOption && (
              <>
                <input type="text" name="linkedMessageNumber" value={formData.linkedMessageNumber} onChange={handleInputChange} />
                {errors.linkedMessageNumber && <span className="error">{errors.linkedMessageNumber}</span>}
              </>
            )}
          </div>

          {/* Linked Reference */}
          <div className="form-group">
            <label>Linked Reference:</label>
            <select name="linkedReferenceOption" value={formData.linkedReferenceOption} onChange={handleInputChange}>
              <option value="">Select option</option>
              <option value="C">C - Up to 16 characters</option>
              <option value="U">U - UTI Reference (up to 52 characters)</option>
            </select>
            {formData.linkedReferenceOption && (
              <>
                <input type="text" name="linkedReferenceValue" value={formData.linkedReferenceValue} onChange={handleInputChange} />
                {errors.linkedReferenceValue && <span className="error">{errors.linkedReferenceValue}</span>}
              </>
            )}
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Quantity Option:</label>
            <select name="quantityOption" value={formData.quantityOption} onChange={handleInputChange}>
              <option value="">Select option</option>
              <option value="B">B - Standard quantity</option>
              <option value="D">D - Digital tokens quantity</option>
            </select>
            {formData.quantityOption && (
              <>
                <input type="text" name="quantityQualifier" value={formData.quantityQualifier} onChange={handleInputChange} placeholder="Qualifier (e.g., PAIR)" />
                <input type="text" name="quantityTypeCode" value={formData.quantityTypeCode} onChange={handleInputChange} placeholder="Type Code (4!c)" />
                <input type="text" name="quantityValue" value={formData.quantityValue} onChange={handleInputChange} placeholder="Enter quantity" />
                {errors.quantityValue && <span className="error">{errors.quantityValue}</span>}
              </>
            )}
          </div>

          {/* <button type="button" className="add-button" onClick={addLinkage}>
            Add Linkage
          </button> */}

          {linkages.length > 0 && (
            <div>
              <h3>Added Linkages:</h3>
              <pre>{JSON.stringify(linkages, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkagesSection;
