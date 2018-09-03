const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  botId: {
    type: String,
    required: true,
  },
  proxyId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  finishedAt: Date,
}, {timestamps: {startedAt: "created_at"}});


const Session = mongoose.model('session', SessionSchema);
module.exports = Session;
