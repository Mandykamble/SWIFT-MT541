import React from 'react';

const FinancialInstrumentAttributes = ({ formData, setFormData }) => {
  const [errors, setErrors] = React.useState({});

  // Validation Functions
  const validatePlaceOfListing = (qualifier, code, dataSource, narrative) => {
    if (!qualifier) return 'Qualifier is required';
    return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}(\/[A-Z0-9]{0,30})?$/.test(`${qualifier}/${dataSource || ''}/${code || ''}${narrative ? '/' + narrative : ''}`)
      ? ''
      : 'Invalid format for Place of Listing';
  };

  const validateFinancialInstrumentIndicator = (qualifier, code, dataSource) => {
    if (!qualifier) return 'Qualifier is required';
    return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}$/.test(`${qualifier}/${dataSource || ''}/${code || ''}`)
      ? ''
      : 'Invalid format for Financial Instrument Indicator';
  };

  const validateTypeOfFinancialInstrument = (option, qualifier, code, dataSource) => {
    if (!option || !qualifier) return 'Qualifier is required';
    switch (option) {
      case 'A':
        return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{0,30}$/.test(`${qualifier}/${dataSource || ''}/${code || ''}`)
          ? ''
          : 'Invalid format for Option A';
      case 'B':
        return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}$/.test(`${qualifier}/${dataSource || ''}/${code || ''}`)
          ? ''
          : 'Invalid format for Option B';
      case 'C':
        return /^[A-Z]{4}\/\/[A-Z0-9]{6}$/.test(`${qualifier}//${code || ''}`)
          ? ''
          : 'Invalid format for Option C';
      default:
        return 'Invalid option';
    }
  };

  const validateCurrencyOfDenomination = (value) => {
    if (!value) return '';
    return /^[A-Z]{4}\/\/[A-Z]{3}$/.test(value) ? '' : 'Invalid format for Currency of Denomination';
  };

  const validateFinancialInstrumentDate = (value) => {
    if (!value) return '';
    return /^[A-Z]{4}\/\/\d{8}$/.test(value) ? '' : 'Invalid format for Financial Instrument Date';
  };

  const validateRate = (qualifier, value) => {
    if (!qualifier) return '';
    return /^[A-Z]{4}\/\/[A-Z0-9]{4}\/-?\d{1,15}(\.\d{1,2})?$/.test(`${qualifier}//${value || ''}`)
      ? ''
      : 'Invalid format for Rate';
  };

  const validateNumberIdentification = (option, qualifier, value) => {
    if (!option || !qualifier) return '';
    switch (option) {
      case 'A':
        return /^[A-Z]{4}\/\/[A-Z0-9]{3}$/.test(`${qualifier}//${value || ''}`)
          ? ''
          : 'Invalid format for Option A';
      case 'B':
        return /^[A-Z]{4}\/\/[A-Z0-9]{0,8}\/[A-Z0-9]{0,30}$/.test(`${qualifier}//${value || ''}`)
          ? ''
          : 'Invalid format for Option B';
      default:
        return 'Invalid option';
    }
  };

  const validateFlag = (qualifier, value) => {
    if (!qualifier) return '';
    return /^[A-Z]{4}\/\/[A-Z]{1}$/.test(`${qualifier}//${value || ''}`)
      ? ''
      : 'Invalid format for Flag';
  };

  const validatePrice = (option, qualifier, value, currency) => {
    if (!option || !qualifier) return '';
    switch (option) {
      case 'A':
        return /^[A-Z]{4}\/\/[A-Z0-9]{4}\/-?\d{1,15}(\.\d{1,2})?$/.test(`${qualifier}//${value || ''}`)
          ? ''
          : 'Invalid format for Option A';
      case 'B':
        return /^[A-Z]{4}\/\/[A-Z0-9]{4}\/[A-Z]{3}\d{1,15}(\.\d{1,2})?$/.test(`${qualifier}//${currency || ''}${value || ''}`)
          ? ''
          : 'Invalid format for Option B';
      default:
        return 'Invalid option';
    }
  };

  const validateFinancialInstrumentQuantity = (option, qualifier, value) => {
    if (!option || !qualifier) return '';
    switch (option) {
      case 'B':
        return /^[A-Z]{4}\/\/[A-Z0-9]{4}\/\d{1,15}(\.\d{1,2})?$/.test(`${qualifier}//${value || ''}`)
          ? ''
          : 'Invalid format for Option B';
      case 'D':
        return /^[A-Z]{4}\/\/[A-Z0-9]{4}\/\d{1,30}(\.\d{1,2})?$/.test(`${qualifier}//${value || ''}`)
          ? ''
          : 'Invalid format for Option D';
      default:
        return 'Invalid option';
    }
  };

  const validateFinancialInstrumentIdentification = (value) => {
    if (!value) return '';
    // ISIN1!e12!c [4*35x]
    return /^(ISIN[A-Z][A-Z0-9]{12})(\s+[A-Z0-9]{1,35}){0,4}$/.test(value)
      ? ''
      : 'Invalid format for Financial Instrument Identification';
  };

  const validateFinancialInstrumentNarrative = (value) => {
    if (!value) return '';
    return /^[A-Z]{4}\/\/[A-Z0-9]{0,350}$/.test(value) ? '' : 'Invalid format for Financial Instrument Narrative';
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate fields
    switch (name) {
      case 'placeOfListingQualifier':
      case 'placeOfListingCode':
      case 'placeOfListingDataSource':
      case 'placeOfListingNarrative':
        error = validatePlaceOfListing(
          formData.placeOfListingQualifier,
          formData.placeOfListingCode,
          formData.placeOfListingDataSource,
          formData.placeOfListingNarrative
        );
        break;
      case 'financialInstrumentIndicatorQualifier':
      case 'financialInstrumentIndicatorCode':
      case 'financialInstrumentIndicatorDataSource':
        error = validateFinancialInstrumentIndicator(
          formData.financialInstrumentIndicatorQualifier,
          formData.financialInstrumentIndicatorCode,
          formData.financialInstrumentIndicatorDataSource
        );
        break;
      case 'typeOfFinancialInstrumentOption':
      case 'typeOfFinancialInstrumentQualifier':
      case 'typeOfFinancialInstrumentCode':
      case 'typeOfFinancialInstrumentDataSource':
        error = validateTypeOfFinancialInstrument(
          formData.typeOfFinancialInstrumentOption,
          formData.typeOfFinancialInstrumentQualifier,
          formData.typeOfFinancialInstrumentCode,
          formData.typeOfFinancialInstrumentDataSource
        );
        break;
      case 'currencyOfDenomination':
        error = validateCurrencyOfDenomination(value);
        break;
      case 'financialInstrumentDate':
        error = validateFinancialInstrumentDate(value);
        break;
      case 'rateQualifier':
      case 'rateValue':
        error = validateRate(formData.rateQualifier, formData.rateValue);
        break;
      case 'numberIdentificationOption':
      case 'numberIdentificationQualifier':
      case 'numberIdentificationValue':
        error = validateNumberIdentification(
          formData.numberIdentificationOption,
          formData.numberIdentificationQualifier,
          formData.numberIdentificationValue
        );
        break;
      case 'flagQualifier':
      case 'flagValue':
        error = validateFlag(formData.flagQualifier, formData.flagValue);
        break;
      case 'priceOption':
      case 'priceQualifier':
      case 'priceValue':
      case 'priceCurrency':
        error = validatePrice(
          formData.priceOption,
          formData.priceQualifier,
          formData.priceValue,
          formData.priceCurrency
        );
        break;
      case 'financialInstrumentQuantityOption':
      case 'financialInstrumentQuantityQualifier':
      case 'financialInstrumentQuantityValue':
        error = validateFinancialInstrumentQuantity(
          formData.financialInstrumentQuantityOption,
          formData.financialInstrumentQuantityQualifier,
          formData.financialInstrumentQuantityValue
        );
        break;
      case 'financialInstrumentIdentification':
        error = validateFinancialInstrumentIdentification(value);
        break;
      case 'financialInstrumentNarrative':
        error = validateFinancialInstrumentNarrative(value);
        break;
      default:
        error = '';
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  return (
    <div className="swift-form">
      <h2>Financial Instrument Attributes</h2>
      
      
      
      {/* Place of Listing - Now with exactly 3 fields per row */}
      <div className="form-grid">
        <div className="field-container">
          <label>Place of Listing:</label>
          <input
            type="text"
            name="placeOfListingQualifier"
            value={formData.placeOfListingQualifier || ''}
            onChange={handleInputChange}
            placeholder="Qualifier (4!c)"
          />
          {errors.placeOfListingQualifier && <span className="error">{errors.placeOfListingQualifier}</span>}
        </div>

        <div className="field-container">
          <label>Data Source:</label>
          <input
            type="text"
            name="placeOfListingDataSource"
            value={formData.placeOfListingDataSource || ''}
            onChange={handleInputChange}
            placeholder="Data Source [8c]"
          />
          {errors.placeOfListingDataSource && <span className="error">{errors.placeOfListingDataSource}</span>}
        </div>

        <div className="field-container">
          <label>Place Code:</label>
          <input
            type="text"
            name="placeOfListingCode"
            value={formData.placeOfListingCode || ''}
            onChange={handleInputChange}
            placeholder="Place Code (4!c)"
          />
          {errors.placeOfListingCode && <span className="error">{errors.placeOfListingCode}</span>}
        </div>
      </div>
      
      {/* Narrative in a new row */}
      <div className="form-grid">
        <div className="field-container">
          <label>Narrative:</label>
          <input
            type="text"
            name="placeOfListingNarrative"
            value={formData.placeOfListingNarrative || ''}
            onChange={handleInputChange}
            placeholder="Narrative [30x]"
          />
          {errors.placeOfListingNarrative && <span className="error">{errors.placeOfListingNarrative}</span>}
        </div>
        <div className="field-container"></div>
        <div className="field-container"></div>
      </div>

      {/* Financial Instrument Indicator - Exactly 3 fields */}
      <div className="form-grid">
        <div className="field-container">
          <label>Financial Instrument Indicator:</label>
          <input
            type="text"
            name="financialInstrumentIndicatorQualifier"
            value={formData.financialInstrumentIndicatorQualifier || ''}
            onChange={handleInputChange}
            placeholder="Qualifier (4!c)"
          />
          {errors.financialInstrumentIndicatorQualifier && <span className="error">{errors.financialInstrumentIndicatorQualifier}</span>}
        </div>

        <div className="field-container">
          <label>Data Source:</label>
          <input
            type="text"
            name="financialInstrumentIndicatorDataSource"
            value={formData.financialInstrumentIndicatorDataSource || ''}
            onChange={handleInputChange}
            placeholder="Data Source [8c]"
          />
          {errors.financialInstrumentIndicatorDataSource && <span className="error">{errors.financialInstrumentIndicatorDataSource}</span>}
        </div>

        <div className="field-container">
          <label>Indicator Code:</label>
          <input
            type="text"
            name="financialInstrumentIndicatorCode"
            value={formData.financialInstrumentIndicatorCode || ''}
            onChange={handleInputChange}
            placeholder="Indicator Code (4!c)"
          />
          {errors.financialInstrumentIndicatorCode && <span className="error">{errors.financialInstrumentIndicatorCode}</span>}
        </div>
      </div>

      {/* Type of Financial Instrument - Split into multiple rows with 3 fields each */}
      <div className="form-grid">
        <div className="field-container">
          <label>Type of Financial Instrument:</label>
          <select
            name="typeOfFinancialInstrumentOption"
            value={formData.typeOfFinancialInstrumentOption || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Option</option>
            <option value="A">Option A - Instrument Code or Description</option>
            <option value="B">Option B - Instrument Type Code</option>
            <option value="C">Option C - CFI Code</option>
          </select>
          {errors.typeOfFinancialInstrumentOption && <span className="error">{errors.typeOfFinancialInstrumentOption}</span>}
        </div>

        <div className="field-container">
          <label>Qualifier:</label>
          <select
            name="typeOfFinancialInstrumentQualifier"
            value={formData.typeOfFinancialInstrumentQualifier || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Qualifier</option>
            <option value="CLAS">CLAS - Classification Type</option>
            <option value="OPST">OPST - Option Style</option>
            <option value="OPTI">OPTI - Option Type</option>
          </select>
          {errors.typeOfFinancialInstrumentQualifier && <span className="error">{errors.typeOfFinancialInstrumentQualifier}</span>}
        </div>

        <div className="field-container">
          <label>Data Source:</label>
          <input
            type="text"
            name="typeOfFinancialInstrumentDataSource"
            value={formData.typeOfFinancialInstrumentDataSource || ''}
            onChange={handleInputChange}
            placeholder="Data Source [8c]"
          />
          {errors.typeOfFinancialInstrumentDataSource && <span className="error">{errors.typeOfFinancialInstrumentDataSource}</span>}
        </div>
      </div>
      
      <div className="form-grid">
        <div className="field-container">
          <label>Code:</label>
          <input
            type="text"
            name="typeOfFinancialInstrumentCode"
            value={formData.typeOfFinancialInstrumentCode || ''}
            onChange={handleInputChange}
            placeholder="Code (30x or 4!c or 6!c)"
          />
          {errors.typeOfFinancialInstrumentCode && <span className="error">{errors.typeOfFinancialInstrumentCode}</span>}
        </div>
        <div className="field-container"></div>
        <div className="field-container"></div>
      </div>

      {/* Currency and Date - Combined in one row */}
      <div className="form-grid">
        <div className="field-container">
          <label>Currency of Denomination:</label>
          <input
            type="text"
            name="currencyOfDenomination"
            value={formData.currencyOfDenomination || ''}
            onChange={handleInputChange}
            placeholder="DENO//3!a (e.g., DENO//USD)"
          />
          {errors.currencyOfDenomination && <span className="error">{errors.currencyOfDenomination}</span>}
        </div>

        <div className="field-container">
          <label>Financial Instrument Date:</label>
          <input
            type="text"
            name="financialInstrumentDate"
            value={formData.financialInstrumentDate || ''}
            onChange={handleInputChange}
            placeholder="Qualifier//8!n (e.g., MATU//20240531)"
          />
          {errors.financialInstrumentDate && <span className="error">{errors.financialInstrumentDate}</span>}
        </div>
        
        <div className="field-container"></div>
      </div>

      {/* Rate */}
      <div className="form-grid">
        <div className="field-container">
          <label>Rate:</label>
          <input
            type="text"
            name="rateQualifier"
            value={formData.rateQualifier || ''}
            onChange={handleInputChange}
            placeholder="Qualifier (4!c)"
          />
          {errors.rateQualifier && <span className="error">{errors.rateQualifier}</span>}
        </div>

        <div className="field-container">
          <label>Rate Value:</label>
          <input
            type="text"
            name="rateValue"
            value={formData.rateValue || ''}
            onChange={handleInputChange}
            placeholder="Rate Value [N]15d"
          />
          {errors.rateValue && <span className="error">{errors.rateValue}</span>}
        </div>
        
        <div className="field-container"></div>
      </div>

      {/* Number Identification */}
      <div className="form-grid">
        <div className="field-container">
          <label>Number Identification:</label>
          <select
            name="numberIdentificationOption"
            value={formData.numberIdentificationOption || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Option</option>
            <option value="A">Option A - Number Id</option>
            <option value="B">Option B - Data Source Scheme</option>
          </select>
          {errors.numberIdentificationOption && <span className="error">{errors.numberIdentificationOption}</span>}
        </div>

        <div className="field-container">
          <label>Qualifier:</label>
          <select
            name="numberIdentificationQualifier"
            value={formData.numberIdentificationQualifier || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Qualifier</option>
            <option value="COUP">COUP - Coupon Number</option>
            <option value="POOL">POOL - Pool Number</option>
          </select>
          {errors.numberIdentificationQualifier && <span className="error">{errors.numberIdentificationQualifier}</span>}
        </div>

        <div className="field-container">
          <label>Value:</label>
          <input
            type="text"
            name="numberIdentificationValue"
            value={formData.numberIdentificationValue || ''}
            onChange={handleInputChange}
            placeholder="Value (3!c or [8c]/30x)"
          />
          {errors.numberIdentificationValue && <span className="error">{errors.numberIdentificationValue}</span>}
        </div>
      </div>

      {/* Flag */}
      <div className="form-grid">
        <div className="field-container">
          <label>Flag:</label>
          <input
            type="text"
            name="flagQualifier"
            value={formData.flagQualifier || ''}
            onChange={handleInputChange}
            placeholder="Qualifier (4!c)"
          />
          {errors.flagQualifier && <span className="error">{errors.flagQualifier}</span>}
        </div>

        <div className="field-container">
          <label>Flag Value:</label>
          <input
            type="text"
            name="flagValue"
            value={formData.flagValue || ''}
            onChange={handleInputChange}
            placeholder="Flag Value (1!a)"
          />
          {errors.flagValue && <span className="error">{errors.flagValue}</span>}
        </div>
        
        <div className="field-container"></div>
      </div>

      {/* Price - Split into multiple rows with 3 fields each */}
      <div className="form-grid">
        <div className="field-container">
          <label>Price:</label>
          <select
            name="priceOption"
            value={formData.priceOption || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Option</option>
            <option value="A">Option A - Percentage Type</option>
            <option value="B">Option B - Currency Type</option>
          </select>
          {errors.priceOption && <span className="error">{errors.priceOption}</span>}
        </div>

        <div className="field-container">
          <label>Qualifier:</label>
          <select
            name="priceQualifier"
            value={formData.priceQualifier || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Qualifier</option>
            <option value="INDC">INDC - Indicative Price</option>
            <option value="MRKT">MRKT - Market Price</option>
            <option value="EXER">EXER - Exercise Price</option>
          </select>
          {errors.priceQualifier && <span className="error">{errors.priceQualifier}</span>}
        </div>

        <div className="field-container">
          <label>Type Code:</label>
          <input
            type="text"
            name="priceTypeCode"
            value={formData.priceTypeCode || ''}
            onChange={handleInputChange}
            placeholder="Type Code (4!c)"
          />
          {errors.priceTypeCode && <span className="error">{errors.priceTypeCode}</span>}
        </div>
      </div>
      
      <div className="form-grid">
        <div className="field-container">
          <label>Currency (Option B):</label>
          <input
            type="text"
            name="priceCurrency"
            value={formData.priceCurrency || ''}
            onChange={handleInputChange}
            placeholder="Currency Code (3!a)"
            disabled={formData.priceOption !== 'B'}
          />
          {errors.priceCurrency && <span className="error">{errors.priceCurrency}</span>}
        </div>

        <div className="field-container">
          <label>Value:</label>
          <input
            type="text"
            name="priceValue"
            value={formData.priceValue || ''}
            onChange={handleInputChange}
            placeholder="Price Value [N]15d"
          />
          {errors.priceValue && <span className="error">{errors.priceValue}</span>}
        </div>
        
        <div className="field-container"></div>
      </div>

      {/* Quantity of Financial Instrument - Now with exactly 3 fields per row */}
      <div className="form-grid">
        <div className="field-container">
          <label>Quantity of Financial Instrument:</label>
          <select
            name="financialInstrumentQuantityOption"
            value={formData.financialInstrumentQuantityOption || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Option</option>
            <option value="B">Option B - Quantity</option>
            <option value="D">Option D - Quantity of Digital Tokens</option>
          </select>
          {errors.financialInstrumentQuantityOption && <span className="error">{errors.financialInstrumentQuantityOption}</span>}
        </div>

        <div className="field-container">
          <label>Qualifier:</label>
          <select
            name="financialInstrumentQuantityQualifier"
            value={formData.financialInstrumentQuantityQualifier || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Qualifier</option>
            <option value="MINO">MINO - Minimum Nominal Quantity</option>
            <option value="SIZE">SIZE - Contract Size</option>
          </select>
          {errors.financialInstrumentQuantityQualifier && <span className="error">{errors.financialInstrumentQuantityQualifier}</span>}
        </div>

        <div className="field-container">
          <label>Type Code:</label>
          <input
            type="text"
            name="financialInstrumentQuantityTypeCode"
            value={formData.financialInstrumentQuantityTypeCode || ''}
            onChange={handleInputChange}
            placeholder="Type Code (4!c)"
          />
          {errors.financialInstrumentQuantityTypeCode && <span className="error">{errors.financialInstrumentQuantityTypeCode}</span>}
        </div>
      </div>
      
      <div className="form-grid">
        <div className="field-container">
          <label>Value:</label>
          <input
            type="text"
            name="financialInstrumentQuantityValue"
            value={formData.financialInstrumentQuantityValue || ''}
            onChange={handleInputChange}
            placeholder={formData.financialInstrumentQuantityOption === 'D' ? "Quantity (30d)" : "Quantity (15d)"}
          />
          {errors.financialInstrumentQuantityValue && <span className="error">{errors.financialInstrumentQuantityValue}</span>}
        </div>
        <div className="field-container"></div>
        <div className="field-container"></div>
      </div>

      {/* Identification of the Financial Instrument */}
      <div className="form-grid">
        <div className="field-container">
          <label>Identification of the Financial Instrument:</label>
          <input
            type="text"
            name="financialInstrumentIdentification"
            value={formData.financialInstrumentIdentification || ''}
            onChange={handleInputChange}
            placeholder="[ISIN1!e12!c] [4*35x]"
          />
          {errors.financialInstrumentIdentification && <span className="error">{errors.financialInstrumentIdentification}</span>}
        </div>
        <div className="field-container"></div>
        <div className="field-container"></div>
      </div>

      {/* Financial Instrument Narrative */}
      <div className="form-grid">
        <div className="field-container">
          <label>Financial Instrument Narrative:</label>
          <input
            type="text"
            name="financialInstrumentNarrative"
            value={formData.financialInstrumentNarrative || ''}
            onChange={handleInputChange}
            placeholder="FIAN//10*35x"
          />
          {errors.financialInstrumentNarrative && <span className="error">{errors.financialInstrumentNarrative}</span>}
        </div>
        <div className="field-container"></div>
        <div className="field-container"></div>
      </div>
      
      {/* End of Block FIA */}
      <div className="form-grid">
        
        <div className="field-container"></div>
        <div className="field-container"></div>
      </div>
    </div>
  );
};

export default FinancialInstrumentAttributes;