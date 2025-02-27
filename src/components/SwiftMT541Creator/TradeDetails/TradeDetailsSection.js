import React from 'react';

const TradeDetailsSection = ({ formData, setFormData }) => {
  const [errors, setErrors] = React.useState({});

  // Validation Functions
  const validatePlace = (option, qualifier, code, dataSource, identifier, narrative) => {
    if (!option) return 'Place option is required';

    switch (option) {
      case 'B': // Place of Trade
        return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}(\/[A-Z0-9]{0,30})?$/.test(
          `${qualifier}/${dataSource}/${code}${narrative ? '/' + narrative : ''}`
        )
          ? ''
          : 'Invalid format for Option B';

      case 'H': // Place of Clearing (Identifier Code)
        return /^[A-Z]{4}\/\/[A-Z]{4}[A-Z0-9]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(identifier)
          ? ''
          : 'Invalid format for Option H';

      case 'L': // Legal Entity Identifier
        return /^[A-Z]{4}\/\/[A-Z0-9]{18}[0-9]{2}$/.test(identifier)
          ? ''
          : 'Invalid format for Option L';

      default:
        return 'Invalid place option';
    }
  };

  const validateTradeDateTime = (option, value) => {
    if (!option) return '';
    switch (option) {
      case 'A':
        return /^\d{8}$/.test(value) ? '' : 'Invalid format for Option A (YYYYMMDD)';
      case 'B':
        return /^[A-Z0-9]{0,8}\/[A-Z0-9]{4}$/.test(value) ? '' : 'Invalid format for Option B (DataSourceScheme/DateCode)';
      case 'C':
        return /^\d{14}$/.test(value) ? '' : 'Invalid format for Option C (YYYYMMDDHHMMSS)';
      case 'E':
        return /^\d{14}(,\d{1,3})?(\/[N]?\d{2}(\d{2})?)?$/.test(value) ? '' : 'Invalid format for Option E';
      default:
        return 'Invalid trade date/time option';
    }
  };

  const validateDealPrice = (option, value, currency) => {
    if (!option) return '';
    switch (option) {
      case 'A':
        return /^[A-Z]{4}\/\/[A-Z0-9]{4}\/-?\d{1,15}(\.\d{1,2})?$/.test(value)
          ? ''
          : 'Invalid format for Option A';
      case 'B':
        return /^[A-Z]{4}\/\/[A-Z0-9]{4}\/[A-Z]{3}\d{1,15}(\.\d{1,2})?$/.test(currency)
          ? ''
          : 'Invalid format for Option B';
      default:
        return 'Invalid deal price option';
    }
  };

  const validateDaysAccrued = (value) => {
    return /^\d{1,3}$/.test(value) ? '' : 'Invalid days accrued format (1-3 digits)';
  };

  const validateISIN = (value) => {
    return /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(value) ? '' : 'Invalid ISIN format';
  };
  
  const validateCurrencyToSell = (value) => {
    return /^[A-Z]{4}\/\/[A-Z]{3}$/.test(value) ? '' : 'Invalid format for Currency to Sell (4!c//3!a)';
  };
  
  const validateStatusCode = (value) => {
    return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}$/.test(value) ? '' : 'Invalid format for Status Code';
  };
  
  const validateNarrative = (value) => {
    return value.length <= 350 ? '' : 'Narrative must not exceed 350 characters (10*35x)';
  };
  
  const validateIndicator = (value) => {
    return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}$/.test(value) ? '' : 'Invalid format for Indicator';
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    switch (name) {
      case 'placeOption':
      case 'placeQualifier':
      case 'placeCode':
      case 'placeDataSource':
      case 'placeIdentifier':
      case 'placeNarrative':
        error = validatePlace(
          formData.placeOption,
          formData.placeQualifier,
          formData.placeCode,
          formData.placeDataSource,
          formData.placeIdentifier,
          formData.placeNarrative
        );
        break;
      case 'tradeDateTimeOption':
      case 'tradeDateTimeValue':
        error = validateTradeDateTime(
          name === 'tradeDateTimeOption' ? value : formData.tradeDateTimeOption, 
          name === 'tradeDateTimeValue' ? value : formData.tradeDateTimeValue
        );
        break;
      case 'settlementDateTimeOption':
      case 'settlementDateTimeValue':
        error = validateTradeDateTime(
          name === 'settlementDateTimeOption' ? value : formData.settlementDateTimeOption, 
          name === 'settlementDateTimeValue' ? value : formData.settlementDateTimeValue
        );
        break;
      case 'lateDeliveryDateTimeOption':
      case 'lateDeliveryDateTimeValue':
        error = validateTradeDateTime(
          name === 'lateDeliveryDateTimeOption' ? value : formData.lateDeliveryDateTimeOption, 
          name === 'lateDeliveryDateTimeValue' ? value : formData.lateDeliveryDateTimeValue
        );
        break;
      case 'dealPriceOption':
      case 'dealPriceValue':
      case 'dealPriceCurrency':
        error = validateDealPrice(
          name === 'dealPriceOption' ? value : formData.dealPriceOption,
          name === 'dealPriceValue' ? value : formData.dealPriceValue,
          name === 'dealPriceCurrency' ? value : formData.dealPriceCurrency
        );
        break;
      case 'daysAccrued':
        error = validateDaysAccrued(value);
        break;
      case 'isin':
        error = validateISIN(value);
        break;
      case 'currencyToSell':
        error = validateCurrencyToSell(value);
        break;
      case 'statusCode':
        error = validateStatusCode(value);
        break;
      case 'narrative':
        error = validateNarrative(value);
        break;
      case 'indicator':
        error = validateIndicator(value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  return (
    <div className="swift-form">
      <h2>Trade Details</h2>
      
      {/* Place Options (Field 94a) */}
      <div className="form-grid">
        <div className="field-container">
          <label>Place Option:</label>
          <select name="placeOption" value={formData.placeOption} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="B">B - Place of Trade</option>
            <option value="H">H - Place of Clearing</option>
            <option value="L">L - Legal Entity Identifier</option>
          </select>
          {errors.placeOption && <span className="error">{errors.placeOption}</span>}
        </div>
        
        <div className="field-container">
          <label>Qualifier (4!c)</label>
          <select name="placeQualifier" value={formData.placeQualifier} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="CLEA">CLEA - Place of Clearing</option>
            <option value="TRAD">TRAD - Place of Trade</option>
          </select>
        </div>

        {formData.placeOption === 'B' && (
          <div className="field-container">
            <label>Data Source Scheme (8c)</label>
            <input type="text" name="placeDataSource" value={formData.placeDataSource} onChange={handleInputChange} />
          </div>
        )}
      </div>

      {formData.placeOption === 'B' && (
        <div className="form-grid">
          <div className="field-container">
            <label>Place Code (4!c)</label>
            <input type="text" name="placeCode" value={formData.placeCode} onChange={handleInputChange} />
          </div>
          <div className="field-container">
            <label>Narrative (Optional)</label>
            <input type="text" name="placeNarrative" value={formData.placeNarrative} onChange={handleInputChange} />
          </div>
          <div className="field-container">
            {/* Empty container for grid alignment */}
          </div>
        </div>
      )}

      {formData.placeOption === 'H' && (
        <div className="form-grid">
          <div className="field-container">
            <label>Identifier Code (4!a2!a2!c[3!c])</label>
            <input type="text" name="placeIdentifier" value={formData.placeIdentifier} onChange={handleInputChange} />
            {errors.placeIdentifier && <span className="error">{errors.placeIdentifier}</span>}
          </div>
          <div className="field-container">
            {/* Empty container for grid alignment */}
          </div>
          <div className="field-container">
            {/* Empty container for grid alignment */}
          </div>
        </div>
      )}

      {formData.placeOption === 'L' && (
        <div className="form-grid">
          <div className="field-container">
            <label>Legal Entity Identifier (18!c2!n)</label>
            <input type="text" name="placeIdentifier" value={formData.placeIdentifier} onChange={handleInputChange} />
            {errors.placeIdentifier && <span className="error">{errors.placeIdentifier}</span>}
          </div>
          <div className="field-container">
            {/* Empty container for grid alignment */}
          </div>
          <div className="field-container">
            {/* Empty container for grid alignment */}
          </div>
        </div>
      )}

      {/* Settlement Date/Time (Field 98a) - MANDATORY */}
      <div className="form-grid">
        <div className="field-container">
          <label>Settlement Date/Time Option *:</label>
          <select name="settlementDateTimeOption" value={formData.settlementDateTimeOption} onChange={handleInputChange} required>
            <option value="">Select</option>
            <option value="A">Option A - YYYYMMDD</option>
            <option value="B">Option B - DataSourceScheme/DateCode</option>
            <option value="C">Option C - YYYYMMDDHHMMSS</option>
          </select>
          {!formData.settlementDateTimeOption && <span className="error">Settlement date/time is required</span>}
        </div>
        <div className="field-container">
          <label>Settlement Date/Time Value *:</label>
          <input
            type="text"
            name="settlementDateTimeValue"
            value={formData.settlementDateTimeValue}
            onChange={handleInputChange}
            required
          />
          {errors.settlementDateTimeValue && <span className="error">{errors.settlementDateTimeValue}</span>}
        </div>
        <div className="field-container">
          {/* Empty container for grid alignment */}
        </div>
      </div>

      {/* Trade Date/Time (Field 98a) - OPTIONAL */}
      <div className="form-grid">
        <div className="field-container">
          <label>Trade Date/Time Option:</label>
          <select name="tradeDateTimeOption" value={formData.tradeDateTimeOption} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="A">Option A - YYYYMMDD</option>
            <option value="B">Option B - DataSourceScheme/DateCode</option>
            <option value="C">Option C - YYYYMMDDHHMMSS</option>
            <option value="E">Option E - Extended Format</option>
          </select>
        </div>
        <div className="field-container">
          <label>Trade Date/Time Value:</label>
          <input
            type="text"
            name="tradeDateTimeValue"
            value={formData.tradeDateTimeValue}
            onChange={handleInputChange}
          />
          {errors.tradeDateTimeValue && <span className="error">{errors.tradeDateTimeValue}</span>}
        </div>
        <div className="field-container">
          {/* Empty container for grid alignment */}
        </div>
      </div>

      {/* Late Delivery Date/Time (Field 98a) - OPTIONAL */}
      <div className="form-grid">
        <div className="field-container">
          <label>Late Delivery Date/Time Option:</label>
          <select name="lateDeliveryDateTimeOption" value={formData.lateDeliveryDateTimeOption} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="A">Option A - YYYYMMDD</option>
            <option value="C">Option C - YYYYMMDDHHMMSS</option>
          </select>
        </div>
        <div className="field-container">
          <label>Late Delivery Date/Time Value:</label>
          <input
            type="text"
            name="lateDeliveryDateTimeValue"
            value={formData.lateDeliveryDateTimeValue}
            onChange={handleInputChange}
          />
          {errors.lateDeliveryDateTimeValue && <span className="error">{errors.lateDeliveryDateTimeValue}</span>}
        </div>
        <div className="field-container">
          {/* Empty container for grid alignment */}
        </div>
      </div>

      {/* Deal Price (Field 90a) */}
      <div className="form-grid">
        <div className="field-container">
          <label>Deal Price Option:</label>
          <select name="dealPriceOption" value={formData.dealPriceOption} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="A">Option A - Percentage Type</option>
            <option value="B">Option B - Currency Type</option>
          </select>
        </div>
        <div className="field-container">
          <label>Deal Price Value:</label>
          <input type="text" name="dealPriceValue" value={formData.dealPriceValue} onChange={handleInputChange} />
          {errors.dealPriceValue && <span className="error">{errors.dealPriceValue}</span>}
        </div>
        {formData.dealPriceOption === 'B' ? (
          <div className="field-container">
            <label>Deal Price Currency:</label>
            <input type="text" name="dealPriceCurrency" value={formData.dealPriceCurrency} onChange={handleInputChange} />
            {errors.dealPriceCurrency && <span className="error">{errors.dealPriceCurrency}</span>}
          </div>
        ) : (
          <div className="field-container">
            {/* Empty container for grid alignment */}
          </div>
        )}
      </div>

      {/* Days Accrued (Field 99A) & ISIN (Field 35B) - First part */}
      <div className="form-grid">
        <div className="field-container">
          <label>Days Accrued:</label>
          <input type="text" name="daysAccrued" value={formData.daysAccrued} onChange={handleInputChange} />
          {errors.daysAccrued && <span className="error">{errors.daysAccrued}</span>}
        </div>
        <div className="field-container">
          <label>ISIN *:</label>
          <input type="text" name="isin" value={formData.isin} onChange={handleInputChange} required />
          {errors.isin && <span className="error">{errors.isin}</span>}
        </div>
        <div className="field-container">
          <label>Description Line 1 (Optional):</label>
          <input 
            type="text" 
            name="isinDescription1" 
            value={formData.isinDescription1} 
            onChange={handleInputChange}
            placeholder="Up to 35 characters"
          />
        </div>
      </div>

      
      {/* Indicator (Field 22F) & Currency to Sell (Field 11A) & Status Code (Field 25D) */}
      <div className="form-grid">
        <div className="field-container">
          <label>Indicator:</label>
          <input 
            type="text" 
            name="indicator" 
            value={formData.indicator} 
            onChange={handleInputChange} 
            placeholder="Format: 4!c/[8c]/4!c" 
          />
          {errors.indicator && <span className="error">{errors.indicator}</span>}
        </div>
        <div className="field-container">
          <label>Currency to Sell:</label>
          <input 
            type="text" 
            name="currencyToSell" 
            value={formData.currencyToSell} 
            onChange={handleInputChange} 
            placeholder="Format: FXIS//3!a" 
          />
          {errors.currencyToSell && <span className="error">{errors.currencyToSell}</span>}
        </div>
        <div className="field-container">
          <label>Status Code:</label>
          <input 
            type="text" 
            name="statusCode" 
            value={formData.statusCode} 
            onChange={handleInputChange} 
            placeholder="Format: 4!c/[8c]/4!c" 
          />
          {errors.statusCode && <span className="error">{errors.statusCode}</span>}
        </div>
      </div>
      
      {/* Narrative (Field 70E) */}
      <div className="form-grid">
        <div className="field-container">
          <label>Narrative Qualifier:</label>
          <input 
            type="text" 
            name="narrativeQualifier" 
            value={formData.narrativeQualifier} 
            onChange={handleInputChange}
            placeholder="4!c (e.g., TRDE)"
          />
        </div>
        <div className="field-container">
          <label>Narrative:</label>
          <input 
            type="text" 
            name="narrativeLine1" 
            value={formData.narrativeLine1} 
            onChange={handleInputChange}
            placeholder="Up to 35 characters"
          />
        </div>
       
      </div>
    </div>
  );
};

export default TradeDetailsSection;