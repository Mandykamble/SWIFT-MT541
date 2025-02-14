import React, { useState } from 'react';
import './SwiftForm.css';
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar';
import TradeDetailsSection from './TradeDetails/TradeDetailsSection';
import GeneralInformationSection from './GeneralInfo/GeneralInformationSection';
import LinkagesSection from './Linkage/LinkagesSection';
import FinancialInstrumentAttributes from './FIA/FinancialInstrumentAttributes';
import SettlementDetailsSection from './SettlementDetails/SettlementDetailsSection';

import FinancialInstrumentAccountSection from './FIAC/FinancialInstrumentAccountSection';
import QuantityBreakdownForm from './FIAC/QuantityBreakdownForm'
import TwoLegTransactionForm from  './TLT/TwoLegTransactionForm'


const SwiftMT541Creator = () => {
  // State for form data
  const [formData, setFormData] = useState({
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
  linkedMessageOption: '',
  linkedMessageQualifier: '',
  linkedMessageDataSource: '',
  linkedMessageNumber: '',
  linkedReferenceOption: '',
  linkedReferenceQualifier: '',
  linkageQuantityOption: '',
  linkageQuantityQualifier: '',
  linkageQuantityType: '',
  linkageQuantityValue: '',
  linkedReferenceValue: '',
    quantityType: '',
    quantityValue: ''
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
  // const [showQuantityBreakdown, setshowQuantityBreakdown] = useState(false);
  const [showSettlementParties, setShowSettlementParties] = useState(false);
  const [showCashParties, setShowCashParties] = useState(false);
  const [showAmounts, setShowAmounts] = useState(false);
  const [showOtherParties, setShowOtherParties] = useState(false);
  const [dateTimeInput, setDateTimeInput] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard'); // State for active tab

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

  const validateLinkIndicator = (value) => {
    const regex = /^[A-Z0-9]{4}\/[A-Z0-9]{0,8}\/[A-Z0-9]{4}$/;
    if (!value) return '';
    if (!regex.test(value)) return 'Format must be 4!c/[8c]/4!c';
    return '';
  };

  const validateLinkedMessage = (option, value) => {
    if (!option) return '';
    if (!value) return 'Number identification is required';
    
    switch (option) {
      case 'A':
        return /^\d{3}$/.test(value) ? '' : 'Must be 3 digits for option A';
      case 'B':
        return /^[A-Z0-9]{1,30}$/.test(value) ? '' : 'Must be up to 30 characters for option B';
      default:
        return 'Invalid option';
    }
  };

  const validateLinkedReference = (option, value) => {
    if (!option) return '';
    if (!value) return 'Reference is required';
    
    switch (option) {
      case 'C':
        return /^[A-Z0-9]{1,16}$/.test(value) ? '' : 'Must be up to 16 characters';
      case 'U':
        return /^[A-Z0-9]{1,52}$/.test(value) ? '' : 'Must be up to 52 characters';
      default:
        return 'Invalid option';
    }
  };

  const validateQuantity = (option, type, value) => {
    if (!option || !type) return '';
    if (!value) return 'Quantity is required';
    
    const quantityTypeRegex = /^[A-Z]{4}$/;
    if (!quantityTypeRegex.test(type)) {
      return 'Quantity type must be 4 uppercase letters';
    }

    switch (option) {
      case 'B':
        return /^\d{1,15}(\.\d{0,2})?$/.test(value) ? '' : 'Invalid quantity format for option B';
      case 'D':
        return /^\d{1,30}(\.\d{0,2})?$/.test(value) ? '' : 'Invalid quantity format for option D';
      default:
        return 'Invalid option';
    }
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

  const handleLinkageChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    switch (name) {
      case 'linkIndicator':
        error = validateLinkIndicator(value);
        break;
      case 'linkedMessageNumber':
        error = validateLinkedMessage(formData.linkedMessage, value);
        break;
      case 'linkedReferenceValue':
        error = validateLinkedReference(formData.linkedReference, value);
        break;
      case 'quantityValue':
        error = validateQuantity(formData.quantityType, value);
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
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

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div>

      <div className="app-container">
      
      <Sidebar onSelectTab={handleTabSelect} className="sidebar" />
    <div className="swift-container">
      <h1>SWIFT MT541 Message Generator</h1>
      <form onSubmit={handleSubmit} className="swift-form">
        {/* General Information (Sequence A) */}
        
        
      <GeneralInformationSection></GeneralInformationSection>
          
          
        
{/* ---------------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>
       {/* Linkages (Subsequence A1) */}

      
        <LinkagesSection></LinkagesSection>

  {/* {/->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

        <TradeDetailsSection></TradeDetailsSection>

        {/* Financial Instrument Attributes (Subsequence B1) */}

        <FinancialInstrumentAttributes></FinancialInstrumentAttributes>
        
        {/* Financial Instrument/Account (Sequence C) */}
        
        <FinancialInstrumentAccountSection></FinancialInstrumentAccountSection>

        {/* Quantity Breakdown (Subsequence C1) */}

        <div className="form-section">
          <label>
            <input
              type="checkbox"
              checked={showQuantityBreakdown}
              onChange={() => setShowQuantityBreakdown(!showQuantityBreakdown)}

              
            />
            Quantity Breakdown
          </label>
          {showQuantityBreakdown && (
            <QuantityBreakdownForm></QuantityBreakdownForm>
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
            <TwoLegTransactionForm></TwoLegTransactionForm>
          )}
        </div>

        <SettlementDetailsSection/>

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
    </div>
  );
};

export default SwiftMT541Creator;