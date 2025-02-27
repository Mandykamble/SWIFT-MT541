import React, { useState } from 'react';

const QuantityBreakdownForm = ({ formData, setFormData }) => {
  // Create a default structure for quantityBreakdown
  const defaultQuantityBreakdown = {
    option: '',
    qualifier: 'LOTS',
    typeCode: '',
    value: '',
    lotNumber: {
      qualifier: 'LOTS',
      scheme: '',
      number: ''
    },
    dateTime: {
      option: 'A',
      qualifier: 'LOTS',
      date: '',
      time: '',
      decimals: '',
      utcIndicator: ''
    },
    price: {
      option: 'A',
      qualifier: 'LOTS',
      typeCode: '',
      currency: '',
      price: ''
    },
    priceIndicator: {
      qualifier: 'PRIC',
      scheme: '',
      indicator: ''
    }
  };

  // Use the existing data if available, otherwise use the default
  const quantityBreakdown = formData.quantityBreakdown 
    ? {
        ...defaultQuantityBreakdown,
        ...formData.quantityBreakdown,
        lotNumber: {
          ...defaultQuantityBreakdown.lotNumber,
          ...(formData.quantityBreakdown.lotNumber || {})
        },
        dateTime: {
          ...defaultQuantityBreakdown.dateTime,
          ...(formData.quantityBreakdown.dateTime || {})
        },
        price: {
          ...defaultQuantityBreakdown.price,
          ...(formData.quantityBreakdown.price || {})
        },
        priceIndicator: {
          ...defaultQuantityBreakdown.priceIndicator,
          ...(formData.quantityBreakdown.priceIndicator || {})
        }
      } 
    : defaultQuantityBreakdown;

  // Validation state
  const [errors, setErrors] = useState({});

  // Quantity options
  const quantityOptions = [
    { value: 'B', label: 'Option B (Standard Quantity - 15d)' },
    { value: 'D', label: 'Option D (Digital Tokens - 30d)' }
  ];

  // Qualifier options
  const qualifierOptions = [
    { value: 'MINO', label: 'Minimum Nominal Quantity (MINO)' },
    { value: 'SIZE', label: 'Contract Size (SIZE)' },
    { value: 'LOTS', label: 'Lot Number (LOTS)' }
  ];

  // Date/Time options
  const dateTimeOptions = [
    { value: 'A', label: 'Option A (Date only)' },
    { value: 'C', label: 'Option C (Date and Time)' },
    { value: 'E', label: 'Option E (Date, Time, Decimals, UTC)' }
  ];

  // Price options
  const priceOptions = [
    { value: 'A', label: 'Option A (Percentage)' },
    { value: 'B', label: 'Option B (Amount with Currency)' }
  ];

  // Validation functions
  const validateTypeCode = (code) => {
    if (!code) return '';
    const regex = /^[A-Z0-9]{4}$/;
    if (!regex.test(code)) return 'Type Code must be 4 alphanumeric characters';
    return '';
  };

  const validateQuantity = (quantity, option) => {
    if (!quantity) return '';
    
    const regex = option === 'B' 
      ? /^-?\d+(\.\d+)?$/ 
      : /^-?\d+(\.\d+)?$/;
    
    if (!regex.test(quantity)) {
      return option === 'B' 
        ? 'Quantity must be a valid number (max 15 digits)' 
        : 'Quantity must be a valid number (max 30 digits)';
    }
    
    if (option === 'B' && quantity.replace(/[.-]/g, '').length > 15) {
      return 'Quantity cannot exceed 15 digits';
    }
    
    if (option === 'D' && quantity.replace(/[.-]/g, '').length > 30) {
      return 'Quantity cannot exceed 30 digits';
    }
    
    return '';
  };

  const validateDate = (date) => {
    if (!date) return '';
    const regex = /^\d{8}$/;
    if (!regex.test(date)) return 'Date must be in YYYYMMDD format';
    return '';
  };

  const validateTime = (time) => {
    if (!time) return '';
    const regex = /^\d{6}$/;
    if (!regex.test(time)) return 'Time must be in HHMMSS format';
    return '';
  };

  const validateDecimals = (decimals) => {
    if (!decimals) return '';
    const regex = /^\d{1,3}$/;
    if (!regex.test(decimals)) return 'Decimals must be 1-3 digits';
    return '';
  };

  const validateUTCIndicator = (indicator) => {
    if (!indicator) return '';
    const regex = /^[N]?\d{2}(\d{2})?$/;
    if (!regex.test(indicator)) return 'UTC Indicator format invalid';
    return '';
  };

  const validateCurrency = (currency) => {
    if (!currency) return '';
    const regex = /^[A-Z]{3}$/;
    if (!regex.test(currency)) return 'Currency must be 3 alphabetic characters';
    return '';
  };

  const validatePrice = (price) => {
    if (!price) return '';
    const regex = /^-?\d+(\.\d+)?$/;
    if (!regex.test(price)) return 'Price must be a valid number';
    return '';
  };

  const validateLotNumber = (number) => {
    if (!number) return '';
    if (number.length > 30) return 'Lot Number cannot exceed 30 characters';
    return '';
  };

  // Handle input changes
  const handleQuantityChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';
    
    if (name === 'typeCode') {
      errorMessage = validateTypeCode(value);
    } else if (name === 'value') {
      errorMessage = validateQuantity(value, quantityBreakdown.option);
    }
    
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage
    }));

    setFormData((prev) => ({
      ...prev,
      quantityBreakdown: {
        ...prev.quantityBreakdown || defaultQuantityBreakdown,
        [name]: value,
      },
    }));
  };

  const handleLotNumberChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';
    
    if (name === 'number') {
      errorMessage = validateLotNumber(value);
    }
    
    setErrors((prev) => ({
      ...prev,
      [`lotNumber_${name}`]: errorMessage
    }));

    setFormData((prev) => {
      const currentQB = prev.quantityBreakdown || defaultQuantityBreakdown;
      return {
        ...prev,
        quantityBreakdown: {
          ...currentQB,
          lotNumber: {
            ...(currentQB.lotNumber || defaultQuantityBreakdown.lotNumber),
            [name]: value,
          },
        },
      };
    });
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';
    
    if (name === 'date') {
      errorMessage = validateDate(value);
    } else if (name === 'time') {
      errorMessage = validateTime(value);
    } else if (name === 'decimals') {
      errorMessage = validateDecimals(value);
    } else if (name === 'utcIndicator') {
      errorMessage = validateUTCIndicator(value);
    }
    
    setErrors((prev) => ({
      ...prev,
      [`dateTime_${name}`]: errorMessage
    }));

    setFormData((prev) => {
      const currentQB = prev.quantityBreakdown || defaultQuantityBreakdown;
      return {
        ...prev,
        quantityBreakdown: {
          ...currentQB,
          dateTime: {
            ...(currentQB.dateTime || defaultQuantityBreakdown.dateTime),
            [name]: value,
          },
        },
      };
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';
    
    if (name === 'price') {
      errorMessage = validatePrice(value);
    } else if (name === 'currency') {
      errorMessage = validateCurrency(value);
    } else if (name === 'typeCode') {
      errorMessage = validateTypeCode(value);
    }
    
    setErrors((prev) => ({
      ...prev,
      [`price_${name}`]: errorMessage
    }));

    setFormData((prev) => {
      const currentQB = prev.quantityBreakdown || defaultQuantityBreakdown;
      return {
        ...prev,
        quantityBreakdown: {
          ...currentQB,
          price: {
            ...(currentQB.price || defaultQuantityBreakdown.price),
            [name]: value,
          },
        },
      };
    });
  };

  const handlePriceIndicatorChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';
    
    if (name === 'indicator') {
      errorMessage = validateTypeCode(value);
    }
    
    setErrors((prev) => ({
      ...prev,
      [`priceIndicator_${name}`]: errorMessage
    }));

    setFormData((prev) => {
      const currentQB = prev.quantityBreakdown || defaultQuantityBreakdown;
      return {
        ...prev,
        quantityBreakdown: {
          ...currentQB,
          priceIndicator: {
            ...(currentQB.priceIndicator || defaultQuantityBreakdown.priceIndicator),
            [name]: value,
          },
        },
      };
    });
  };

  return (
    <div className="swift-form">
      <h2>Quantity Breakdown</h2>
      
      {/* Lot Number - Field 13B */}
      <div className="form-section">
        <h3>Lot Number (Field 13B)</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Qualifier:</label>
            <input
              type="text"
              name="qualifier"
              value={quantityBreakdown.lotNumber.qualifier}
              onChange={handleLotNumberChange}
              placeholder="Qualifier (4!c)"
              maxLength={4}
              readOnly
            />
            <small>Fixed value: LOTS</small>
          </div>

          <div className="field-container">
            <label>Scheme:</label>
            <input
              type="text"
              name="scheme"
              value={quantityBreakdown.lotNumber.scheme}
              onChange={handleLotNumberChange}
              placeholder="Scheme [8c]"
              maxLength={8}
            />
          </div>

          <div className="field-container">
            <label>Lot Number:</label>
            <input
              type="text"
              name="number"
              value={quantityBreakdown.lotNumber.number}
              onChange={handleLotNumberChange}
              placeholder="Lot Number (30x)"
              maxLength={30}
            />
            {errors.lotNumber_number && <span className="error">{errors.lotNumber_number}</span>}
          </div>
        </div>
      </div>
      
      {/* Quantity - Field 36a */}
      <div className="form-section">
        <h3>Quantity of Financial Instrument (Field 36a)</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Format Option:</label>
            <select
              name="option"
              value={quantityBreakdown.option}
              onChange={handleQuantityChange}
            >
              <option value="">Select option</option>
              {quantityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-container">
            <label>Qualifier:</label>
            <select
              name="qualifier"
              value={quantityBreakdown.qualifier}
              onChange={handleQuantityChange}
            >
              {qualifierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-container">
            <label>Type Code:</label>
            <input
              type="text"
              name="typeCode"
              value={quantityBreakdown.typeCode}
              onChange={handleQuantityChange}
              placeholder="Type Code (4!c)"
              maxLength={4}
            />
            {errors.typeCode && <span className="error">{errors.typeCode}</span>}
          </div>

          <div className="field-container">
            <label>Quantity Value:</label>
            <input
              type="text"
              name="value"
              value={quantityBreakdown.value}
              onChange={handleQuantityChange}
              placeholder={quantityBreakdown.option === 'D' ? "Quantity Value (30d)" : "Quantity Value (15d)"}
            />
            {errors.value && <span className="error">{errors.value}</span>}
          </div>
        </div>
      </div>
      
      {/* Date/Time - Field 98a */}
      <div className="form-section">
        <h3>Lot Date/Time (Field 98a)</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Format Option:</label>
            <select
              name="option"
              value={quantityBreakdown.dateTime.option}
              onChange={handleDateTimeChange}
            >
              {dateTimeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-container">
            <label>Qualifier:</label>
            <input
              type="text"
              name="qualifier"
              value={quantityBreakdown.dateTime.qualifier}
              onChange={handleDateTimeChange}
              placeholder="Qualifier (4!c)"
              maxLength={4}
              readOnly
            />
            <small>Fixed value: LOTS</small>
          </div>

          <div className="field-container">
            <label>Date:</label>
            <input
              type="text"
              name="date"
              value={quantityBreakdown.dateTime.date}
              onChange={handleDateTimeChange}
              placeholder="Date (YYYYMMDD)"
              maxLength={8}
            />
            {errors.dateTime_date && <span className="error">{errors.dateTime_date}</span>}
          </div>

          {(quantityBreakdown.dateTime.option === 'C' || quantityBreakdown.dateTime.option === 'E') && (
            <div className="field-container">
              <label>Time:</label>
              <input
                type="text"
                name="time"
                value={quantityBreakdown.dateTime.time}
                onChange={handleDateTimeChange}
                placeholder="Time (HHMMSS)"
                maxLength={6}
              />
              {errors.dateTime_time && <span className="error">{errors.dateTime_time}</span>}
            </div>
          )}

          {quantityBreakdown.dateTime.option === 'E' && (
            <>
              <div className="field-container">
                <label>Decimals:</label>
                <input
                  type="text"
                  name="decimals"
                  value={quantityBreakdown.dateTime.decimals}
                  onChange={handleDateTimeChange}
                  placeholder="Decimals (1-3 digits)"
                  maxLength={3}
                />
                {errors.dateTime_decimals && <span className="error">{errors.dateTime_decimals}</span>}
              </div>

              <div className="field-container">
                <label>UTC Indicator:</label>
                <input
                  type="text"
                  name="utcIndicator"
                  value={quantityBreakdown.dateTime.utcIndicator}
                  onChange={handleDateTimeChange}
                  placeholder="UTC Indicator ([N]2!n[2!n])"
                />
                {errors.dateTime_utcIndicator && <span className="error">{errors.dateTime_utcIndicator}</span>}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Price - Field 90a */}
      <div className="form-section">
        <h3>Book/Lot Price (Field 90a)</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Format Option:</label>
            <select
              name="option"
              value={quantityBreakdown.price.option}
              onChange={handlePriceChange}
            >
              {priceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-container">
            <label>Qualifier:</label>
            <input
              type="text"
              name="qualifier"
              value={quantityBreakdown.price.qualifier}
              onChange={handlePriceChange}
              placeholder="Qualifier (4!c)"
              maxLength={4}
              readOnly
            />
            <small>Fixed value: LOTS</small>
          </div>

          <div className="field-container">
            <label>Type Code:</label>
            <input
              type="text"
              name="typeCode"
              value={quantityBreakdown.price.typeCode}
              onChange={handlePriceChange}
              placeholder="Type Code (4!c)"
              maxLength={4}
            />
            {errors.price_typeCode && <span className="error">{errors.price_typeCode}</span>}
          </div>

          {quantityBreakdown.price.option === 'B' && (
            <div className="field-container">
              <label>Currency Code:</label>
              <input
                type="text"
                name="currency"
                value={quantityBreakdown.price.currency}
                onChange={handlePriceChange}
                placeholder="Currency (3!a)"
                maxLength={3}
              />
              {errors.price_currency && <span className="error">{errors.price_currency}</span>}
            </div>
          )}

          <div className="field-container">
            <label>Price:</label>
            <input
              type="text"
              name="price"
              value={quantityBreakdown.price.price}
              onChange={handlePriceChange}
              placeholder="Price (15d)"
            />
            {errors.price_price && <span className="error">{errors.price_price}</span>}
          </div>
        </div>
      </div>
      
      {/* Indicator - Field 22F */}
      <div className="form-section">
        <h3>Price Indicator (Field 22F)</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Qualifier:</label>
            <input
              type="text"
              name="qualifier"
              value={quantityBreakdown.priceIndicator.qualifier}
              onChange={handlePriceIndicatorChange}
              placeholder="Qualifier (4!c)"
              maxLength={4}
              readOnly
            />
            <small>Fixed value: PRIC</small>
          </div>

          <div className="field-container">
            <label>Scheme:</label>
            <input
              type="text"
              name="scheme"
              value={quantityBreakdown.priceIndicator.scheme}
              onChange={handlePriceIndicatorChange}
              placeholder="Scheme [8c]"
              maxLength={8}
            />
          </div>

          <div className="field-container">
            <label>Indicator:</label>
            <input
              type="text"
              name="indicator"
              value={quantityBreakdown.priceIndicator.indicator}
              onChange={handlePriceIndicatorChange}
              placeholder="Indicator (4!c)"
              maxLength={4}
            />
            {errors.priceIndicator_indicator && <span className="error">{errors.priceIndicator_indicator}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantityBreakdownForm;