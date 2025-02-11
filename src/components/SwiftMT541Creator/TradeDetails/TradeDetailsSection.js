import React, { useState } from 'react';

const TradeDetailsSection = () => {
  const [formData, setFormData] = useState({
    placeOption: '',
    placeQualifier: '',
    placeCode: '',
    placeDataSource: '',
    placeIdentifier: '',
    placeNarrative: '',
    tradeDateTimeOption: '',
    tradeDateTimeValue: '',
    dealPriceOption: '',
    dealPriceType: '',
    dealPriceValue: '',
    dealPriceCurrency: '',
    daysAccrued: '',
    isin: ''
  });

  const [errors, setErrors] = useState({});

  // Validation Functions
  const validatePlace = (option, qualifier, code, dataSource, identifier, narrative) => {
    if (!option || !qualifier) return 'Qualifier is required';

    switch (option) {
      case 'B':
        return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}(\/[A-Z0-9]{0,30})?$/.test(`${qualifier}/${dataSource}/${code}${narrative ? '/' + narrative : ''}`)
          ? ''
          : 'Invalid format for Option B';
      case 'H':
        return /^[A-Z]{4}\/\/[A-Z]{4}[A-Z0-9]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(identifier)
          ? ''
          : 'Invalid format for Option H';
      case 'L':
        return /^[A-Z]{4}\/\/[A-Z0-9]{18}[0-9]{2}$/.test(identifier) ? '' : 'Invalid format for Option L';
      default:
        return 'Invalid place option';
    }
  };

  const validateTradeDateTime = (option, value) => {
    if (!option) return '';
    switch (option) {
      case 'A':
        return /^\d{8}$/.test(value) ? '' : 'Invalid format for Option A (YYYYMMDD)';
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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    switch (name) {
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
      case 'tradeDateTimeValue':
        error = validateTradeDateTime(formData.tradeDateTimeOption, value);
        break;
      case 'dealPriceValue':
      case 'dealPriceCurrency':
        error = validateDealPrice(formData.dealPriceOption, formData.dealPriceValue, formData.dealPriceCurrency);
        break;
      case 'daysAccrued':
        error = validateDaysAccrued(value);
        break;
      case 'isin':
        error = validateISIN(value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  return (
    <div className="form-section">
      <h2>Trade Details</h2>

      {/* Place */}
      <div className="form-group">
        <label>Place:</label>
        <select name="placeOption" value={formData.placeOption} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="B">Option B - Place of Trade</option>
          <option value="H">Option H - Place of Clearing</option>
          <option value="L">Option L - Legal Entity Identifier</option>
        </select>
        {errors.placeOption && <span className="error">{errors.placeOption}</span>}
      </div>

      {/* Trade Date/Time */}
      <div className="form-group">
        <label>Trade Date/Time *:</label>
        <select name="tradeDateTimeOption" value={formData.tradeDateTimeOption} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="A">Option A - YYYYMMDD</option>
          <option value="C">Option C - YYYYMMDDHHMMSS</option>
          <option value="E">Option E - Extended Format</option>
        </select>
        <input
          type="text"
          name="tradeDateTimeValue"
          value={formData.tradeDateTimeValue}
          onChange={handleInputChange}
          placeholder="Enter date/time"
        />
        {errors.tradeDateTimeValue && <span className="error">{errors.tradeDateTimeValue}</span>}
      </div>

      {/* Deal Price */}
      <div className="form-group">
        <label>Deal Price:</label>
        <select name="dealPriceOption" value={formData.dealPriceOption} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="A">Option A - Percentage Type</option>
          <option value="B">Option B - Currency Type</option>
        </select>
        {formData.dealPriceOption && (
          <>
            <input type="text" name="dealPriceValue" value={formData.dealPriceValue} onChange={handleInputChange} />
            {formData.dealPriceOption === 'B' && (
              <input type="text" name="dealPriceCurrency" value={formData.dealPriceCurrency} onChange={handleInputChange} />
            )}
            {errors.dealPriceValue && <span className="error">{errors.dealPriceValue}</span>}
          </>
        )}
      </div>

      {/* Days Accrued */}
      <div className="form-group">
        <label>Days Accrued:</label>
        <input type="text" name="daysAccrued" value={formData.daysAccrued} onChange={handleInputChange} />
        {errors.daysAccrued && <span className="error">{errors.daysAccrued}</span>}
      </div>

      {/* ISIN */}
      <div className="form-group">
        <label>ISIN *:</label>
        <input type="text" name="isin" value={formData.isin} onChange={handleInputChange} required />
        {errors.isin && <span className="error">{errors.isin}</span>}
      </div>
    </div>
  );
};

export default TradeDetailsSection;
