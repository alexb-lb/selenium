const mongoose = require('mongoose');

const ProxyCheckingHistorySchema = new mongoose.Schema({
  _proxyId : {
    type: Schema.ObjectId,
    ref: 'Proxy',
    required: true,
  },
  status: {
    type: Boolean,
    required: true
  }
}, {timestamps: {createdAt: "created_at"}});


const ProxyCheckingHistory = mongoose.model('proxyCheckingHistory', ProxyCheckingHistorySchema);

module.exports = ProxyCheckingHistory;
