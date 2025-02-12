import React, { useState } from "react";

const SettlementDetailsSection = () => {
  const [formData, setFormData] = useState({
    settlementIndicator: "",
    settlementParty: "",
    processingReference: "",
    settlementAccount: "",
    cashParty: "",
    cashAccount: "",
    cashNarrative: "",
    amountQualifier: "",
    amount: "",
    amountCurrency: "",
    otherParty: "",
    otherProcessingReference: "",
  });

  const [showSettlementParties, setShowSettlementParties] = useState(false);
  const [showCashParties, setShowCashParties] = useState(false);
  const [showAmounts, setShowAmounts] = useState(false);
  const [showOtherParties, setShowOtherParties] = useState(false);
  const [errors, setErrors] = useState({});

  // 🛑 Validation Functions
  const validateSettlementIndicator = (value) =>
    /^[A-Z0-9]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}$/.test(value)
      ? ""
      : "Invalid format: 4!c/[8c]/4!c";

  const validateSettlementParties = (party, reference) => {
    const formats = {
      C: /^[A-Z0-9]{4}\/\/[A-Z]{2}$/, // C: Country Code
      L: /^[A-Z0-9]{4}\/\/[A-Z0-9]{18}[0-9]{2}$/, // L: LEI
      P: /^[A-Z0-9]{4}\/\/[A-Z]{4}[A-Z0-9]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/, // P: Identifier Code
      Q: /^[A-Z0-9]{4}\/\/.{1,140}$/, // Q: Name & Address
      R: /^[A-Z0-9]{4}\/[A-Z0-9]{8}\/.{1,34}$/, // R: Proprietary Code
      S: /^[A-Z0-9]{4}\/[A-Z0-9]{8}\/[A-Z]{2}\/.{1,30}$/, // S: Alternate ID
    };

    if (!party) return "";
    if (!formats[party]) return "Invalid Settlement Party selection";
    if (!formats[party].test(reference))
      return `Invalid format for selected party (${party})`;

    return "";
  };

  const validateCashParties = (party) => {
    return ["L", "P"].includes(party)
      ? ""
      : "Invalid Cash Party (Allowed: L, P)";
  };

  const validateAmounts = (qualifier, amount, currency) => {
    if (!qualifier) return "Amount Qualifier is required";
    if (!["ACRU", "DEAL", "SETT"].includes(qualifier))
      return "Invalid Qualifier (Allowed: ACRU, DEAL, SETT)";
    if (!/^\d{1,15}(\.\d{1,2})?$/.test(amount))
      return "Invalid Amount format (Max 15 digits, 2 decimals)";
    if (!/^[A-Z]{3}$/.test(currency))
      return "Invalid Currency Code (ISO 4217 format required)";
    return "";
  };

  const validateOtherProcessingReference = (value) => {
    return /^[A-Z0-9]{4}\/\/.{1,16}$/.test(value)
      ? ""
      : "Invalid Other Processing Reference format (4!c//16x)";
  };

  // 🛠 Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    switch (name) {
      case "settlementIndicator":
        error = validateSettlementIndicator(value);
        break;
      case "settlementParty":
        error = validateSettlementParties(value, formData.processingReference);
        break;
      case "cashParty":
        error = validateCashParties(value);
        break;
      case "amountQualifier":
      case "amount":
      case "amountCurrency":
        error = validateAmounts(
          formData.amountQualifier,
          formData.amount,
          formData.amountCurrency
        );
        break;
      case "otherProcessingReference":
        error = validateOtherProcessingReference(value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  return (
    <div className="form-section">
      <h2>Settlement Details</h2>

      {/* Settlement Indicator */}
      <div className="form-group">
        <label>Settlement Indicator *:</label>
        <input
          type="text"
          name="settlementIndicator"
          value={formData.settlementIndicator}
          onChange={handleInputChange}
          required
        />
        {errors.settlementIndicator && (
          <span className="error">{errors.settlementIndicator}</span>
        )}
      </div>

      {/* Settlement Parties */}
      <div className="form-section">
        <label>
          <input
            type="checkbox"
            checked={showSettlementParties}
            onChange={() => setShowSettlementParties(!showSettlementParties)}
          />
          Include Settlement Parties
        </label>
        {showSettlementParties && (
          <div className="form-group">
            <label>Settlement Party:</label>
            <select
              name="settlementParty"
              value={formData.settlementParty}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              {["C", "L", "P", "Q", "R", "S"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <label>Processing Reference:</label>
            <input
              type="text"
              name="processingReference"
              value={formData.processingReference}
              onChange={handleInputChange}
            />
            {errors.settlementParty && (
              <span className="error">{errors.settlementParty}</span>
            )}
          </div>
        )}
      </div>

      {/* Cash Parties */}
      <div className="form-section">
        <label>
          <input
            type="checkbox"
            checked={showCashParties}
            onChange={() => setShowCashParties(!showCashParties)}
          />
          Include Cash Parties
        </label>
        {showCashParties && (
          <div className="form-group">
            <label>Cash Party:</label>
            <select
              name="cashParty"
              value={formData.cashParty}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="L">L</option>
              <option value="P">P</option>
            </select>
            {errors.cashParty && (
              <span className="error">{errors.cashParty}</span>
            )}
          </div>
        )}
      </div>

      {/* Amounts */}
      <div className="form-section">
        <label>
          <input
            type="checkbox"
            checked={showAmounts}
            onChange={() => setShowAmounts(!showAmounts)}
          />
          Include Amounts
        </label>
        {showAmounts && (
          <div className="form-group">
            <label>Amount Qualifier:</label>
            <input
              type="text"
              name="amountQualifier"
              value={formData.amountQualifier}
              onChange={handleInputChange}
            />
            {errors.amountQualifier && (
              <span className="error">{errors.amountQualifier}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettlementDetailsSection;
