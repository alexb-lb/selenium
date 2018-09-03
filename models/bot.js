const mongoose = require('mongoose');

const subscribeSchema = new Schema({channelId: String, at: Date });

const BotSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  emailPass: {
    type: String,
    required: true,
  },

  twitch: {
    banned: {
      type: Boolean,
      default: false,
      subscribes: [subscribeSchema]
    }
  }
}, {timestamps: {createdAt: "created_at", updatedAt: "updated_at"}});


const Bot = mongoose.model('proxy', BotSchema);

module.exports = Bot;
