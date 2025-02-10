import React, { useState } from 'react';
import './SwiftForm.css';
import Navbar from './Navbar/Navbar'

const SwiftMT541Creator = () => {
  // State for form data
  const [formData, setFormData] = useState({
    // General Information (Sequence A)
    senderReference: '',
    functionOfMessage: '',
    prepDateTime: '',
    numberCount: '',
    // Linkages (Subsequence A1)
    linkIndicator: '',
    linkedMessage: '',
    linkedReference: '',
    linkageQuantity: '',
    // Trade Details (Sequence B)
    place: '',
    tradeDateTime: '',
    dealPrice: '',
    daysAccrued: '',
    isin: '',
    // Financial Instrument Attributes (Subsequence B1)
    placeOfListing: '',
    financialInstrumentIndicator: '',
    typeOfFinancialInstrument: '',
    currencyOfDenomination: '',
    financialInstrumentDate: '',
    rate: '',
    certificateNumber: '',
    flag: '',
    price: '',
    financialInstrumentQuantity: '',
    financialInstrumentNarrative: '',
    // Financial Instrument/Account (Sequence C)
    settlementQuantity: '',
    denominationNarrative: '',
    certificateIdentification: '',
    party: '',
    account: '',
    placeOfSafekeeping: '',
    // Quantity Breakdown (Subsequence C1)
    lotNumber: '',
    lotQuantity: '',
    lotDateTime: '',
    lotPrice: '',
    priceIndicator: '',
    // Two Leg Transaction Details (Sequence D)
    repoDateTime: '',
    repoIndicator: '',
    repoReference: '',
    repoRate: '',
    repoNumberCount: '',
    repoAmount: '',
    secondLegNarrative: '',
    // Settlement Details (Sequence E)
    settlementIndicator: '',
    // Settlement Parties (Subsequence E1)
    settlementParty: '',
    settlementAccount: '',
    processingDateTime: '',
    processingReference: '',
    settlementNarrative: '',
    // Cash Parties (Subsequence E2)
    cashParty: '',
    cashAccount: '',
    cashNarrative: '',
    // Amounts (Subsequence E3)
    amountFlag: '',
    amount: '',
    valueDateTime: '',
    exchangeRate: '',
    // Other Parties (Sequence F)
    otherParty: '',
    otherAccount: '',
    otherNarrative: '',
    otherProcessingReference: '',
    numberCountOption: '',
    numberCountValue: '',
    numberCountQualifier: '',
    linkIndicator: '',
  linkedMessageOption: '',
  linkedMessageQualifier: '',
  linkedMessageDataSource: '',
  linkedMessageNumber: '',
  linkedReferenceOption: '',
  linkedReferenceQualifier: '',
  linkedReferenceValue: '',
  linkageQuantityOption: '',
  linkageQuantityQualifier: '',
  linkageQuantityType: '',
  linkageQuantityValue: '',
  });

  // State for errors
  const [errors, setErrors] = useState({});
  const [numberInput, setNumberInput] = useState('');

  // State for message output
  const [messageOutput, setMessageOutput] = useState('');

  // State for toggling sections
  const [showLinkages, setShowLinkages] = useState(false);
  const [showFinancialInstrumentAttributes, setShowFinancialInstrumentAttributes] = useState(false);
  const [showQuantityBreakdown, setShowQuantityBreakdown] = useState(false);
  const [showTwoLegTransaction, setShowTwoLegTransaction] = useState(false);
  const [showSettlementParties, setShowSettlementParties] = useState(false);
  const [showCashParties, setShowCashParties] = useState(false);
  const [showAmounts, setShowAmounts] = useState(false);
  const [showOtherParties, setShowOtherParties] = useState(false);
  const [dateTimeInput, setDateTimeInput] = useState('');
  const qualifiers = {
    SETT: 'Current Settlement Instruction Number',
    TOSE: 'Total of Linked Settlement Instructions'
  };
// Add this validation function
const validateDateTime = (option, value) => {
  if (!value) return 'This field is required';
  
  const dateRegex = /^\d{8}$/;  // YYYYMMDD
  const dateTimeRegex = /^\d{14}$/;  // YYYYMMDDHHMMSS
  const extendedRegex = /^\d{14}(,\d{3})?(\/[N]?\d{2}(\d{2})?)?$/;  // YYYYMMDDHHMMSS[,3n][/[N]2!n[2!n]]
  
  let isValid = false;
  
  switch (option) {
    case 'A':
      isValid = dateRegex.test(value);
      break;
    case 'C':
      isValid = dateTimeRegex.test(value);
      break;
    case 'E':
      isValid = extendedRegex.test(value);
      break;
    default:
      return 'Invalid option selected';
  }
  
  if (!isValid) {
    return `Invalid format for option ${option}`;
  }
  
  // Additional date validation
  const year = parseInt(value.substring(0, 4));
  const month = parseInt(value.substring(4, 6));
  const day = parseInt(value.substring(6, 8));
  
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || 
      date.getMonth() !== month - 1 || 
      date.getDate() !== day) {
    return 'Invalid date';
  }
  
  return '';
};

const validateNumberCount = (option, value, qualifier) => {
    if (!qualifier) return 'Qualifier is required';
    if (!value) return 'Number is required';

    const optionBRegex = /^\d{3}$/;  // 3!n
    const optionCRegex = /^\d{6}$/;  // 6!n

    let isValid = false;
    
    switch (option) {
      case 'B':
        isValid = optionBRegex.test(value);
        if (!isValid) return 'Format must be 3 digits for option B';
        break;
      case 'C':
        isValid = optionCRegex.test(value);
        if (!isValid) return 'Format must be 6 digits for option C';
        break;
      default:
        return 'Invalid option selected';
    }
    return '';
};

const handleOptionChange = (e) => {
  setFormData(prev => ({
    ...prev,
    prepDateTime: e.target.value,
    prepDateTimeValue: ''
  }));
  setDateTimeInput('');
  setErrors({});
};

const handleDateTimeChange = (e) => {
  const value = e.target.value;
  setDateTimeInput(value);
  
  const error = validateDateTime(formData.prepDateTime, value);
  setErrors(prev => ({
    ...prev,
    prepDateTime: error
  }));
  
  if (!error) {
    setFormData(prev => ({
      ...prev,
      prepDateTimeValue: value
    }));
  }
};
  // Validate fields based on Content/Options
  const validateField = (name, value, pattern) => {
    let error = '';
    if (!value) {
      error = 'This field is required';
    } else if (pattern && !new RegExp(pattern).test(value)) {
      error = 'Invalid format';
    }
    return error;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const pattern = getValidationPattern(name);
    const error = validateField(name, value, pattern);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Get validation pattern based on Content/Options
  const getValidationPattern = (fieldName) => {
    switch (fieldName) {
      case 'senderReference':
        return '^[A-Z]{4}//[A-Z0-9]{1,16}$'; // :4!c//16x
      case 'functionOfMessage':
        return '^[A-Z]{4}(/[A-Z]{4})?$'; // 4!c[/4!c]
      case 'prepDateTime':
        return '^[A-Z]{1}$'; // A, C, E (dropdown)
      case 'numberCount':
        return '^[B|C]{1}$'; // B, C (dropdown)
      case 'linkIndicator':
        return '^[A-Z]{4}/[A-Z0-9]{0,8}/[A-Z]{4}$'; // :4!c/[8c]/4!c
      case 'linkedMessage':
        return '^[A-Z]{1}$'; // A, B (dropdown)
      case 'linkedReference':
        return '^[C|U]{1}$'; // C, U (dropdown)
      case 'linkageQuantity':
        return '^[B|D]{1}$'; // B, D (dropdown)
      case 'place':
        return '^[B|H|L]{1}$'; // B, H, L (dropdown)
      case 'tradeDateTime':
        return '^[A-Z]{1}$'; // A, B, C, E (dropdown)
      case 'dealPrice':
        return '^[A-Z]{1}$'; // A, B (dropdown)
      case 'daysAccrued':
        return '^[A-Z]{4}//[0-9]{3}$'; // :4!c//[N]3!n
      case 'isin':
        return '^[A-Z]{2}[A-Z0-9]{9}[0-9]$'; // ISIN format
      case 'placeOfListing':
        return '^[A-Z]{4}/[A-Z0-9]{0,8}/[A-Z]{4}(/[A-Z0-9]{0,30})?$'; // :4!c/[8c]/4!c[/30x]
      case 'financialInstrumentIndicator':
        return '^[A-Z]{4}/[A-Z0-9]{0,8}/[A-Z]{4}$'; // :4!c/[8c]/4!c
      case 'typeOfFinancialInstrument':
        return '^[A-Z]{1}$'; // A, B, C (dropdown)
      case 'currencyOfDenomination':
        return '^[A-Z]{4}//[A-Z]{3}$'; // :4!c//3!a
      case 'financialInstrumentDate':
        return '^[A-Z]{4}//[0-9]{8}$'; // :4!c//8!n
      case 'rate':
        return '^[A-Z]{4}//[0-9]{1,15}(\\.[0-9]{1,2})?$'; // :4!c//[N]15d
      case 'certificateNumber':
        return '^[A-Z]{4}/[A-Z0-9]{0,8}/[A-Z0-9]{0,30}$'; // :4!c/[8c]/30x
      case 'flag':
        return '^[A-Z]{4}//[A-Z]{1}$'; // :4!c//1!a
      case 'price':
        return '^[A-Z]{1}$'; // A, B (dropdown)
      case 'financialInstrumentQuantity':
        return '^[B|D]{1}$'; // B, D (dropdown)
      case 'financialInstrumentNarrative':
        return '^[A-Z]{4}//[A-Z0-9]{0,350}$'; // :4!c//10*35x
      case 'settlementQuantity':
        return '^[B|D]{1}$'; // B, D (dropdown)
      case 'denominationNarrative':
        return '^[A-Z]{4}//[A-Z0-9]{0,210}$'; // :4!c//6*35x
      case 'certificateIdentification':
        return '^[A-Z]{4}/[A-Z0-9]{0,8}/[A-Z0-9]{0,30}$'; // :4!c/[8c]/30x
      case 'party':
        return '^[L|P|R]{1}$'; // L, P, R (dropdown)
      case 'account':
        return '^[A-Z]{1}$'; // A, B, D, E (dropdown)
      case 'placeOfSafekeeping':
        return '^[B|C|F|L]{1}$'; // B, C, F, L (dropdown)
      case 'lotNumber':
        return '^[A-Z]{4}/[A-Z0-9]{0,8}/[A-Z0-9]{0,30}$'; // :4!c/[8c]/30x
      case 'lotQuantity':
        return '^[B|D]{1}$'; // B, D (dropdown)
      case 'lotDateTime':
        return '^[A-Z]{1}$'; // A, C, E (dropdown)
      case 'lotPrice':
        return '^[A-Z]{1}$'; // A, B (dropdown)
      case 'priceIndicator':
        return '^[A-Z]{4}/[A-Z0-9]{0,8}/[A-Z]{4}$'; // :4!c/[8c]/4!c
      case 'repoDateTime':
        return '^[A-Z]{1}$'; // A, B, C (dropdown)
      case 'repoIndicator':
        return '^[A-Z]{4}/[A-Z0-9]{0,8}/[A-Z]{4}$'; // :4!c/[8c]/4!c
      case 'repoReference':
        return '^[A-Z]{4}//[A-Z0-9]{0,16}$'; // :4!c//16x
      case 'repoRate':
        return '^[A-Z]{1}$'; // A, C (dropdown)
      case 'repoNumberCount':
        return '^[A-Z]{4}//[0-9]{3}$'; // :4!c//3!n
      case 'repoAmount':
        return '^[A-Z]{4}//[0-9]{1,15}(\\.[0-9]{1,2})?$'; // :4!c//[N]3!a15d
      case 'secondLegNarrative':
        return '^[A-Z]{4}//[A-Z0-9]{0,140}$'; // :4!c//4*35x
      case 'settlementIndicator':
        return '^[A-Z]{4}/[A-Z0-9]{0,8}/[A-Z]{4}$'; // :4!c/[8c]/4!c
      case 'settlementParty':
        return '^[C|L|P|Q|R|S]{1}$'; // C, L, P, Q, R, S (dropdown)
      case 'settlementAccount':
        return '^[A-Z]{1}$'; // A, B, D (dropdown)
      case 'processingDateTime':
        return '^[A-Z]{1}$'; // A, C (dropdown)
      case 'processingReference':
        return '^[A-Z]{4}//[A-Z0-9]{0,16}$'; // :4!c//16x
      case 'settlementNarrative':
        return '^[A-Z]{4}//[A-Z0-9]{0,350}$'; // :4!c//10*35x
      case 'cashParty':
        return '^[L|P|Q|R|S]{1}$'; // L, P, Q, R, S (dropdown)
      case 'cashAccount':
        return '^[A-Z]{1}$'; // A, E (dropdown)
      case 'cashNarrative':
        return '^[A-Z]{4}//[A-Z0-9]{0,350}$'; // :4!c//10*35x
      case 'amountFlag':
        return '^[A-Z]{4}//[A-Z]{1}$'; // :4!c//1!a
      case 'amount':
        return '^[A-Z]{4}//[0-9]{1,15}(\\.[0-9]{1,2})?$'; // :4!c//[N]3!a15d
      case 'valueDateTime':
        return '^[A-Z]{1}$'; // A, C (dropdown)
      case 'exchangeRate':
        return '^[A-Z]{4}//[A-Z]{3}/[A-Z]{3}/[0-9]{1,15}(\\.[0-9]{1,2})?$'; // :4!c//3!a/3!a/15d
      case 'otherParty':
        return '^[C|L|P|Q|R|S]{1}$'; // C, L, P, Q, R, S (dropdown)
      case 'otherAccount':
        return '^[A-Z]{1}$'; // A, D (dropdown)
      case 'otherNarrative':
        return '^[A-Z]{4}//[A-Z0-9]{0,350}$'; // :4!c//10*35x
      case 'otherProcessingReference':
        return '^[A-Z]{4}//[A-Z0-9]{0,16}$'; // :4!c//16x
      case 'linkedMessageQualifier':
      case 'linkedReferenceQualifier':
      case 'linkageQuantityQualifier':
            return '^[A-Z]{4}$'; // 4!c
          
      case 'linkedMessageNumber':
        return formData.linkedMessageOption === "A"
          ? '^[A-Z0-9]{3}$' // 3!c
          : '^[A-Z0-9]{1,30}$'; // 30x
          
          case 'linkedReferenceValue':
            return formData.linkedReferenceOption === "C"
          ? '^[A-Z0-9]{16}$' // 16x
          : '^[A-Z0-9]{52}$'; // 52x
          
      case 'linkageQuantityType':
        return '^[A-Z0-9]{4}$'; // 4!c
          
      case 'linkageQuantityValue':
        return formData.linkageQuantityOption === "B"
          ? '^[0-9]{1,15}(\\.[0-9]{1,2})?$' // 15d
          : '^[0-9]{1,30}(\\.[0-9]{1,2})?$'; // 30d
      default:
        return null;
    }
  };

  ///**************** */

  const getDateTime98APattern = (option) => {
    switch (option) {
      case 'A':
        return '^[0-9]{8}$'; // Basic date format YYYYMMDD
      case 'C':
        return '^[0-9]{8}[0-9]{6}$'; // Date + Time YYYYMMDD + HHMMSS
      case 'E':
        return '^[0-9]{8}[0-9]{6}(,[0-9]{3})?(\/[N]?[0-9]{2}([0-9]{2})?)?$'; // Full format with optional decimals and UTC
      default:
        return null;
    }
  };

  const handleQualifierChange = (e) => {
    const qualifier = e.target.value;
    setFormData(prev => ({
      ...prev,
      numberCountQualifier: qualifier
    }));
    
    if (numberInput) {
      const error = validateNumberCount(formData.numberCountOption, numberInput, qualifier);
      setErrors(prev => ({
        ...prev,
        numberCount: error
      }));
    }
  };

  const handleNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow digits
    setNumberInput(value);
    
    const error = validateNumberCount(
      formData.numberCountOption,
      value,
      formData.numberCountQualifier
    );
    
    setErrors(prev => ({
      ...prev,
      numberCount: error
    }));
    
    if (!error) {
      setFormData(prev => ({
        ...prev,
        numberCountValue: value
      }));
    }
  };

  // Format the final value for SWIFT message
  const getFormattedValue = () => {
    if (!formData.numberCountQualifier || !formData.numberCountValue) return '';
    return `${formData.numberCountQualifier}//${formData.numberCountValue}`;
  };

  const handleOptionChangeNumberCount = (e) => {
    const option = e.target.value;
    setFormData(prev => ({
      ...prev,
      numberCountOption: option,
      numberCountValue: '',
      numberCountQualifier: ''
    }));
    setNumberInput('');
    setErrors({});
  };

  // Generate SWIFT MT541C message
  const generateSwiftMessage = () => {
    const {
      senderReference,
      functionOfMessage,
      prepDateTime,
      numberCount,
      linkIndicator,
      linkedMessage,
      linkedReference,
      linkageQuantity,
      place,
      tradeDateTime,
      dealPrice,
      daysAccrued,
      isin,
      placeOfListing,
      financialInstrumentIndicator,
      typeOfFinancialInstrument,
      currencyOfDenomination,
      financialInstrumentDate,
      rate,
      certificateNumber,
      flag,
      price,
      financialInstrumentQuantity,
      financialInstrumentNarrative,
      settlementQuantity,
      denominationNarrative,
      certificateIdentification,
      party,
      account,
      placeOfSafekeeping,
      lotNumber,
      lotQuantity,
      lotDateTime,
      lotPrice,
      priceIndicator,
      repoDateTime,
      repoIndicator,
      repoReference,
      repoRate,
      repoNumberCount,
      repoAmount,
      secondLegNarrative,
      settlementIndicator,
      settlementParty,
      settlementAccount,
      processingDateTime,
      processingReference,
      settlementNarrative,
      cashParty,
      cashAccount,
      cashNarrative,
      amountFlag,
      amount,
      valueDateTime,
      exchangeRate,
      otherParty,
      otherAccount,
      otherNarrative,
      otherProcessingReference,
    } = formData;

    let swiftMessage = `{1:F01XXXXXXXXXXXXXXX0000000000}
{2:I541XXXXXXXXXXXXXN}
{4:
:16R:GENL
:20C::SEME//${senderReference}
:23G:${functionOfMessage}`;

    if (prepDateTime) swiftMessage += `
:98A::PREP//${prepDateTime}`;
    if (numberCount) swiftMessage += `
:99A::DAAC//${numberCount}`;

    if (showLinkages) {
      swiftMessage += `
:16R:LINK
:22F::LINK//${linkIndicator}
:13A::LINK//${linkedMessage}
:20C::LINK//${linkedReference}
:36B::LINK//${linkageQuantity}
:16S:LINK`;
    }

    swiftMessage += `
:16S:GENL
:16R:TRADDET
:94B::PLAC//${place}
:98A::TRAD//${tradeDateTime}
:90A::DEAL//${dealPrice}
:99A::DAAC//${daysAccrued}
:35B:ISIN ${isin}`;

    if (showFinancialInstrumentAttributes) {
      swiftMessage += `
:16R:FIA
:94B::PLIS//${placeOfListing}
:22F::FIAN//${financialInstrumentIndicator}
:12A::FIAN//${typeOfFinancialInstrument}
:11A::DENO//${currencyOfDenomination}
:98A::FIAN//${financialInstrumentDate}
:92A::RATE//${rate}
:13B::CERT//${certificateNumber}
:17B::FLAG//${flag}
:90A::PRIC//${price}
:36B::FIAN//${financialInstrumentQuantity}
:70E::FIAN//${financialInstrumentNarrative}
:16S:FIA`;
    }

    swiftMessage += `
:16S:TRADDET
:16R:FIAC
:36B::SETT//${settlementQuantity}
:70D::DENC//${denominationNarrative}
:13B::CERT//${certificateIdentification}
:95P::PSET//${party}
:97A::SAFE//${account}
:94B::SAFE//${placeOfSafekeeping}`;

    if (showQuantityBreakdown) {
      swiftMessage += `
:16R:BREAK
:13B::LOTS//${lotNumber}
:36B::LOTS//${lotQuantity}
:98A::LOTS//${lotDateTime}
:90A::LOTS//${lotPrice}
:22F::PRIC//${priceIndicator}
:16S:BREAK`;
    }

    swiftMessage += `
:16S:FIAC`;

    if (showTwoLegTransaction) {
      swiftMessage += `
:16R:REPO
:98A::REPO//${repoDateTime}
:22F::REPO//${repoIndicator}
:20C::REPO//${repoReference}
:92A::REPO//${repoRate}
:99B::REPO//${repoNumberCount}
:19A::REPO//${repoAmount}
:70C::SECO//${secondLegNarrative}
:16S:REPO`;
    }

    swiftMessage += `
:16R:SETDET
:22F::SETR//${settlementIndicator}`;

    if (showSettlementParties) {
      swiftMessage += `
:16R:SETPRTY
:95P::SETP//${settlementParty}
:97A::SETP//${settlementAccount}
:98A::PROC//${processingDateTime}
:20C::PROC//${processingReference}
:70E::SETP//${settlementNarrative}
:16S:SETPRTY`;
    }

    if (showCashParties) {
      swiftMessage += `
:16R:CSHPRTY
:95P::CSHP//${cashParty}
:97A::CSHP//${cashAccount}
:70E::CSHP//${cashNarrative}
:16S:CSHPRTY`;
    }

    if (showAmounts) {
      swiftMessage += `
:16R:AMT
:17B::FLAG//${amountFlag}
:19A::AMT//${amount}
:98A::VALU//${valueDateTime}
:92B::EXCH//${exchangeRate}
:16S:AMT`;
    }

    swiftMessage += `
:16S:SETDET`;

    if (showOtherParties) {
      swiftMessage += `
:16R:OTHRPRTY
:95P::OTHR//${otherParty}
:97A::OTHR//${otherAccount}
:70E::OTHR//${otherNarrative}
:20C::PROC//${otherProcessingReference}
:16S:OTHRPRTY`;
    }

    swiftMessage += `
-}`;

    return swiftMessage;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some((error) => error !== '');
    if (!hasErrors) {
      setMessageOutput(generateSwiftMessage());
    }
  };

  return (
    <div>

      <Navbar/>
   
    <div className="swift-container">
      <h1>SWIFT MT541 Message Generator</h1>
      <form onSubmit={handleSubmit} className="swift-form">
        {/* General Information (Sequence A) */}
        <div className="form-section">
          <h2>General Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Sender Reference *:</label>
              <input
                type="text"
                name="senderReference"
                value={formData.senderReference}
                onChange={handleInputChange}
                required
              />
              {errors.senderReference && <span className="error">{errors.senderReference}</span>}
            </div>
            <div className="form-group">
              <label>Function of the Message *:</label>
              <input
                type="text"
                name="functionOfMessage"
                value={formData.functionOfMessage}
                onChange={handleInputChange}
                required
              />
              {errors.functionOfMessage && <span className="error">{errors.functionOfMessage}</span>}
            </div>
            <div className="form-group">
      <label className="block mb-2 font-medium">Preparation Date/Time:</label>
      <div className="flex flex-col gap-2">
        <select
          className="w-full p-2 border rounded"
          value={formData.prepDateTime}
          onChange={handleOptionChange}
        >
          <option value="">Select format</option>
          <option value="A">A - Date only (YYYYMMDD)</option>
          <option value="C">C - Date and Time (YYYYMMDDHHMMSS)</option>
          <option value="E">E - Extended Format</option>
        </select>
        
        {formData.prepDateTime && (
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={dateTimeInput}
            onChange={handleDateTimeChange}
            placeholder={
              formData.prepDateTime === 'A' ? 'YYYYMMDD' :
              formData.prepDateTime === 'C' ? 'YYYYMMDDHHMMSS' :
              'YYYYMMDDHHMMSS[,3n][/[N]2!n[2!n]]'
            }
          />
        )}
        
        {errors.prepDateTime && (
          <span className="text-red-500 text-sm">{errors.prepDateTime}</span>
        )}
        
        {formData.prepDateTimeValue && !errors.prepDateTime && (
          <span className="text-green-500 text-sm">Valid format</span>
        )}
      </div>
    </div>
    <div className="form-group">
      <label className="block mb-2 font-medium">Number Count:</label>
      <div className="flex flex-col gap-2">
        <select
          className="w-full p-2 border rounded"
          value={formData.numberCountOption}
          onChange={handleOptionChangeNumberCount}
        >
          <option value="">Select format</option>
          <option value="B">B - 3 digits</option>
          <option value="C">C - 6 digits</option>
        </select>
        
        {formData.numberCountOption && (
          <>
            <select
              className="w-full p-2 border rounded"
              value={formData.numberCountQualifier}
              onChange={handleQualifierChange}
            >
              <option value="">Select qualifier</option>
              {Object.entries(qualifiers).map(([code, description]) => (
                <option key={code} value={code}>
                  {code} - {description}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={numberInput}
              onChange={handleNumberChange}
              placeholder={
                formData.numberCountOption === 'B' ? 'Enter 3 digits' :
                'Enter 6 digits'
              }
              maxLength={formData.numberCountOption === 'B' ? 3 : 6}
            />
          </>
        )}
        
        {errors.numberCount && (
          <span className="text-red-500 text-sm">{errors.numberCount}</span>
        )}
        
        {formData.numberCountValue && !errors.numberCount && (
          <span className="text-green-500 text-sm">
            Valid format: {getFormattedValue()}
          </span>
        )}
      </div>
    </div>
          </div>
        </div>

       {/* Linkages (Subsequence A1) */}
<div className="form-section">
  <label>
    <input
      type="checkbox"
      checked={showLinkages}
      onChange={() => setShowLinkages(!showLinkages)}
    />
    Include Linkages
  </label>

  {showLinkages && (
    <div className="form-row">
      <div className="form-group">
        <label>Link Indicator:</label>
        <input
          type="text"
          name="linkIndicator"
          value={formData.linkIndicator}
          onChange={handleInputChange}
          placeholder="e.g., LINK/12345678/LINK"
        />
      </div>

      {/* Linked Message (13a) */}
      <div className="form-group">
        <label>Linked Message:</label>
        <select
          name="linkedMessageOption"
          value={formData.linkedMessageOption}
          onChange={handleInputChange}
        >
          <option value="">Select Format</option>
          <option value="A">Option A - :4!c//3!c</option>
          <option value="B">Option B - :4!c/[8c]/30x</option>
        </select>
        {formData.linkedMessageOption && (
          <>
            <input
              type="text"
              name="linkedMessageQualifier"
              value={formData.linkedMessageQualifier}
              onChange={handleInputChange}
              placeholder="Qualifier (e.g., LINK)"
            />
            {formData.linkedMessageOption === "B" && (
              <input
                type="text"
                name="linkedMessageDataSource"
                value={formData.linkedMessageDataSource}
                onChange={handleInputChange}
                placeholder="Data Source Scheme (Optional)"
              />
            )}
            <input
              type="text"
              name="linkedMessageNumber"
              value={formData.linkedMessageNumber}
              onChange={handleInputChange}
              placeholder="Message Number (3 or 30 chars)"
            />
          </>
        )}
      </div>

      {/* Linked Reference (20a) */}
      <div className="form-group">
        <label>Linked Reference:</label>
        <select
          name="linkedReferenceOption"
          value={formData.linkedReferenceOption}
          onChange={handleInputChange}
        >
          <option value="">Select Format</option>
          <option value="C">Option C - :4!c//16x</option>
          <option value="U">Option U - :4!c//52x</option>
        </select>
        {formData.linkedReferenceOption && (
          <>
            <input
              type="text"
              name="linkedReferenceQualifier"
              value={formData.linkedReferenceQualifier}
              onChange={handleInputChange}
              placeholder="Qualifier (e.g., LINK)"
            />
            <input
              type="text"
              name="linkedReferenceValue"
              value={formData.linkedReferenceValue}
              onChange={handleInputChange}
              placeholder="Reference (16 or 52 chars)"
            />
          </>
        )}
      </div>

      {/* Linkage Quantity (36a) */}
      <div className="form-group">
        <label>Linkage Quantity:</label>
        <select
          name="linkageQuantityOption"
          value={formData.linkageQuantityOption}
          onChange={handleInputChange}
        >
          <option value="">Select Format</option>
          <option value="B">Option B - :4!c//4!c/15d</option>
          <option value="D">Option D - :4!c//4!c/30d</option>
        </select>
        {formData.linkageQuantityOption && (
          <>
            <input
              type="text"
              name="linkageQuantityQualifier"
              value={formData.linkageQuantityQualifier}
              onChange={handleInputChange}
              placeholder="Qualifier (e.g., LINK)"
            />
            <input
              type="text"
              name="linkageQuantityType"
              value={formData.linkageQuantityType}
              onChange={handleInputChange}
              placeholder="Quantity Type Code (4 chars)"
            />
            <input
              type="text"
              name="linkageQuantityValue"
              value={formData.linkageQuantityValue}
              onChange={handleInputChange}
              placeholder="Quantity (15 or 30 digits)"
            />
          </>
        )}
      </div>
    </div>
  )}
</div>


        {/* Trade Details (Sequence B) */}
        <div className="form-section">
          <h2>Trade Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Place:</label>
              <select
                name="place"
                value={formData.place}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="B">B</option>
                <option value="H">H</option>
                <option value="L">L</option>
              </select>
            </div>
            <div className="form-group">
              <label>Trade Date/Time *:</label>
              <select
                name="tradeDateTime"
                value={formData.tradeDateTime}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="E">E</option>
              </select>
              {errors.tradeDateTime && <span className="error">{errors.tradeDateTime}</span>}
            </div>
            <div className="form-group">
              <label>Deal Price:</label>
              <select
                name="dealPrice"
                value={formData.dealPrice}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
            <div className="form-group">
              <label>Days Accrued:</label>
              <input
                type="text"
                name="daysAccrued"
                value={formData.daysAccrued}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>ISIN *:</label>
              <input
                type="text"
                name="isin"
                value={formData.isin}
                onChange={handleInputChange}
                required
              />
              {errors.isin && <span className="error">{errors.isin}</span>}
            </div>
          </div>
        </div>

        {/* Financial Instrument Attributes (Subsequence B1) */}
        <div className="form-section">
          <label>
            <input
              type="checkbox"
              checked={showFinancialInstrumentAttributes}
              onChange={() => setShowFinancialInstrumentAttributes(!showFinancialInstrumentAttributes)}
            />
            Include Financial Instrument Attributes
          </label>
          {showFinancialInstrumentAttributes && (
            <div className="form-row">
              <div className="form-group">
                <label>Place of Listing:</label>
                <input
                  type="text"
                  name="placeOfListing"
                  value={formData.placeOfListing}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Financial Instrument Indicator:</label>
                <input
                  type="text"
                  name="financialInstrumentIndicator"
                  value={formData.financialInstrumentIndicator}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Type of Financial Instrument:</label>
                <select
                  name="typeOfFinancialInstrument"
                  value={formData.typeOfFinancialInstrument}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Currency of Denomination:</label>
                <input
                  type="text"
                  name="currencyOfDenomination"
                  value={formData.currencyOfDenomination}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Financial Instrument Date:</label>
                <input
                  type="text"
                  name="financialInstrumentDate"
                  value={formData.financialInstrumentDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Rate:</label>
                <input
                  type="text"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Certificate Number:</label>
                <input
                  type="text"
                  name="certificateNumber"
                  value={formData.certificateNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Flag:</label>
                <input
                  type="text"
                  name="flag"
                  value={formData.flag}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <select
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
              <div className="form-group">
                <label>Financial Instrument Quantity:</label>
                <select
                  name="financialInstrumentQuantity"
                  value={formData.financialInstrumentQuantity}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="B">B</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div className="form-group">
                <label>Financial Instrument Narrative:</label>
                <input
                  type="text"
                  name="financialInstrumentNarrative"
                  value={formData.financialInstrumentNarrative}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Financial Instrument/Account (Sequence C) */}
        <div className="form-section">
          <h2>Financial Instrument/Account</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Settlement Quantity *:</label>
              <select
                name="settlementQuantity"
                value={formData.settlementQuantity}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="B">B</option>
                <option value="D">D</option>
              </select>
            </div>
            <div className="form-group">
              <label>Denomination Narrative:</label>
              <input
                type="text"
                name="denominationNarrative"
                value={formData.denominationNarrative}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Certificate Identification:</label>
              <input
                type="text"
                name="certificateIdentification"
                value={formData.certificateIdentification}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Party:</label>
              <select
                name="party"
                value={formData.party}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="L">L</option>
                <option value="P">P</option>
                <option value="R">R</option>
              </select>
            </div>
            <div className="form-group">
              <label>Account *:</label>
              <select
                name="account"
                value={formData.account}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
            <div className="form-group">
              <label>Place of Safekeeping:</label>
              <select
                name="placeOfSafekeeping"
                value={formData.placeOfSafekeeping}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="F">F</option>
                <option value="L">L</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quantity Breakdown (Subsequence C1) */}
        <div className="form-section">
          <label>
            <input
              type="checkbox"
              checked={showQuantityBreakdown}
              onChange={() => setShowQuantityBreakdown(!showQuantityBreakdown)}
            />
            Include Quantity Breakdown
          </label>
          {showQuantityBreakdown && (
            <div className="form-row">
              <div className="form-group">
                <label>Lot Number:</label>
                <input
                  type="text"
                  name="lotNumber"
                  value={formData.lotNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Lot Quantity:</label>
                <select
                  name="lotQuantity"
                  value={formData.lotQuantity}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="B">B</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div className="form-group">
                <label>Lot Date/Time:</label>
                <select
                  name="lotDateTime"
                  value={formData.lotDateTime}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="C">C</option>
                  <option value="E">E</option>
                </select>
              </div>
              <div className="form-group">
                <label>Lot Price:</label>
                <select
                  name="lotPrice"
                  value={formData.lotPrice}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price Indicator:</label>
                <input
                  type="text"
                  name="priceIndicator"
                  value={formData.priceIndicator}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Two Leg Transaction Details (Sequence D) */}
        <div className="form-section">
          <label>
            <input
              type="checkbox"
              checked={showTwoLegTransaction}
              onChange={() => setShowTwoLegTransaction(!showTwoLegTransaction)}
            />
            Include Two Leg Transaction Details
          </label>
          {showTwoLegTransaction && (
            <div className="form-row">
              <div className="form-group">
                <label>Repo Date/Time:</label>
                <select
                  name="repoDateTime"
                  value={formData.repoDateTime}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Repo Indicator:</label>
                <input
                  type="text"
                  name="repoIndicator"
                  value={formData.repoIndicator}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Repo Reference:</label>
                <input
                  type="text"
                  name="repoReference"
                  value={formData.repoReference}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Repo Rate:</label>
                <select
                  name="repoRate"
                  value={formData.repoRate}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Repo Number Count:</label>
                <input
                  type="text"
                  name="repoNumberCount"
                  value={formData.repoNumberCount}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Repo Amount:</label>
                <input
                  type="text"
                  name="repoAmount"
                  value={formData.repoAmount}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Second Leg Narrative:</label>
                <input
                  type="text"
                  name="secondLegNarrative"
                  value={formData.secondLegNarrative}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Settlement Details (Sequence E) */}
        <div className="form-section">
          <h2>Settlement Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Settlement Indicator *:</label>
              <input
                type="text"
                name="settlementIndicator"
                value={formData.settlementIndicator}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Settlement Parties (Subsequence E1) */}
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
            <div className="form-row">
              <div className="form-group">
                <label>Settlement Party:</label>
                <select
                  name="settlementParty"
                  value={formData.settlementParty}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="C">C</option>
                  <option value="L">L</option>
                  <option value="P">P</option>
                  <option value="Q">Q</option>
                  <option value="R">R</option>
                  <option value="S">S</option>
                </select>
              </div>
              <div className="form-group">
                <label>Settlement Account:</label>
                <select
                  name="settlementAccount"
                  value={formData.settlementAccount}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div className="form-group">
                <label>Processing Date/Time:</label>
                <select
                  name="processingDateTime"
                  value={formData.processingDateTime}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Processing Reference:</label>
                <input
                  type="text"
                  name="processingReference"
                  value={formData.processingReference}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Settlement Narrative:</label>
                <input
                  type="text"
                  name="settlementNarrative"
                  value={formData.settlementNarrative}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cash Parties (Subsequence E2) */}
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
            <div className="form-row">
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
                  <option value="Q">Q</option>
                  <option value="R">R</option>
                  <option value="S">S</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cash Account:</label>
                <select
                  name="cashAccount"
                  value={formData.cashAccount}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="E">E</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cash Narrative:</label>
                <input
                  type="text"
                  name="cashNarrative"
                  value={formData.cashNarrative}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Amounts (Subsequence E3) */}
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
            <div className="form-row">
              <div className="form-group">
                <label>Amount Flag:</label>
                <input
                  type="text"
                  name="amountFlag"
                  value={formData.amountFlag}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Value Date/Time:</label>
                <select
                  name="valueDateTime"
                  value={formData.valueDateTime}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Exchange Rate:</label>
                <input
                  type="text"
                  name="exchangeRate"
                  value={formData.exchangeRate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Other Parties (Sequence F) */}
        <div className="form-section">
          <label>
            <input
              type="checkbox"
              checked={showOtherParties}
              onChange={() => setShowOtherParties(!showOtherParties)}
            />
            Include Other Parties
          </label>
          {showOtherParties && (
            <div className="form-row">
              <div className="form-group">
                <label>Other Party:</label>
                <select
                  name="otherParty"
                  value={formData.otherParty}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="C">C</option>
                  <option value="L">L</option>
                  <option value="P">P</option>
                  <option value="Q">Q</option>
                  <option value="R">R</option>
                  <option value="S">S</option>
                </select>
              </div>
              <div className="form-group">
                <label>Other Account:</label>
                <select
                  name="otherAccount"
                  value={formData.otherAccount}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div className="form-group">
                <label>Other Narrative:</label>
                <input
                  type="text"
                  name="otherNarrative"
                  value={formData.otherNarrative}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Other Processing Reference:</label>
                <input
                  type="text"
                  name="otherProcessingReference"
                  value={formData.otherProcessingReference}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="generate-button">
          Generate MT541C
        </button>
      </form>

      {messageOutput && (
        <div className="message-output">
          <h2>Generated SWIFT MT541C Message:</h2>
          <pre>{messageOutput}</pre>
        </div>
      )}
    </div>
    </div>
  );
};

export default SwiftMT541Creator;