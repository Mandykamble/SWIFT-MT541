import React from 'react';

const FinancialInstrumentForm = ({ formData, setFormData }) => {
  const [errors, setErrors] = React.useState({});

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
      case 'D':
        return value.length <= 140 ? '' : 'Blockchain address must not exceed 140 characters';
      case 'B':
        return value.length <= 35 ? '' : 'Account number must not exceed 35 characters';
      default:
        return '';
    }
  };

  const validateDataSourceScheme = (value) => {
    return !value || value.length <= 8 ? '' : 'Data source scheme must not exceed 8 characters';
  };

  const validateCertificateNumber = (value) => {
    return /^[A-Z]{4}\/(\[[A-Za-z0-9]{1,8}\]\/)?[A-Za-z0-9]{1,30}$/.test(value) 
      ? '' 
      : 'Format must be 4!c/[8c]/30x';
  };

  const validateNarrative = (value) => {
    return !value || value.length <= 210 ? '' : 'Narrative must not exceed 210 characters (6*35x)';
  };

  const validatePlaceCode = (option, value) => {
    if (!option || !value) return '';
    
    switch (option) {
      case 'B':
        return /^[A-Z]{4}(\/[A-Za-z0-9]{1,30})?$/.test(value) ? '' : 'Invalid place code format (4!c[/30x])';
      case 'C':
        return /^[A-Z]{2}$/.test(value) ? '' : 'Country code must be 2 uppercase letters';
      case 'F':
        return /^[A-Z]{4}\/[A-Z]{4}[A-Z]{2}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?$/.test(value) 
          ? '' 
          : 'Format must be 4!c/BIC';
      case 'L':
        return validateLEI(value);
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
          if (!current[path[i]]) {
            current[path[i]] = {};
          }
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
      if (formData.party.option === 'L') {
        error = validateLEI(value);
      } else if (formData.party.option === 'P') {
        error = validateBIC(value);
      }
    } else if (name === 'account.value') {
      error = validateAccount(formData.account.option, value);
    } else if (name === 'party.dataSourceScheme' || name === 'account.dataSourceScheme') {
      error = validateDataSourceScheme(value);
    } else if (name === 'certificate.value') {
      error = validateCertificateNumber(value);
    } else if (name === 'narrative.value') {
      error = validateNarrative(value);
    } else if (name === 'place.value') {
      error = validatePlaceCode(formData.place.option, value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  return (
    <div className="swift-form">
      <h2>Financial Instrument/Account</h2>
      
     
      {/* Quantity of Financial Instrument (36a) - MANDATORY */}
      <div className="form-grid">
        <div className="field-container">
          <label>Quantity of Financial Instrument (36a) *</label>
          <select 
            name="quantity.option"
            value={formData.quantity.option || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Select format option</option>
            <option value="B">Option B (Standard Quantity)</option>
            <option value="D">Option D (Digital Tokens)</option>
          </select>
        </div>

        <div className="field-container">
          <label>Qualifier (SETT) *</label>
          <input
            type="text"
            name="quantity.qualifier"
            value={formData.quantity.qualifier || 'SETT'}
            onChange={handleInputChange}
            placeholder="SETT"
            readOnly
            required
          />
        </div>

        <div className="field-container">
          <label>Quantity Type Code *</label>
          <input
            type="text"
            name="quantity.quantityTypeCode"
            value={formData.quantity.quantityTypeCode || ''}
            onChange={handleInputChange}
            placeholder="Quantity Type Code (4!c)"
            required
          />
        </div>

        <div className="field-container">
          <label>Quantity Value *</label>
          <input
            type="text"
            name="quantity.value"
            value={formData.quantity.value || ''}
            onChange={handleInputChange}
            placeholder={formData.quantity.option === 'B' ? 'Quantity (15d)' : 'Quantity (30d)'}
            required
          />
          {errors['quantity.value'] && <span className="error">{errors['quantity.value']}</span>}
        </div>
      </div>

      {/* Narrative (70D) - OPTIONAL */}
      <div className="form-grid">
        <div className="field-container">
          <label>Denomination Choice Narrative (70D)</label>
          <select 
            name="narrative.option"
            value={formData.narrative?.option || ''}
            onChange={handleInputChange}
          >
            <option value="">Not specified</option>
            <option value="DENC">DENC - Denomination Choice</option>
          </select>
        </div>

        <div className="field-container">
          <label>Narrative:</label>
          <textarea
            name="narrative.value"
            value={formData.narrative?.value || ''}
            onChange={handleInputChange}
            placeholder="Narrative (4!c//6*35x)"
            rows="3"
          />
          {errors['narrative.value'] && <span className="error">{errors['narrative.value']}</span>}
        </div>
      </div>

      {/* Certificate Number (13B) - OPTIONAL */}
      <div className="form-grid">
        <div className="field-container">
          <label>Certificate Number (13B)</label>
          <select 
            name="certificate.option"
            value={formData.certificate?.option || ''}
            onChange={handleInputChange}
          >
            <option value="">Not specified</option>
            <option value="CERT">CERT - Certificate Number</option>
          </select>
        </div>

        <div className="field-container">
          <label>Certificate Value:</label>
          <input
            type="text"
            name="certificate.value"
            value={formData.certificate?.value || ''}
            onChange={handleInputChange}
            placeholder="Format: 4!c/[8c]/30x"
          />
          {errors['certificate.value'] && <span className="error">{errors['certificate.value']}</span>}
        </div>
      </div>

      {/* Party (95a) - OPTIONAL */}
      <div className="form-grid">
        <div className="field-container">
          <label>Party (95a)</label>
          <select
            name="party.option"
            value={formData.party?.option || ''}
            onChange={handleInputChange}
          >
            <option value="">Select party option</option>
            <option value="L">Option L (LEI)</option>
            <option value="P">Option P (BIC)</option>
            <option value="R">Option R (Proprietary)</option>
          </select>
        </div>

        <div className="field-container">
          <label>Party Qualifier:</label>
          <select
            name="party.qualifier"
            value={formData.party?.qualifier || ''}
            onChange={handleInputChange}
          >
            <option value="">Select qualifier</option>
            <option value="ACOW">ACOW - Account Owner</option>
            <option value="ALTE">ALTE - Alternate Identification</option>
          </select>
        </div>

        <div className="field-container">
          <label>Identifier:</label>
          <input
            type="text"
            name="party.identifier"
            value={formData.party?.identifier || ''}
            onChange={handleInputChange}
            placeholder={
              formData.party?.option === 'L' 
                ? 'Enter LEI (20 characters)' 
                : formData.party?.option === 'P' 
                  ? 'Enter BIC' 
                  : 'Enter Proprietary Code'
            }
          />
          {errors['party.identifier'] && <span className="error">{errors['party.identifier']}</span>}
        </div>

        {formData.party?.option === 'R' && (
          <div className="field-container">
            <label>Data Source Scheme:</label>
            <input
              type="text"
              name="party.dataSourceScheme"
              value={formData.party?.dataSourceScheme || ''}
              onChange={handleInputChange}
              placeholder="Data Source Scheme (8c)"
            />
            {errors['party.dataSourceScheme'] && <span className="error">{errors['party.dataSourceScheme']}</span>}
          </div>
        )}
      </div>

      {/* Account (97a) - MANDATORY */}
      <div className="form-grid">
        <div className="field-container">
          <label>Account (97a) *</label>
          <select
            name="account.option"
            value={formData.account?.option || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Select account option</option>
            <option value="A">Option A (Account Number)</option>
            <option value="B">Option B (Account Type)</option>
            <option value="D">Option D (Blockchain)</option>
            <option value="E">Option E (IBAN)</option>
          </select>
        </div>

        <div className="field-container">
          <label>Account Qualifier *</label>
          <select
            name="account.qualifier"
            value={formData.account?.qualifier || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Select qualifier</option>
            <option value="BCAW">BCAW - Blockchain Address or Wallet</option>
            <option value="CASH">CASH - Cash Account</option>
            <option value="SAFE">SAFE - Safekeeping Account</option>
          </select>
        </div>

        {formData.account?.option === 'A' && (
          <div className="field-container">
            <label>Account Number *</label>
            <input
              type="text"
              name="account.value"
              value={formData.account?.value || ''}
              onChange={handleInputChange}
              placeholder="Account Number (35x)"
              required
            />
            {errors['account.value'] && <span className="error">{errors['account.value']}</span>}
          </div>
        )}

        {formData.account?.option === 'B' && (
          <>
            <div className="field-container">
              <label>Data Source Scheme:</label>
              <input
                type="text"
                name="account.dataSourceScheme"
                value={formData.account?.dataSourceScheme || ''}
                onChange={handleInputChange}
                placeholder="Data Source Scheme (8c)"
              />
              {errors['account.dataSourceScheme'] && <span className="error">{errors['account.dataSourceScheme']}</span>}
            </div>
            
            <div className="field-container">
              <label>Account Type Code *</label>
              <input
                type="text"
                name="account.accountTypeCode"
                value={formData.account?.accountTypeCode || ''}
                onChange={handleInputChange}
                placeholder="Account Type Code (4!c)"
                required
              />
            </div>
            
            <div className="field-container">
              <label>Account Number *</label>
              <input
                type="text"
                name="account.value"
                value={formData.account?.value || ''}
                onChange={handleInputChange}
                placeholder="Account Number (35x)"
                required
              />
              {errors['account.value'] && <span className="error">{errors['account.value']}</span>}
            </div>
          </>
        )}

        {formData.account?.option === 'D' && (
          <>
            <div className="field-container">
              <label>Data Source Scheme:</label>
              <input
                type="text"
                name="account.dataSourceScheme"
                value={formData.account?.dataSourceScheme || ''}
                onChange={handleInputChange}
                placeholder="Data Source Scheme (8c)"
              />
              {errors['account.dataSourceScheme'] && <span className="error">{errors['account.dataSourceScheme']}</span>}
            </div>
            
            <div className="field-container">
              <label>Blockchain Address *</label>
              <input
                type="text"
                name="account.value"
                value={formData.account?.value || ''}
                onChange={handleInputChange}
                placeholder="Blockchain Address or Wallet (140x)"
                required
              />
              {errors['account.value'] && <span className="error">{errors['account.value']}</span>}
            </div>
          </>
        )}

        {formData.account?.option === 'E' && (
          <div className="field-container">
            <label>IBAN *</label>
            <input
              type="text"
              name="account.value"
              value={formData.account?.value || ''}
              onChange={handleInputChange}
              placeholder="IBAN (34x)"
              required
            />
            {errors['account.value'] && <span className="error">{errors['account.value']}</span>}
          </div>
        )}
      </div>

      {/* Place of Safekeeping (94a) - OPTIONAL */}
      <div className="form-grid">
        <div className="field-container">
          <label>Place of Safekeeping (94a)</label>
          <select
            name="place.option"
            value={formData.place?.option || ''}
            onChange={handleInputChange}
          >
            <option value="">Select place option</option>
            <option value="B">Option B (Place Code)</option>
            <option value="C">Option C (Country Code)</option>
            <option value="F">Option F (Identifier Code)</option>
            <option value="L">Option L (LEI)</option>
          </select>
        </div>

        <div className="field-container">
          <label>Qualifier:</label>
          <input
            type="text"
            name="place.qualifier"
            value={formData.place?.qualifier || 'SAFE'}
            onChange={handleInputChange}
            placeholder="SAFE"
            readOnly
          />
        </div>

        {formData.place?.option === 'B' && (
          <>
            <div className="field-container">
              <label>Data Source Scheme:</label>
              <input
                type="text"
                name="place.dataSourceScheme"
                value={formData.place?.dataSourceScheme || ''}
                onChange={handleInputChange}
                placeholder="Data Source Scheme (8c)"
              />
            </div>
            
            <div className="field-container">
              <label>Place Code:</label>
              <input
                type="text"
                name="place.value"
                value={formData.place?.value || ''}
                onChange={handleInputChange}
                placeholder="Place Code (4!c)"
              />
              {errors['place.value'] && <span className="error">{errors['place.value']}</span>}
            </div>
            
            <div className="field-container">
              <label>Narrative:</label>
              <input
                type="text"
                name="place.narrative"
                value={formData.place?.narrative || ''}
                onChange={handleInputChange}
                placeholder="Narrative (30x)"
              />
            </div>
          </>
        )}

        {formData.place?.option === 'C' && (
          <div className="field-container">
            <label>Country Code:</label>
            <input
              type="text"
              name="place.value"
              value={formData.place?.value || ''}
              onChange={handleInputChange}
              placeholder="Country Code (2!a)"
            />
            {errors['place.value'] && <span className="error">{errors['place.value']}</span>}
          </div>
        )}

        {formData.place?.option === 'F' && (
          <>
            <div className="field-container">
              <label>Place Code:</label>
              <input
                type="text"
                name="place.placeCode"
                value={formData.place?.placeCode || ''}
                onChange={handleInputChange}
                placeholder="Place Code (4!c)"
              />
            </div>
            
            <div className="field-container">
              <label>Identifier Code:</label>
              <input
                type="text"
                name="place.value"
                value={formData.place?.value || ''}
                onChange={handleInputChange}
                placeholder="Identifier Code (BIC format)"
              />
              {errors['place.value'] && <span className="error">{errors['place.value']}</span>}
            </div>
          </>
        )}

        {formData.place?.option === 'L' && (
          <div className="field-container">
            <label>LEI:</label>
            <input
              type="text"
              name="place.value"
              value={formData.place?.value || ''}
              onChange={handleInputChange}
              placeholder="LEI (20 characters)"
            />
            {errors['place.value'] && <span className="error">{errors['place.value']}</span>}
          </div>
        )}
      </div>
      
      
    </div>
  );
};

export default FinancialInstrumentForm;