import React, { useState } from 'react';

const SettlementDetailsSection = ({ formData, setFormData }) => {
  const [errors, setErrors] = useState({});

  // Validation Functions
  const validateSettlementIndicator = (value) =>
    /^[A-Z0-9]{4}(\/[A-Z0-9]{0,8})?\/[A-Z0-9]{4}$/.test(value)
      ? ""
      : "Invalid format: 4!c/[8c]/4!c";

  const validateParty = (party, reference, type = 'settlement') => {
    const formats = {
      C: /^[A-Z0-9]{4}\/\/[A-Z]{2}$/,
      L: /^[A-Z0-9]{4}\/\/[A-Z0-9]{18}[0-9]{2}$/,
      P: /^[A-Z0-9]{4}\/\/[A-Z]{4}[A-Z0-9]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
      Q: /^[A-Z0-9]{4}\/\/.{1,140}$/,
      R: /^[A-Z0-9]{4}\/[A-Z0-9]{8}\/.{1,34}$/,
      S: /^[A-Z0-9]{4}\/([A-Z0-9]{8}\/)?[A-Z0-9]{4}\/[A-Z]{2}\/.{1,30}$/,
    };

    if (!party) return "";
    if (!formats[party]) return `Invalid ${type} Party selection`;
    if (!reference) return "";
    if (!formats[party].test(reference))
      return `Invalid format for selected party (${party})`;

    return "";
  };

  const validateAccount = (accountType, value) => {
    const formats = {
      A: /^[A-Z0-9]{4}\/\/.{1,35}$/,
      B: /^[A-Z0-9]{4}\/[A-Z0-9]{8}\/[A-Z0-9]{4}\/.{1,35}$/,
      D: /^[A-Z0-9]{4}\/[A-Z0-9]{8}?\/.{1,140}$/,
      E: /^[A-Z0-9]{4}\/\/.{1,34}$/,
    };

    if (!accountType) return "";
    if (!formats[accountType]) return "Invalid Account Type selection";
    if (!value) return "";
    if (!formats[accountType].test(value))
      return `Invalid format for account type ${accountType}`;

    return "";
  };

  const validateDateTime = (format, value) => {
    const formats = {
      A: /^\d{8}$/,               // YYYYMMDD
      C: /^\d{8}\d{6}$/,          // YYYYMMDDHHmmss
    };

    if (!format) return "";
    if (!formats[format]) return "Invalid Date/Time format option";
    if (!value) return "";
    if (!formats[format].test(value))
      return `Invalid Date/Time format for option ${format}`;

    return "";
  };

  const validateNarrative = (format, value) => {
    const maxLengths = {
      C: 140,  // 4*35x
      D: 210,  // 6*35x
      E: 350,  // 10*35x
    };

    if (!format) return "";
    if (!maxLengths[format]) return "Invalid Narrative format option";
    if (!value) return "";
    if (value.length > maxLengths[format])
      return `Narrative too long (max ${maxLengths[format]} chars for format ${format})`;

    return "";
  };

  const validateReference = (value) =>
    !value || /^[A-Z0-9]{4}\/\/.{1,16}$/.test(value)
      ? ""
      : "Invalid Processing Reference format (4!c//16x)";

  const validateFlag = (value) =>
    !value || /^[A-Z0-9]{4}\/\/[YN]$/.test(value)
      ? ""
      : "Invalid Flag format (4!c//1!a)";

  const validateAmount = (qualifier, amount, currency) => {
    if (!qualifier) return "";
    if (!amount) return "Amount is required when qualifier is specified";
    if (!/^\d{1,15}(\.\d{1,2})?$/.test(amount))
      return "Invalid Amount format (Max 15 digits, 2 decimals)";
    if (!currency || !/^[A-Z]{3}$/.test(currency))
      return "Valid Currency Code (ISO 4217 format) is required";
    return "";
  };

  const validateExchangeRate = (value) =>
    !value || /^[A-Z0-9]{4}\/\/[A-Z]{3}\/[A-Z]{3}\/\d{1,15}(\.\d{1,10})?$/.test(value)
      ? ""
      : "Invalid Exchange Rate format (4!c//3!a/3!a/15d)";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Extract field parts
    const fieldParts = name.match(/([a-zA-Z]+)(\d*)([a-zA-Z]*)(\d*)/);
    if (!fieldParts) return;

    const fieldBase = fieldParts[1];
    const section = fieldParts[2] || '';
    const subType = fieldParts[3] || '';
    const index = fieldParts[4] || '';

    // Perform validation based on field type
    switch (fieldBase) {
      case "settlementIndicator":
        error = validateSettlementIndicator(value);
        break;
      case "party":
        if (section === "1") {
          // Settlement Parties
          error = validateParty(
            formData[`partyFormat${section}`] || '',
            value,
            'settlement'
          );
        } else if (section === "2") {
          // Cash Parties
          error = validateParty(
            formData[`partyFormat${section}`] || '',
            value,
            'cash'
          );
        } else if (section === "3") {
          // Other Parties
          error = validateParty(
            formData[`partyFormat${section}`] || '',
            value,
            'other'
          );
        }
        break;
      case "partyFormat":
        // When format changes, validate the existing reference
        if (section === "1") {
          error = validateParty(
            value,
            formData[`party${section}`] || '',
            'settlement'
          );
        } else if (section === "2") {
          error = validateParty(
            value,
            formData[`party${section}`] || '',
            'cash'
          );
        } else if (section === "3") {
          error = validateParty(
            value,
            formData[`party${section}`] || '',
            'other'
          );
        }
        break;
      case "account":
        error = validateAccount(
          formData[`accountFormat${section}`] || '',
          value
        );
        break;
      case "dateTime":
        error = validateDateTime(
          formData[`dateTimeFormat${section}`] || '',
          value
        );
        break;
      case "narrative":
        error = validateNarrative(
          formData[`narrativeFormat${section}`] || '',
          value
        );
        break;
      case "processingReference":
        error = validateReference(value);
        break;
      case "flag":
        error = validateFlag(value);
        break;
      case "amount":
        error = validateAmount(
          formData[`amountQualifier${section}`] || '',
          value,
          formData[`currency${section}`] || ''
        );
        break;
      case "currency":
        error = validateAmount(
          formData[`amountQualifier${section}`] || '',
          formData[`amount${section}`] || '',
          value
        );
        break;
      case "exchangeRate":
        error = validateExchangeRate(value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const renderError = (fieldName) => {
    return errors[fieldName] ? (
      <span className="error">{errors[fieldName]}</span>
    ) : null;
  };

  return (
    <div className="swift-form">
      <h2>Settlement Details</h2>

      {/* Settlement Indicator */}
      <div className="form-section">
        <h3>Sequence E: Settlement Details</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Settlement Indicator *:</label>
            <input
              type="text"
              name="settlementIndicator"
              value={formData.settlementIndicator || ''}
              onChange={handleInputChange}
              placeholder=":4!c/[8c]/4!c"
              required
            />
            {renderError("settlementIndicator")}
          </div>
        </div>
      </div>

      {/* Settlement Parties */}
      <div className="form-section">
        <h3>Subsequence E1: Settlement Parties</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Party Qualifier *:</label>
            <select
              name="partyQualifier1"
              value={formData.partyQualifier1 || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="BUYR">BUYR - Buyer</option>
              <option value="DEAG">DEAG - Delivering Agent</option>
              <option value="DECU">DECU - Deliverer's Custodian</option>
              <option value="DEI1">DEI1 - Deliverer's Intermediary 1</option>
              <option value="DEI2">DEI2 - Deliverer's Intermediary 2</option>
              <option value="PSET">PSET - Place of Settlement</option>
              <option value="REAG">REAG - Receiving Agent</option>
              <option value="RECU">RECU - Receiver's Custodian</option>
              <option value="REI1">REI1 - Receiver's Intermediary 1</option>
              <option value="REI2">REI2 - Receiver's Intermediary 2</option>
              <option value="SELL">SELL - Seller</option>
              <option value="ALTE">ALTE - Alternate Identification</option>
            </select>
          </div>

          <div className="field-container">
            <label>Party Format *:</label>
            <select
              name="partyFormat1"
              value={formData.partyFormat1 || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="C">C - Country Code</option>
              <option value="L">L - Legal Entity Identifier</option>
              <option value="P">P - Identifier Code</option>
              <option value="Q">Q - Name and Address</option>
              <option value="R">R - Proprietary Code</option>
              <option value="S">S - Alternate ID</option>
            </select>
          </div>

          <div className="field-container">
            <label>Party Identification *:</label>
            <input
              type="text"
              name="party1"
              value={formData.party1 || ''}
              onChange={handleInputChange}
              required
            />
            {renderError("party1")}
          </div>
        </div>

        <div className="form-grid">
          <div className="field-container">
            <label>Account Type:</label>
            <select
              name="accountFormat1"
              value={formData.accountFormat1 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="A">A - Account Number</option>
              <option value="B">B - Account Type Code</option>
              <option value="D">D - Blockchain Address or Wallet</option>
            </select>
          </div>

          <div className="field-container">
            <label>Account:</label>
            <input
              type="text"
              name="account1"
              value={formData.account1 || ''}
              onChange={handleInputChange}
            />
            {renderError("account1")}
          </div>
        </div>

        <div className="form-grid">
          <div className="field-container">
            <label>Processing Date/Time Format:</label>
            <select
              name="dateTimeFormat1"
              value={formData.dateTimeFormat1 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="A">A - Date Only (YYYYMMDD)</option>
              <option value="C">C - Date and Time (YYYYMMDDHHmmss)</option>
            </select>
          </div>

          <div className="field-container">
            <label>Processing Date/Time:</label>
            <input
              type="text"
              name="dateTime1"
              value={formData.dateTime1 || ''}
              onChange={handleInputChange}
              placeholder={formData.dateTimeFormat1 === 'A' ? 'YYYYMMDD' : 'YYYYMMDDHHmmss'}
            />
            {renderError("dateTime1")}
          </div>
        </div>

        <div className="form-grid">
          <div className="field-container">
            <label>Processing Reference:</label>
            <input
              type="text"
              name="processingReference1"
              value={formData.processingReference1 || ''}
              onChange={handleInputChange}
              placeholder="4!c//16x"
            />
            {renderError("processingReference1")}
          </div>
        </div>

        <div className="form-grid">
          <div className="field-container">
            <label>Narrative Format:</label>
            <select
              name="narrativeFormat1"
              value={formData.narrativeFormat1 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="C">C - 4*35x</option>
              <option value="D">D - 6*35x</option>
              <option value="E">E - 10*35x</option>
            </select>
          </div>

          <div className="field-container">
            <label>Narrative Type:</label>
            <select
              name="narrativeType1"
              value={formData.narrativeType1 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="DECL">DECL - Declaration Details</option>
              <option value="REGI">REGI - Registration Details</option>
              <option value="PACO">PACO - Party Narrative</option>
            </select>
          </div>

          <div className="field-container">
            <label>Narrative:</label>
            <textarea
              name="narrative1"
              value={formData.narrative1 || ''}
              onChange={handleInputChange}
              rows="3"
            />
            {renderError("narrative1")}
          </div>
        </div>
      </div>

      {/* Cash Parties */}
      <div className="form-section">
        <h3>Subsequence E2: Cash Parties</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Cash Party Qualifier *:</label>
            <select
              name="partyQualifier2"
              value={formData.partyQualifier2 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="ACCW">ACCW - Account With Institution</option>
              <option value="BENM">BENM - Beneficiary of Money</option>
              <option value="DEBT">DEBT - Debtor</option>
              <option value="INTM">INTM - Intermediary</option>
              <option value="PAYE">PAYE - Paying Institution</option>
              <option value="ALTE">ALTE - Alternate Identification</option>
            </select>
          </div>

          <div className="field-container">
            <label>Cash Party Format *:</label>
            <select
              name="partyFormat2"
              value={formData.partyFormat2 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="L">L - Legal Entity Identifier</option>
              <option value="P">P - Identifier Code</option>
              <option value="Q">Q - Name and Address</option>
              <option value="R">R - Proprietary Code</option>
              <option value="S">S - Alternate ID</option>
            </select>
          </div>

          <div className="field-container">
            <label>Cash Party Identification:</label>
            <input
              type="text"
              name="party2"
              value={formData.party2 || ''}
              onChange={handleInputChange}
            />
            {renderError("party2")}
          </div>
        </div>

        <div className="form-grid">
          <div className="field-container">
            <label>Cash Account Type:</label>
            <select
              name="accountFormat2"
              value={formData.accountFormat2 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="A">A - Account Number</option>
              <option value="E">E - International Bank Account Number</option>
            </select>
          </div>

          <div className="field-container">
            <label>Cash Account:</label>
            <input
              type="text"
              name="account2"
              value={formData.account2 || ''}
              onChange={handleInputChange}
            />
            {renderError("account2")}
          </div>

          <div className="field-container">
            <label>Cash Account Purpose:</label>
            <select
              name="accountPurpose2"
              value={formData.accountPurpose2 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="CASH">CASH - Cash Account</option>
              <option value="CHAR">CHAR - Charges Account</option>
              <option value="COMM">COMM - Commission Account</option>
              <option value="TAXE">TAXE - Tax Account</option>
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="field-container">
            <label>Cash Narrative Format:</label>
            <select
              name="narrativeFormat2"
              value={formData.narrativeFormat2 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="C">C - 4*35x</option>
              <option value="E">E - 10*35x</option>
            </select>
          </div>

          <div className="field-container">
            <label>Cash Narrative Type:</label>
            <select
              name="narrativeType2"
              value={formData.narrativeType2 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="DECL">DECL - Declaration Details</option>
              <option value="PACO">PACO - Party Narrative</option>
            </select>
          </div>

          <div className="field-container">
            <label>Cash Narrative:</label>
            <textarea
              name="narrative2"
              value={formData.narrative2 || ''}
              onChange={handleInputChange}
              rows="3"
            />
            {renderError("narrative2")}
          </div>
        </div>
      </div>

      {/* Amounts */}
      <div className="form-section">
        <h3>Subsequence E3: Amounts</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Flag:</label>
            <input
              type="text"
              name="flag"
              value={formData.flag || ''}
              onChange={handleInputChange}
              placeholder=":4!c//1!a"
            />
            {renderError("flag")}
          </div>
        </div>

        <div className="form-grid">
          <div className="field-container">
            <label>Amount Qualifier *:</label>
            <input
              type="text"
              name="amountQualifier1"
              value={formData.amountQualifier1 || ''}
              onChange={handleInputChange}
              placeholder="4!c"
              required
            />
          </div>

          <div className="field-container">
            <label>Amount *:</label>
            <input
              type="text"
              name="amount1"
              value={formData.amount1 || ''}
              onChange={handleInputChange}
              required
            />
            {renderError("amount1")}
          </div>

          <div className="field-container">
            <label>Currency *:</label>
            <input
              type="text"
              name="currency1"
              value={formData.currency1 || ''}
              onChange={handleInputChange}
              placeholder="3!a"
              required
            />
            {renderError("currency1")}
          </div>
        </div>

        <div className="form-grid">
          <div className="field-container">
            <label>Value Date/Time Format:</label>
            <select
              name="dateTimeFormat3"
              value={formData.dateTimeFormat3 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="A">A - Date Only (YYYYMMDD)</option>
              <option value="C">C - Date and Time (YYYYMMDDHHmmss)</option>
            </select>
          </div>

          <div className="field-container">
            <label>Value Date/Time:</label>
            <input
              type="text"
              name="dateTime3"
              value={formData.dateTime3 || ''}
              onChange={handleInputChange}
              placeholder={formData.dateTimeFormat3 === 'A' ? 'YYYYMMDD' : 'YYYYMMDDHHmmss'}
            />
            {renderError("dateTime3")}
          </div>
        </div>

        <div className="form-grid">
          <div className="field-container">
            <label>Exchange Rate:</label>
            <input
              type="text"
              name="exchangeRate"
              value={formData.exchangeRate || ''}
              onChange={handleInputChange}
              placeholder=":4!c//3!a/3!a/15d"
            />
            {renderError("exchangeRate")}
          </div>
        </div>
      </div>

      {/* Other Parties */}
      <div className="form-section">
        <h3>Sequence F: Other Parties</h3>
        <div className="form-grid">
          <div className="field-container">
            <label>Other Party Qualifier:</label>
            <select
              name="partyQualifier3"
              value={formData.partyQualifier3 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="ACCW">ACCW - Account With Institution</option>
              <option value="BENM">BENM - Beneficiary of Money</option>
              <option value="DEBT">DEBT - Debtor</option>
              <option value="INTM">INTM - Intermediary</option>
              <option value="PAYE">PAYE - Paying Institution</option>
              <option value="ALTE">ALTE - Alternate Identification</option>
            </select>
          </div>

          <div className="field-container">
            <label>Other Party Format:</label>
            <select
              name="partyFormat3"
              value={formData.partyFormat3 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="C">C - Country Code</option>
              <option value="L">L - Legal Entity Identifier</option>
              <option value="P">P - Identifier Code</option>
              <option value="Q">Q - Name and Address</option>
              <option value="R">R - Proprietary Code</option>
              <option value="S">S - Alternate ID</option>
            </select>
          </div>

          <div className="field-container">
            <label>Other Party Identification:</label>
            <input
              type="text"
              name="party3"
              value={formData.party3 || ''}
              onChange={handleInputChange}
            />
            {renderError("party3")}
          </div>
        </div>

        <div className="form-grid">
          <div className="field-container">
            <label>Other Account Type:</label>
            <select
              name="accountFormat3"
              value={formData.accountFormat3 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="A">A - Account Number</option>
              <option value="D">D - Blockchain Address or Wallet</option>
            </select>
          </div>

          <div className="field-container">
            <label>Other Account:</label>
            <input
              type="text"
              name="account3"
              value={formData.account3 || ''}
              onChange={handleInputChange}
            />
            {renderError("account3")}
          </div>
        </div>

        <div className="form-grid">
          <div className="field-container">
            <label>Other Narrative Format:</label>
            <select
              name="narrativeFormat3"
              value={formData.narrativeFormat3 || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="C">C - 4*35x</option>
              <option value="D">D - 6*35x</option>
              <option value="E">E - 10*35x</option>
            </select>
          </div>

          <div className="field-container">
            <label>Other Narrative:</label>
            <textarea
              name="narrative3"
              value={formData.narrative3 || ''}
              onChange={handleInputChange}
              rows="3"
            />
            {renderError("narrative3")}
          </div>
        </div>

        <div className="form-grid">
          <div className="field-container">
            <label>Other Processing Reference:</label>
            <input
              type="text"
              name="processingReference3"
              value={formData.processingReference3 || ''}
              onChange={handleInputChange}
              placeholder="4!c//16x"
            />
            {renderError("processingReference3")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementDetailsSection;