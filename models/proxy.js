const mongoose = require('mongoose');

const ProxySchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
  },
  isInUse: {
    type: Boolean,
    default: false
  },
  checkedAt: Date,
  banned:{
    twitch: {
      type: Boolean,
      default: false
    }
  }
}, {timestamps: {createdAt: "created_at", updatedAt: "updated_at"}});


const Proxy = mongoose.model('proxy', ProxySchema);

module.exports = Proxy;
