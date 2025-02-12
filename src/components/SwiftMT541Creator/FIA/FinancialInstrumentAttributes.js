import React, { useState } from 'react';

const FinancialInstrumentAttributes = () => {
  const [formData, setFormData] = useState({
    // Field 94B: Place of Listing
    placeOfListingQualifier: '',
    placeOfListingCode: '',
    placeOfListingDataSource: '',
    placeOfListingNarrative: '',
    // Field 22F: Indicator
    financialInstrumentIndicatorQualifier: '',
    financialInstrumentIndicatorCode: '',
    financialInstrumentIndicatorDataSource: '',
    // Field 12a: Type of Financial Instrument
    typeOfFinancialInstrumentOption: '',
    typeOfFinancialInstrumentQualifier: '',
    typeOfFinancialInstrumentCode: '',
    typeOfFinancialInstrumentDataSource: '',
    // Field 11A: Currency of Denomination
    currencyOfDenomination: '',
    // Field 98A: Date/Time
    financialInstrumentDate: '',
    // Field 92A: Rate
    rateQualifier: '',
    rateValue: '',
    // Field 13a: Number Identification
    numberIdentificationOption: '',
    numberIdentificationQualifier: '',
    numberIdentificationValue: '',
    // Field 17B: Flag
    flagQualifier: '',
    flagValue: '',
    // Field 90a: Price
    priceOption: '',
    priceQualifier: '',
    priceValue: '',
    priceCurrency: '',
    // Field 36a: Quantity of Financial Instrument
    financialInstrumentQuantityOption: '',
    financialInstrumentQuantityQualifier: '',
    financialInstrumentQuantityValue: '',
    // Field 35B: Identification of the Financial Instrument
    financialInstrumentIdentification: '',
    // Field 70E: Financial Instrument Narrative
    financialInstrumentNarrative: ''
  });

  const [errors, setErrors] = useState({});

  // Validation Functions
  const validatePlaceOfListing = (qualifier, code, dataSource, narrative) => {
    if (!qualifier) return 'Qualifier is required';
    return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}(\/[A-Z0-9]{0,30})?$/.test(`${qualifier}/${dataSource}/${code}${narrative ? '/' + narrative : ''}`)
      ? ''
      : 'Invalid format for Place of Listing';
  };

  const validateFinancialInstrumentIndicator = (qualifier, code, dataSource) => {
    if (!qualifier) return 'Qualifier is required';
    return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}$/.test(`${qualifier}/${dataSource}/${code}`)
      ? ''
      : 'Invalid format for Financial Instrument Indicator';
  };

  const validateTypeOfFinancialInstrument = (option, qualifier, code, dataSource) => {
    if (!option || !qualifier) return 'Qualifier is required';
    switch (option) {
      case 'A':
        return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{0,30}$/.test(`${qualifier}/${dataSource}/${code}`)
          ? ''
          : 'Invalid format for Option A';
      case 'B':
        return /^[A-Z]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}$/.test(`${qualifier}/${dataSource}/${code}`)
          ? ''
          : 'Invalid format for Option B';
      case 'C':
        return /^[A-Z]{4}\/\/[A-Z0-9]{6}$/.test(`${qualifier}//${code}`)
          ? ''
          : 'Invalid format for Option C';
      default:
        return 'Invalid option';
    }
  };

  const validateCurrencyOfDenomination = (value) => {
    return /^[A-Z]{4}\/\/[A-Z]{3}$/.test(value) ? '' : 'Invalid format for Currency of Denomination';
  };

  const validateFinancialInstrumentDate = (value) => {
    return /^[A-Z]{4}\/\/\d{8}$/.test(value) ? '' : 'Invalid format for Financial Instrument Date';
  };

  const validateRate = (qualifier, value) => {
    if (!qualifier) return 'Qualifier is required';
    return /^[A-Z]{4}\/\/[A-Z0-9]{4}\/-?\d{1,15}(\.\d{1,2})?$/.test(`${qualifier}//${value}`)
      ? ''
      : 'Invalid format for Rate';
  };

  const validateNumberIdentification = (option, qualifier, value) => {
    if (!option || !qualifier) return 'Qualifier is required';
    switch (option) {
      case 'A':
        return /^[A-Z]{4}\/\/[A-Z0-9]{3}$/.test(`${qualifier}//${value}`)
          ? ''
          : 'Invalid format for Option A';
      case 'B':
        return /^[A-Z]{4}\/\/[A-Z0-9]{0,8}\/[A-Z0-9]{0,30}$/.test(`${qualifier}//${value}`)
          ? ''
          : 'Invalid format for Option B';
      default:
        return 'Invalid option';
    }
  };

  const validateFlag = (qualifier, value) => {
    if (!qualifier) return 'Qualifier is required';
    return /^[A-Z]{4}\/\/[A-Z]{1}$/.test(`${qualifier}//${value}`)
      ? ''
      : 'Invalid format for Flag';
  };

  const validatePrice = (option, qualifier, value, currency) => {
    if (!option || !qualifier) return 'Qualifier is required';
    switch (option) {
      case 'A':
        return /^[A-Z]{4}\/\/[A-Z0-9]{4}\/-?\d{1,15}(\.\d{1,2})?$/.test(`${qualifier}//${value}`)
          ? ''
          : 'Invalid format for Option A';
      case 'B':
        return /^[A-Z]{4}\/\/[A-Z0-9]{4}\/[A-Z]{3}\d{1,15}(\.\d{1,2})?$/.test(`${qualifier}//${currency}${value}`)
          ? ''
          : 'Invalid format for Option B';
      default:
        return 'Invalid option';
    }
  };

  const validateFinancialInstrumentQuantity = (option, qualifier, value) => {
    if (!option || !qualifier) return 'Qualifier is required';
    switch (option) {
      case 'B':
        return /^[A-Z]{4}\/\/[A-Z0-9]{4}\/\d{1,15}(\.\d{1,2})?$/.test(`${qualifier}//${value}`)
          ? ''
          : 'Invalid format for Option B';
      case 'D':
        return /^[A-Z]{4}\/\/[A-Z0-9]{4}\/\d{1,30}(\.\d{1,2})?$/.test(`${qualifier}//${value}`)
          ? ''
          : 'Invalid format for Option D';
      default:
        return 'Invalid option';
    }
  };

  const validateFinancialInstrumentNarrative = (value) => {
    return /^[A-Z]{4}\/\/[A-Z0-9]{0,350}$/.test(value) ? '' : 'Invalid format for Financial Instrument Narrative';
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
      case 'financialInstrumentQuantityQualifier':
      case 'financialInstrumentQuantityValue':
        error = validateFinancialInstrumentQuantity(
          formData.financialInstrumentQuantityOption,
          formData.financialInstrumentQuantityQualifier,
          formData.financialInstrumentQuantityValue
        );
        break;
      case 'financialInstrumentNarrative':
        error = validateFinancialInstrumentNarrative(value);
        break;
      default:
        error = '';
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  return (
    <div className="form-section">
      <h2>Financial Instrument Attributes</h2>

      {/* Field 94B: Place of Listing */}
      <div className="form-group">
        <label>Place of Listing *:</label>
        <input
          type="text"
          name="placeOfListingQualifier"
          value={formData.placeOfListingQualifier}
          onChange={handleInputChange}
          placeholder="Qualifier/[8c]/4!c[/30x]"
        />
        {errors.placeOfListingQualifier && <span className="error">{errors.placeOfListingQualifier}</span>}
      </div>

      {/* Field 22F: Indicator */}
      <div className="form-group">
        <label>Financial Instrument Indicator *:</label>
        <input
          type="text"
          name="financialInstrumentIndicatorQualifier"
          value={formData.financialInstrumentIndicatorQualifier}
          onChange={handleInputChange}
          placeholder="Qualifier/[8c]/4!c"
        />
        {errors.financialInstrumentIndicatorQualifier && <span className="error">{errors.financialInstrumentIndicatorQualifier}</span>}
      </div>

      {/* Field 12a: Type of Financial Instrument */}
      <div className="form-group">
        <label>Type of Financial Instrument *:</label>
        <select
          name="typeOfFinancialInstrumentOption"
          value={formData.typeOfFinancialInstrumentOption}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="A">Option A - Instrument Code or Description</option>
          <option value="B">Option B - Instrument Type Code</option>
          <option value="C">Option C - CFI Code</option>
        </select>
        {formData.typeOfFinancialInstrumentOption && (
          <input
            type="text"
            name="typeOfFinancialInstrumentQualifier"
            value={formData.typeOfFinancialInstrumentQualifier}
            onChange={handleInputChange}
            placeholder="Qualifier/[8c]/30x or 4!c"
          />
        )}
        {errors.typeOfFinancialInstrumentQualifier && <span className="error">{errors.typeOfFinancialInstrumentQualifier}</span>}
      </div>

      {/* Field 11A: Currency of Denomination */}
      <div className="form-group">
        <label>Currency of Denomination *:</label>
        <input
          type="text"
          name="currencyOfDenomination"
          value={formData.currencyOfDenomination}
          onChange={handleInputChange}
          placeholder="Qualifier//3!a"
        />
        {errors.currencyOfDenomination && <span className="error">{errors.currencyOfDenomination}</span>}
      </div>

      {/* Field 98A: Date/Time */}
      <div className="form-group">
        <label>Financial Instrument Date *:</label>
        <input
          type="text"
          name="financialInstrumentDate"
          value={formData.financialInstrumentDate}
          onChange={handleInputChange}
          placeholder="Qualifier//8!n"
        />
        {errors.financialInstrumentDate && <span className="error">{errors.financialInstrumentDate}</span>}
      </div>

      {/* Field 92A: Rate */}
      <div className="form-group">
        <label>Rate *:</label>
        <input
          type="text"
          name="rateQualifier"
          value={formData.rateQualifier}
          onChange={handleInputChange}
          placeholder="Qualifier//[N]15d"
        />
        {errors.rateQualifier && <span className="error">{errors.rateQualifier}</span>}
      </div>

      {/* Field 13a: Number Identification */}
      <div className="form-group">
        <label>Number Identification *:</label>
        <select
          name="numberIdentificationOption"
          value={formData.numberIdentificationOption}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="A">Option A - Number Id</option>
          <option value="B">Option B - Data Source Scheme</option>
        </select>
        {formData.numberIdentificationOption && (
          <input
            type="text"
            name="numberIdentificationQualifier"
            value={formData.numberIdentificationQualifier}
            onChange={handleInputChange}
            placeholder="Qualifier//3!c or [8c]/30x"
          />
        )}
        {errors.numberIdentificationQualifier && <span className="error">{errors.numberIdentificationQualifier}</span>}
      </div>

      {/* Field 17B: Flag */}
      <div className="form-group">
        <label>Flag *:</label>
        <input
          type="text"
          name="flagQualifier"
          value={formData.flagQualifier}
          onChange={handleInputChange}
          placeholder="Qualifier//1!a"
        />
        {errors.flagQualifier && <span className="error">{errors.flagQualifier}</span>}
      </div>

      {/* Field 90a: Price */}
      <div className="form-group">
        <label>Price *:</label>
        <select
          name="priceOption"
          value={formData.priceOption}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="A">Option A - Percentage Type</option>
          <option value="B">Option B - Currency Type</option>
        </select>
        {formData.priceOption && (
          <>
            <input
              type="text"
              name="priceQualifier"
              value={formData.priceQualifier}
              onChange={handleInputChange}
              placeholder="Qualifier//[N]15d or 3!a15d"
            />
            {formData.priceOption === 'B' && (
              <input
                type="text"
                name="priceCurrency"
                value={formData.priceCurrency}
                onChange={handleInputChange}
                placeholder="Currency Code"
              />
            )}
            {errors.priceQualifier && <span className="error">{errors.priceQualifier}</span>}
          </>
        )}
      </div>

      {/* Field 36a: Quantity of Financial Instrument */}
      <div className="form-group">
        <label>Quantity of Financial Instrument *:</label>
        <select
          name="financialInstrumentQuantityOption"
          value={formData.financialInstrumentQuantityOption}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="B">Option B - Quantity</option>
          <option value="D">Option D - Quantity of Digital Tokens</option>
        </select>
        {formData.financialInstrumentQuantityOption && (
          <input
            type="text"
            name="financialInstrumentQuantityQualifier"
            value={formData.financialInstrumentQuantityQualifier}
            onChange={handleInputChange}
            placeholder="Qualifier//[N]15d or 30d"
          />
        )}
        {errors.financialInstrumentQuantityQualifier && <span className="error">{errors.financialInstrumentQuantityQualifier}</span>}
      </div>

      {/* Field 35B: Identification of the Financial Instrument */}
      <div className="form-group">
        <label>Identification of the Financial Instrument *:</label>
        <input
          type="text"
          name="financialInstrumentIdentification"
          value={formData.financialInstrumentIdentification}
          onChange={handleInputChange}
          placeholder="ISIN1!e12!c [4*35x]"
        />
        {errors.financialInstrumentIdentification && <span className="error">{errors.financialInstrumentIdentification}</span>}
      </div>

      {/* Field 70E: Financial Instrument Narrative */}
      <div className="form-group">
        <label>Financial Instrument Narrative *:</label>
        <input
          type="text"
          name="financialInstrumentNarrative"
          value={formData.financialInstrumentNarrative}
          onChange={handleInputChange}
          placeholder="Qualifier//10*35x"
        />
        {errors.financialInstrumentNarrative && <span className="error">{errors.financialInstrumentNarrative}</span>}
      </div>
    </div>
  );
};

export default FinancialInstrumentAttributes;