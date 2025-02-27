import React from "react";

const GeneralInformationSection = ({ formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="swift-form">
      <h2>General Information</h2>

      {/* Form Grid */}
      <div className="form-grid">
        {/* Function of the Message */}
        <div className="field-container">
          <label>Function of the Message *</label>
          <input
            type="text"
            name="functionOfMessage"
            value={formData.functionOfMessage}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Preparation Date/Time Option */}
        <div className="field-container">
          <label>Preparation Date/Time </label>
          <select
            name="prepDateTimeOption"
            value={formData.prepDateTimeOption}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="A">Option A - YYYYMMDD</option>
            <option value="C">Option C - YYYYMMDDHHMMSS</option>
            <option value="E">Option E - Extended Format</option>
          </select>
        </div>

        {/* Preparation Date/Time Value */}
        <div className="field-container">
          <label>Preparation Date/Time Value</label>
          <input
            type="text"
            name="prepDateTimeValue"
            value={formData.prepDateTimeValue}
            onChange={handleInputChange}
            placeholder="Enter date/time"
          />
        </div>

        {/* Number Count Option */}
        <div className="field-container">
          <label>Number Count Option</label>
          <select
            name="numberCountOption"
            value={formData.numberCountOption}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="B">Option B - 3 Digits</option>
            <option value="C">Option C - 6 Digits</option>
          </select>
        </div>

        {/* Number Count Qualifier */}
        <div className="field-container">
          <label>Number Count Qualifier</label>
          {formData.numberCountOption ? (
            <select 
              name="numberCountQualifier" 
              value={formData.numberCountQualifier} 
              onChange={handleInputChange}
            >
              <option value="">Select Qualifier</option>
              <option value="SETT">SETT - Current Settlement Instruction Number</option>
              <option value="TOSE">TOSE - Total Linked Settlement Instructions</option>
            </select>
          ) : (
            <select disabled>
              <option value="">Select Option First</option>
            </select>
          )}
        </div>

        {/* Number Count Value */}
        <div className="field-container">
          <label>Number Count Value</label>
          <input
            type="text"
            name="numberCountValue"
            value={formData.numberCountValue}
            onChange={handleInputChange}
            placeholder={formData.numberCountOption === "B" ? "Enter 3 digits" : "Enter 6 digits"}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInformationSection;