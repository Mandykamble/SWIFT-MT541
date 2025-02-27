import React, { useState } from 'react';
import dummyData from '../Search/dummyData1';
import Sidebar from '../Sidebar/Sidebar';
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
    const updatedTransactions = [...pendingApprovalTransactions];
    updatedTransactions[index].status = 'Sent to SWIFT';
    setPendingApprovalTransactions(updatedTransactions.filter((item) => item.status === 'Pending Approval'));
  };

  const handleReject = (index) => {
    const updatedTransactions = [...pendingApprovalTransactions];
    updatedTransactions[index].status = 'Rejected';
    setPendingApprovalTransactions(updatedTransactions.filter((item) => item.status === 'Pending Approval'));
  };

  const handleClose = () => {
    setIsViewModalOpen(false);
  };

  return (
    <div className="main-container">
      <Sidebar onSelectTab={(tab) => console.log(tab)} />
      <div className="approve-container">
        <h1 className='headName'>Approve Pending Transactions</h1>

        {pendingApprovalTransactions.length === 0 ? (
          <p>No pending transactions to approve.</p>
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
                    <td>
                      <button className="view-button" onClick={() => handleView(index)}>
                        View
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
              <button onClick={() => handleApprove(pendingApprovalTransactions.indexOf(selectedTransaction))}>
                Approve
              </button>
              <button onClick={() => handleReject(pendingApprovalTransactions.indexOf(selectedTransaction))}>
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approve;