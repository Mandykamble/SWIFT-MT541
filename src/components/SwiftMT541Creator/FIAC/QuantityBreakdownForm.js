import React, { useState } from 'react';

const QuantityBreakdownForm = () => {
  const [formData, setFormData] = useState({
    startBlock: 'BREAK',
    lotNumber: {
      qualifier: 'LOTS',
      dataSource: '',
      value: ''
    },
    quantity: {
      option: '',
      qualifier: 'LOTS',
      typeCode: '',
      value: ''
    },
    dateTime: {
      option: '',
      qualifier: 'LOTS',
      date: '',
      time: '',
      decimals: '',
      utcIndicator: ''
    },
    price: {
      option: '',
      qualifier: 'LOTS',
      typeCode: '',
      currency: '',
      value: ''
    },
    priceIndicator: {
      qualifier: 'PRIC',
      dataSource: '',
      value: ''
    },
    endBlock: 'BREAK'
  });

  const [errors, setErrors] = useState({});

  // Validation Functions
  const validateLotNumber = (value) => {
    return /^[A-Z0-9]{1,30}$/.test(value)
      ? ''
      : 'Lot number must be up to 30 alphanumeric characters';
  };

  const validateQuantityB = (typeCode, value) => {
    if (!/^[A-Z]{4}$/.test(typeCode)) {
      return 'Type code must be 4 uppercase letters';
    }
    return /^\d{1,15}(\.\d{0,2})?$/.test(value)
      ? ''
      : 'Invalid quantity format for option B';
  };

  const validateQuantityD = (typeCode, value) => {
    if (!/^[A-Z]{4}$/.test(typeCode)) {
      return 'Type code must be 4 uppercase letters';
    }
    return /^\d{1,30}(\.\d{0,2})?$/.test(value)
      ? ''
      : 'Invalid quantity format for option D';
  };

  const validateDateTime = (option, date, time, decimals, utc) => {
    const dateRegex = /^\d{8}$/;
    const timeRegex = /^\d{6}$/;
    
    if (!dateRegex.test(date)) {
      return 'Date must be in format YYYYMMDD';
    }

    switch (option) {
      case 'A':
        return dateRegex.test(date) ? '' : 'Invalid date format';
      case 'C':
        return dateRegex.test(date) && timeRegex.test(time) ? '' : 'Invalid date/time format';
      case 'E':
        if (!dateRegex.test(date) || !timeRegex.test(time)) return 'Invalid date/time format';
        if (decimals && !/^\d{1,3}$/.test(decimals)) return 'Invalid decimals';
        if (utc && !/^[N]?[0-2][0-4]([0-5][0-9])?$/.test(utc)) return 'Invalid UTC indicator';
        return '';
      default:
        return 'Invalid option';
    }
  };

  const validatePrice = (option, typeCode, value, currency) => {
    if (!/^[A-Z]{4}$/.test(typeCode)) {
      return 'Type code must be 4 uppercase letters';
    }

    switch (option) {
      case 'A':
        return /^[N]?\d{1,15}(\.\d+)?$/.test(value) ? '' : 'Invalid price format for option A';
      case 'B':
        if (!/^[A-Z]{3}$/.test(currency)) return 'Invalid currency code';
        return /^\d{1,15}(\.\d+)?$/.test(value) ? '' : 'Invalid price format for option B';
      default:
        return 'Invalid option';
    }
  };

  const validatePriceIndicator = (value) => {
    return /^[A-Z]{4}$/.test(value)
      ? ''
      : 'Price indicator must be 4 uppercase letters';
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
          current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
      }
      
      return updatedData;
    });

    // Validate based on field
    if (name === 'lotNumber.value') {
      error = validateLotNumber(value);
    } else if (name === 'quantity.value') {
      error = formData.quantity.option === 'B'
        ? validateQuantityB(formData.quantity.typeCode, value)
        : validateQuantityD(formData.quantity.typeCode, value);
    } else if (name.startsWith('dateTime.')) {
      error = validateDateTime(
        formData.dateTime.option,
        formData.dateTime.date,
        formData.dateTime.time,
        formData.dateTime.decimals,
        formData.dateTime.utcIndicator
      );
    } else if (name.startsWith('price.')) {
      error = validatePrice(
        formData.price.option,
        formData.price.typeCode,
        formData.price.value,
        formData.price.currency
      );
    } else if (name === 'priceIndicator.value') {
      error = validatePriceIndicator(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  return (

    
    <div className="form-section">

    <h2>Quantity Breakdown</h2>

        

      {/* Lot Number */}
      <div className="form-group">
        <label>Lot Number (13B)</label>
        <input
          type="text"
          name="lotNumber.value"
          value={formData.lotNumber.value}
          onChange={handleInputChange}
          placeholder="Enter lot number"
        />
        {errors['lotNumber.value'] && (
          <span className="error">{errors['lotNumber.value']}</span>
        )}
      </div>

      {/* Quantity */}
      <div className="form-group">
        <label>Quantity (36a)</label>
        <select
          name="quantity.option"
          value={formData.quantity.option}
          onChange={handleInputChange}
        >
          <option value="">Select option</option>
          <option value="B">Option B (Standard Quantity)</option>
          <option value="D">Option D (Digital Tokens)</option>
        </select>

        {formData.quantity.option && (
          <div className="nested-fields">
            <input
              type="text"
              name="quantity.typeCode"
              value={formData.quantity.typeCode}
              onChange={handleInputChange}
              placeholder="Type Code (4!c)"
            />
            <input
              type="text"
              name="quantity.value"
              value={formData.quantity.value}
              onChange={handleInputChange}
              placeholder="Enter quantity"
            />
            {errors['quantity.value'] && (
              <span className="error">{errors['quantity.value']}</span>
            )}
          </div>
        )}
      </div>

      {/* Date/Time */}
      <div className="form-group">
        <label>Date/Time (98a)</label>
        <select
          name="dateTime.option"
          value={formData.dateTime.option}
          onChange={handleInputChange}
        >
          <option value="">Select option</option>
          <option value="A">Option A (Date only)</option>
          <option value="C">Option C (Date and Time)</option>
          <option value="E">Option E (Date, Time, and UTC)</option>
        </select>

        {formData.dateTime.option && (
          <div className="nested-fields">
            <input
              type="text"
              name="dateTime.date"
              value={formData.dateTime.date}
              onChange={handleInputChange}
              placeholder="Date (YYYYMMDD)"
            />
            {(formData.dateTime.option === 'C' || formData.dateTime.option === 'E') && (
              <input
                type="text"
                name="dateTime.time"
                value={formData.dateTime.time}
                onChange={handleInputChange}
                placeholder="Time (HHMMSS)"
              />
            )}
            {formData.dateTime.option === 'E' && (
              <>
                <input
                  type="text"
                  name="dateTime.decimals"
                  value={formData.dateTime.decimals}
                  onChange={handleInputChange}
                  placeholder="Decimals (optional)"
                />
                <input
                  type="text"
                  name="dateTime.utcIndicator"
                  value={formData.dateTime.utcIndicator}
                  onChange={handleInputChange}
                  placeholder="UTC Indicator"
                />
              </>
            )}
            {errors['dateTime.date'] && (
              <span className="error">{errors['dateTime.date']}</span>
            )}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="form-group">
        <label>Price (90a)</label>
        <select
          name="price.option"
          value={formData.price.option}
          onChange={handleInputChange}
        >
          <option value="">Select option</option>
          <option value="A">Option A (Percentage)</option>
          <option value="B">Option B (Amount)</option>
        </select>

        {formData.price.option && (
          <div className="nested-fields">
            <input
              type="text"
              name="price.typeCode"
              value={formData.price.typeCode}
              onChange={handleInputChange}
              placeholder="Type Code (4!c)"
            />
            {formData.price.option === 'B' && (
              <input
                type="text"
                name="price.currency"
                value={formData.price.currency}
                onChange={handleInputChange}
                placeholder="Currency Code (3!a)"
              />
            )}
            <input
              type="text"
              name="price.value"
              value={formData.price.value}
              onChange={handleInputChange}
              placeholder="Enter price"
            />
            {errors['price.value'] && (
              <span className="error">{errors['price.value']}</span>
            )}
          </div>
        )}
      </div>

      {/* Price Indicator */}
      <div className="form-group">
        <label>Price Indicator (22F)</label>
        <input
          type="text"
          name="priceIndicator.value"
          value={formData.priceIndicator.value}
          onChange={handleInputChange}
          placeholder="Enter price indicator (4!c)"
        />
        {errors['priceIndicator.value'] && (
          <span className="error">{errors['priceIndicator.value']}</span>
        )}
      </div>

      
    </div>
  );
};

export default QuantityBreakdownForm;