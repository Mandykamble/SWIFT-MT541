import React, { useState } from 'react';
import dummyData from '../Search/dummyData1';
import Sidebar from '../Sidebar/Sidebar';
import SwiftMT541Creator from '../SwiftMT541Creator';
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
    const updatedTransactions = [...pendingTransactions];
    updatedTransactions[index].status = 'Pending Approval';
    setPendingTransactions(updatedTransactions.filter((item) => item.status === 'Pending'));
  };

  const handleReject = (index) => {
    const updatedTransactions = [...pendingTransactions];
    updatedTransactions[index].status = 'Rejected';
    setPendingTransactions(updatedTransactions.filter((item) => item.status === 'Pending'));
  };

  const handleClose = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleSave = () => {
    setIsEditModalOpen(false);
    setPendingTransactions(dummyData.filter((item) => item.status === 'Pending'));
  };

  return (
    <div className="main-container">
      <Sidebar onSelectTab={(tab) => console.log(tab)} />
      <div className="verify-container">
        <h1 className='headName'>Verify Pending Transactions</h1>

        {pendingTransactions.length === 0 ? (
          <p>No pending transactions to verify.</p>
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
                    <td>
                      <button className="view-button" onClick={() => handleView(index)}>
                        View
                      </button>
                      <button className="edit-button" onClick={() => handleEdit(index)}>
                        Edit
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
            <div className="modal-content">
              <h2>View Transaction</h2>
              <pre>{JSON.stringify(selectedTransaction, null, 2)}</pre>
              <button onClick={handleClose}>Close</button>
              <button onClick={() => handleVerify(pendingTransactions.indexOf(selectedTransaction))}>
                Verify
              </button>
              <button onClick={() => handleReject(pendingTransactions.indexOf(selectedTransaction))}>
                Reject
              </button>
            </div>
          </div>
        )}

        {isEditModalOpen && selectedTransaction && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Transaction</h2>
              <SwiftMT541Creator initialData={selectedTransaction} onSave={handleSave} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;