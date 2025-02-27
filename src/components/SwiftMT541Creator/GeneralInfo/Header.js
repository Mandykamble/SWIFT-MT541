import React from 'react';

const Header = ({ formData, setFormData }) => {
  const [showOptions, setShowOptions] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="swift-form">
      <h2>Header Information</h2>

      {/* Header Fields */}
      <div className="form-grid">
        {/* Sender Reference */}
        <div className="field-container">
          <label>Sender Reference *</label>
          <input
            type="text"
            name="senderReference"
            value={formData.senderReference}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Receiver Reference */}
        <div className="field-container">
          <label>Receiver Reference *</label>
          <input
            type="text"
            name="receiverReference"
            value={formData.receiverReference}
            onChange={handleInputChange}
            required
          />
        </div>

        
      </div>

      {/* Toggle Options Dropdown */}
      <button
        className="generate-button"
        onClick={() => setShowOptions(!showOptions)}
      >
        {showOptions ? "Hide Options ▲" : "Show Options ▼"}
      </button>

      {/* Options Dropdown Section */}
      {showOptions && (
        <div className="form-grid">
          {/* FINCopy */}
          <div className="field-container">
            <label>FINCopy</label>
            <select
              name="finCopy"
              value={formData.finCopy}
              onChange={handleInputChange}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Priority */}
          <div className="field-container">
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="S">S (System) - User to System</option>
              <option value="U">U (Urgent) - User to User</option>
              <option value="N">N (Normal) - User to User</option>
            </select>
          </div>

          {/* Monitoring */}
          <div className="field-container">
            <label>Monitoring</label>
            <select
              name="monitoring"
              value={formData.monitoring}
              onChange={handleInputChange}
            >
              <option value="None">None</option>
              <option value="Non-Delivery Warning">Non-Delivery Warning</option>
              <option value="Non-Delivery Warning and Delivery Notification">
                Non-Delivery Warning & Delivery Notification
              </option>
              <option value="Delivery Notification">Delivery Notification</option>
            </select>
          </div>

          {/* User PDE */}
          <div className="field-container">
            <label>User PDE</label>
            <select
              name="userPDE"
              value={formData.userPDE}
              onChange={handleInputChange}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Banking Priority */}
          <div className="field-container">
            <label>Banking Priority</label>
            <input
              type="text"
              name="bankingPriority"
              value={formData.bankingPriority}
              onChange={handleInputChange}
            />
          </div>

          {/* MUR */}
          <div className="field-container">
            <label>MUR</label>
            <input
              type="text"
              name="mur"
              value={formData.mur}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;