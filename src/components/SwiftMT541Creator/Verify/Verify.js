import React, { useState } from 'react';
import dummyData from '../Search/dummyData1';
import Sidebar from '../Sidebar/Sidebar';
import SwiftMT541Creator from '../SwiftMT541Creator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import './Verify.css';

const Verify = () => {
  const [pendingTransactions, setPendingTransactions] = useState(
    dummyData.filter((item) => item.status === 'Pending')
  );
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleView = (index) => {
    setSelectedTransaction(pendingTransactions[index]);
    setIsViewModalOpen(true);
  };

  const handleEdit = (index) => {
    setSelectedTransaction(pendingTransactions[index]);
    setIsEditModalOpen(true);
  };

  const handleVerify = (index) => {
    Swal.fire({
      title: 'Verify Transaction?',
      text: 'Are you sure you want to verify this transaction?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, verify it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTransactions = [...pendingTransactions];
        updatedTransactions[index].status = 'Pending Approval';
        setPendingTransactions(updatedTransactions.filter((item) => item.status === 'Pending'));
        
        Swal.fire(
          'Verified!',
          'The transaction has been verified.',
          'success'
        );
        
        handleClose();
      }
    });
  };

  const handleReject = (index) => {
    Swal.fire({
      title: 'Reject Transaction?',
      text: 'Are you sure you want to reject this transaction?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTransactions = [...pendingTransactions];
        updatedTransactions[index].status = 'Rejected';
        setPendingTransactions(updatedTransactions.filter((item) => item.status === 'Pending'));
        
        Swal.fire(
          'Rejected!',
          'The transaction has been rejected.',
          'success'
        );
        
        handleClose();
      }
    });
  };

  const handleClose = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleSave = () => {
    setIsEditModalOpen(false);
    setPendingTransactions(dummyData.filter((item) => item.status === 'Pending'));
  };

  // Function to format transaction data for human-readable display
  const formatTransactionForDisplay = (transaction) => {
    const sections = [
      {
        title: "General Information",
        fields: [
          { label: "Message Format", value: transaction.messageFormat },
          { label: "Message Reference", value: transaction.messageRef },
          { label: "RFC Reference", value: transaction.rfcRef },
          { label: "Status", value: transaction.status }
        ]
      },
      {
        title: "Time Information",
        fields: [
          { label: "Start Date", value: transaction.startDate },
          { label: "End Date", value: transaction.endDate }
        ]
      },
      {
        title: "Message Details",
        fields: [
          { label: "Message Type", value: transaction.messageType },
          { label: "Message Direction", value: transaction.messageDirection },
          { label: "Sender BIC", value: transaction.senderBIC },
          { label: "Receiver BIC", value: transaction.receiverBIC }
        ]
      }
    ];

    // Add any additional fields that might be in the transaction but not explicitly listed above
    const additionalFields = Object.keys(transaction)
      .filter(key => !['messageFormat', 'messageRef', 'rfcRef', 'status', 'startDate', 
                        'endDate', 'messageType', 'messageDirection', 'senderBIC', 'receiverBIC'].includes(key))
      .map(key => ({ label: key, value: transaction[key] }));

    if (additionalFields.length > 0) {
      sections.push({
        title: "Additional Information",
        fields: additionalFields
      });
    }

    return sections;
  };

  return (
    <div className="main-container">
      <Sidebar onSelectTab={(tab) => console.log(tab)} />
      <div className="verify-container">
        <h1 className='headName'>Verify Pending Transactions</h1>

        {pendingTransactions.length === 0 ? (
          <p className="no-transactions">No pending transactions to verify.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Message Format</th>
                  <th>Message Reference</th>
                  <th>RFC Reference</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Message Type</th>
                  <th>Message Direction</th>
                  <th>Sender BIC</th>
                  <th>Receiver BIC</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.messageFormat}</td>
                    <td>{transaction.messageRef}</td>
                    <td>{transaction.rfcRef}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{transaction.startDate}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{transaction.endDate}</td>
                    <td>{transaction.messageType}</td>
                    <td>{transaction.messageDirection}</td>
                    <td>{transaction.senderBIC}</td>
                    <td>{transaction.receiverBIC}</td>
                    <td>{transaction.status}</td>
                    <td className="action-buttons">
                      <button 
                        className="icon-button view-button" 
                        onClick={() => handleView(index)}
                        title="View"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button 
                        className="icon-button edit-button" 
                        onClick={() => handleEdit(index)}
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isViewModalOpen && selectedTransaction && (
          <div className="modal">
            <div className="modal-content view-modal">
              <h2 className="modal-title">View Transaction</h2>
              <div className="transaction-details">
                {formatTransactionForDisplay(selectedTransaction).map((section, sectionIndex) => (
                  <div key={sectionIndex} className="detail-section">
                    <h3 className="section-title">{section.title}</h3>
                    <div className="section-content">
                      {section.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="detail-field">
                          <span className="field-label">{field.label}:</span>
                          <span className="field-value">{field.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-buttons">
                <button className="btn btn-primary" onClick={() => handleVerify(pendingTransactions.indexOf(selectedTransaction))}>
                  Verify
                </button>
                <button className="btn btn-danger" onClick={() => handleReject(pendingTransactions.indexOf(selectedTransaction))}>
                  Reject
                </button>
                <button className="btn btn-secondary" onClick={handleClose}>Close</button>
              </div>
            </div>
          </div>
        )}

        {isEditModalOpen && selectedTransaction && (
          <div className="modal">
            <div className="modal-content edit-modal">
              <h2 className="modal-title">Edit Transaction</h2>
              <SwiftMT541Creator initialData={selectedTransaction} onSave={handleSave} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;