import React, { useState } from 'react';
import './SwiftForm.css';
import Sidebar from './Sidebar/Sidebar';
import TradeDetailsSection from './TradeDetails/TradeDetailsSection';
import GeneralInformationSection from './GeneralInfo/GeneralInformationSection';
import Header from './GeneralInfo/Header';
import LinkagesSection from './Linkage/LinkagesSection';
import FinancialInstrumentAttributes from './FIA/FinancialInstrumentAttributes';
import SettlementDetailsSection from './SettlementDetails/SettlementDetailsSection';
import FinancialInstrumentAccountSection from './FIAC/FinancialInstrumentAccountSection';
import QuantityBreakdownForm from './FIAC/QuantityBreakdownForm';
import TwoLegTransactionForm from './TLT/TwoLegTransactionForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SwiftMT541Creator = ({ initialData, onSave }) => {
  const navigate = useNavigate();
  const [showFullForm, setShowFullForm] = useState(!!initialData);
  const [messageFormat, setMessageFormat] = useState(initialData?.messageFormat || '');
  const [messageSeries, setMessageSeries] = useState(initialData?.messageSeries || '');
  const [messageType, setMessageType] = useState(initialData?.messageType || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialData || {
    messageFormat: '',
    messageSeries: '',
    messageType: '',
    senderReference: '',
    receiverReference: '',
    functionOfMessage: '',
    finCopy: 'No',
    priority: 'N',
    monitoring: 'None',
    userPDE: 'No',
    bankingPriority: '',
    mur: '',
    prepDateTimeOption: '',
    prepDateTimeValue: '',
    numberCountOption: '',
    numberCountQualifier: '',
    numberCountValue: '',
    linkIndicator: '',
    linkedMessageOption: '',
    linkedMessageQualifier: '',
    linkedMessageDataSource: '',
    linkedMessageNumber: '',
    linkedReferenceOption: '',
    linkedReferenceQualifier: '',
    linkedReferenceValue: '',
    quantityOption: '',
    quantityQualifier: '',
    quantityTypeCode: '',
    quantityValue: '',
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
    isin: '',
    placeOfListingQualifier: '',
    placeOfListingCode: '',
    placeOfListingDataSource: '',
    placeOfListingNarrative: '',
    financialInstrumentIndicatorQualifier: '',
    financialInstrumentIndicatorCode: '',
    financialInstrumentIndicatorDataSource: '',
    typeOfFinancialInstrumentOption: '',
    typeOfFinancialInstrumentQualifier: '',
    typeOfFinancialInstrumentCode: '',
    typeOfFinancialInstrumentDataSource: '',
    currencyOfDenomination: '',
    financialInstrumentDate: '',
    rateQualifier: '',
    rateValue: '',
    numberIdentificationOption: '',
    numberIdentificationQualifier: '',
    numberIdentificationValue: '',
    flagQualifier: '',
    flagValue: '',
    priceOption: '',
    priceQualifier: '',
    priceValue: '',
    priceCurrency: '',
    financialInstrumentQuantityOption: '',
    financialInstrumentQuantityQualifier: '',
    financialInstrumentQuantityValue: '',
    financialInstrumentIdentification: '',
    financialInstrumentNarrative: '',
    settlementIndicator: '',
    settlementParty: '',
    processingReference: '',
    settlementAccount: '',
    cashParty: '',
    cashAccount: '',
    cashNarrative: '',
    amountQualifier: '',
    amount: '',
    amountCurrency: '',
    otherParty: '',
    otherProcessingReference: '',
    valueDateTime: '',
    exchangeRate: '',
    narrative: '',
    otherAccount: '',
    otherNarrative: '',
    startBlock: 'FIAC',
    quantity: {
      option: '',
      qualifierType: '',
      quantityValue: ''
    },
    narrativeDenomination: '',
    certificateNumber: '',
    party: {
      option: '',
      identifier: '',
      dataSourceScheme: '',
      proprietaryCode: ''
    },
    account: {
      option: '',
      accountNumber: '',
      dataSourceScheme: '',
      accountTypeCode: '',
      blockchainId: '',
      iban: ''
    },
    place: {
      option: '',
      dataSourceScheme: '',
      placeCode: '',
      narrative: '',
      countryCode: '',
      identifierCode: '',
      lei: ''
    },
    placeOfSafekeeping: {
      option: '',
      dataSourceScheme: '',
      placeCode: '',
      narrative: '',
      countryCode: '',
      identifierCode: '',
      lei: ''
    },
    lotNumber: {
      qualifier: 'LOTS',
      dataSource: '',
      value: ''
    },
    quantityBreakdown: {
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
    priceBreakdown: {
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
    endBlock: 'BREAK',
    repoDateTime: {
      option: '',
      qualifier: '',
      dataSource: '',
      date: '',
      time: '',
      dateCode: ''
    },
    repoIndicator: {
      qualifier: '',
      dataSource: '',
      value: ''
    },
    repoReference: {
      qualifier: '',
      value: ''
    },
    repoRate: {
      option: '',
      qualifier: '',
      dataSource: '',
      sign: '',
      value: '',
      rateName: ''
    },
    repoNumberCount: {
      qualifier: '',
      value: ''
    },
    repoAmount: {
      qualifier: '',
      currency: '',
      sign: '',
      value: ''
    },
    secondLegNarrative: {
      value: ''
    }
  });

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (messageFormat === 'MT' && messageSeries === '5' && messageType === '541') {
      // Update formData with initial message format values
      setFormData({
        ...formData,
        messageFormat,
        messageSeries,
        messageType
      });
      setShowFullForm(true);
    }
  };

  const generateSwiftMessage = () => {
    const {
      senderReference,
      receiverReference,
      functionOfMessage,
      finCopy,
      priority,
      monitoring,
      userPDE,
      bankingPriority,
      mur,
      prepDateTimeOption,
      prepDateTimeValue,
      numberCountOption,
      numberCountQualifier,
      numberCountValue,
      linkIndicator,
      linkedMessageOption,
      linkedMessageQualifier,
      linkedMessageDataSource,
      linkedMessageNumber,
      linkedReferenceOption,
      linkedReferenceQualifier,
      linkedReferenceValue,
      quantityOption,
      quantityQualifier,
      quantityTypeCode,
      quantityValue,
      placeOption,
      placeQualifier,
      placeCode,
      placeDataSource,
      placeIdentifier,
      placeNarrative,
      tradeDateTimeOption,
      tradeDateTimeValue,
      dealPriceOption,
      dealPriceType,
      dealPriceValue,
      dealPriceCurrency,
      daysAccrued,
      isin,
      placeOfListingQualifier,
      placeOfListingCode,
      placeOfListingDataSource,
      placeOfListingNarrative,
      financialInstrumentIndicatorQualifier,
      financialInstrumentIndicatorCode,
      financialInstrumentIndicatorDataSource,
      typeOfFinancialInstrumentOption,
      typeOfFinancialInstrumentQualifier,
      typeOfFinancialInstrumentCode,
      typeOfFinancialInstrumentDataSource,
      currencyOfDenomination,
      financialInstrumentDate,
      rateQualifier,
      rateValue,
      numberIdentificationOption,
      numberIdentificationQualifier,
      numberIdentificationValue,
      flagQualifier,
      flagValue,
      priceOption,
      priceQualifier,
      priceValue,
      priceCurrency,
      financialInstrumentQuantityOption,
      financialInstrumentQuantityQualifier,
      financialInstrumentQuantityValue,
      financialInstrumentIdentification,
      financialInstrumentNarrative,
      settlementIndicator,
      settlementParty,
      processingReference,
      settlementAccount,
      cashParty,
      cashAccount,
      cashNarrative,
      amountQualifier,
      amount,
      amountCurrency,
      otherParty,
      otherProcessingReference,
      valueDateTime,
      exchangeRate,
      narrative,
      otherAccount,
      otherNarrative,
      startBlock,
      quantity,
      narrativeDenomination,
      certificateNumber,
      party,
      account,
      placeOfSafekeeping,
      lotNumber,
      quantityBreakdown,
      dateTime,
      priceBreakdown,
      priceIndicator,
      endBlock,
      repoDateTime,
      repoIndicator,
      repoReference,
      repoRate,
      repoNumberCount,
      repoAmount,
      secondLegNarrative
    } = formData;

    let swiftMessage = `{1:F01XXXXXXXXXXXXXXX0000000000}
{2:I541XXXXXXXXXXXXXN}
{4:
:16R:GENL
:20C::SEME//${senderReference}
:23G:${functionOfMessage}`;

    if (prepDateTimeValue) swiftMessage += `\n:98A::PREP//${prepDateTimeValue}`;
    if (numberCountValue) swiftMessage += `\n:99A::DAAC//${numberCountValue}`;

    swiftMessage += `\n:16S:GENL
:16R:TRADDET
:94B::PLAC//${placeCode}
:98A::TRAD//${tradeDateTimeValue}
:90A::DEAL//${dealPriceValue}
:99A::DAAC//${daysAccrued}
:35B:ISIN ${isin}
:16S:TRADDET`;

    swiftMessage += `\n:16R:FIAC
:36B::SETT//${quantity.quantityValue}
:70D::DENC//${narrativeDenomination}
:13B::CERT//${certificateNumber}
:95P::PSET//${party.identifier}
:97A::SAFE//${account.accountNumber}
:94B::SAFE//${placeOfSafekeeping?.placeCode || ''}
:16S:FIAC`;

    swiftMessage += `\n:16R:BREAK
:13B::LOTS//${lotNumber.value}
:36B::LOTS//${quantityBreakdown.value}
:98A::LOTS//${dateTime.date}
:90A::LOTS//${priceBreakdown.value}
:22F::PRIC//${priceIndicator.value}
:16S:BREAK`;

    swiftMessage += `\n:16R:REPO
:98A::${repoDateTime.qualifier}//${repoDateTime.date}
:22F::${repoIndicator.qualifier}//${repoIndicator.value}
:20C::${repoReference.qualifier}//${repoReference.value}
:92A::${repoRate.qualifier}//${repoRate.value}
:99B::${repoNumberCount.qualifier}//${repoNumberCount.value}
:19A::${repoAmount.qualifier}//${repoAmount.currency}${repoAmount.value}
:70C::${secondLegNarrative.value}
:16S:REPO`;

    swiftMessage += `\n:16R:SETDET
:22F::SETT//${settlementIndicator}
:95P::${settlementParty}//${processingReference}
:97A::${settlementAccount}
:95P::${cashParty}//${cashAccount}
:70D::${cashNarrative}
:19A::${amountQualifier}//${amountCurrency}${amount}
:95P::${otherParty}//${otherProcessingReference}
:98A::${valueDateTime}
:92A::${exchangeRate}
:70E::${narrative}
:97A::${otherAccount}
:70E::${otherNarrative}
:16S:SETDET`;

    return swiftMessage;
  };

  const saveToBackend = async (swiftData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:8081/api/swift/create', swiftData);
      
      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        throw new Error('Failed to save SWIFT message to backend');
      }
    } catch (error) {
      console.error('Error saving SWIFT message:', error);
      setError(error.message || 'Failed to save to backend');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Generate SWIFT message
      const swiftMessage = generateSwiftMessage();
      
      // Create a comprehensive data object including all form data and the generated message
      const swiftData = {
        messageFormat: formData.messageFormat || messageFormat,
        messageSeries: formData.messageSeries || messageSeries,
        messageType: formData.messageType || messageType,
        swiftMessage: swiftMessage,
        formData: {
          ...formData,
          messageFormat: formData.messageFormat || messageFormat,
          messageSeries: formData.messageSeries || messageSeries,
          messageType: formData.messageType || messageType
        }
      };
      
      // Save to backend
      await saveToBackend(swiftData);
      
      // Navigate to output page with the generated message
      navigate('/mt541-output', { state: { swiftMessage, formData } });
      
      // If onSave callback is provided (e.g., for editing), call it
      if (onSave) {
        onSave(formData);
      }
    } catch (error) {
      // Error is already set in saveToBackend function
      console.error('Submission failed:', error);
    }
  };

  return (
    <div>
      <div className="app-container">
        <Sidebar className="sidebar" />
        <div className="swift-container">
          <h1 className='headName'>SWIFT Message Generator</h1>

          {error && <div className="error-message">{error}</div>}

          {!showFullForm ? (
            <form onSubmit={handleInitialSubmit} className="swift-form initial-form">
              <h2>Create Transaction</h2>
              <div className="form-grid">
                <div className="field-container">
                  <label>Message Format</label>
                  <select
                    value={messageFormat}
                    onChange={(e) => setMessageFormat(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="MT">MT</option>
                    <option value="MX">MX</option>
                  </select>
                </div>
                <div className="field-container">
                  <label>Message Series</label>
                  <select
                    value={messageSeries}
                    onChange={(e) => setMessageSeries(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {[...Array(9).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field-container">
                  <label>Message Type</label>
                  <select
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {messageSeries === '5' && <option value="541">541</option>}
                  </select>
                </div>
              </div>
              <button type="submit" className="generate-button" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="swift-form full-form">
              <Header formData={formData} setFormData={setFormData} />
              <GeneralInformationSection formData={formData} setFormData={setFormData} />
              <LinkagesSection formData={formData} setFormData={setFormData} />
              <TradeDetailsSection formData={formData} setFormData={setFormData} />
              <FinancialInstrumentAttributes formData={formData} setFormData={setFormData} />
              <FinancialInstrumentAccountSection formData={formData} setFormData={setFormData} />
              <QuantityBreakdownForm formData={formData} setFormData={setFormData} />
              <TwoLegTransactionForm formData={formData} setFormData={setFormData} />
              <SettlementDetailsSection formData={formData} setFormData={setFormData} />
              <button type="submit" className="generate-button" disabled={loading}>
                {loading ? 'Processing...' : initialData ? 'Update' : 'Generate & Save'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwiftMT541Creator;