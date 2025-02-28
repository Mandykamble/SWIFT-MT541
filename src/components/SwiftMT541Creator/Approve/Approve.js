import React, { useState } from 'react';
import dummyData from '../Search/dummyData1';
import Sidebar from '../Sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import './Approve.css';

const Approve = () => {
  const [pendingApprovalTransactions, setPendingApprovalTransactions] = useState(
    dummyData.filter((item) => item.status === 'Pending Approval')
  );
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleView = (index) => {
    setSelectedTransaction(pendingApprovalTransactions[index]);
    setIsViewModalOpen(true);
  };

  const handleApprove = (index) => {
    Swal.fire({
      title: 'Approve Transaction?',
      text: 'Are you sure you want to approve this transaction? It will be sent to SWIFT.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTransactions = [...pendingApprovalTransactions];
        updatedTransactions[index].status = 'Sent to SWIFT';
        setPendingApprovalTransactions(updatedTransactions.filter((item) => item.status === 'Pending Approval'));
        
        Swal.fire(
          'Approved!',
          'The transaction has been approved and sent to SWIFT.',
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
        const updatedTransactions = [...pendingApprovalTransactions];
        updatedTransactions[index].status = 'Rejected';
        setPendingApprovalTransactions(updatedTransactions.filter((item) => item.status === 'Pending Approval'));
        
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
      <div className="approve-container">
        <h1 className='headName'>Approve Pending Transactions</h1>

        {pendingApprovalTransactions.length === 0 ? (
          <p className="no-transactions">No pending transactions to approve.</p>
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
                {pendingApprovalTransactions.map((transaction, index) => (
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
                <button className="btn btn-primary" onClick={() => handleApprove(pendingApprovalTransactions.indexOf(selectedTransaction))}>
                  Approve
                </button>
                <button className="btn btn-danger" onClick={() => handleReject(pendingApprovalTransactions.indexOf(selectedTransaction))}>
                  Reject
                </button>
                <button className="btn btn-secondary" onClick={handleClose}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approve;