const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  branch: { 
    type: String, 
    required: true 
  },
  semester: { 
    type: String, 
    required: true 
  },
  purpose: { 
    type: String, 
    required: true 
  },
  destination: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    default: "Pending" 
  },
  finalApproval: { 
    type: String, 
    default: "Pending" 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid'],
    default: 'Pending' 
  },
  ticketId: { 
    type: String 
  },
  ticketGeneratedAt: { 
    type: Date 
  },
  wardenApproval: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"], 
    default: "Pending" 
  },
  wardenApprovalDate: { 
    type: Date 
  },
  hodApprovalDate: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Request", RequestSchema);