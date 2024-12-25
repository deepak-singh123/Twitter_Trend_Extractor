import mongoose from "mongoose";
const trendingTopicSchema = new mongoose.Schema({
  uniqueID: {
    type: String, 
    required: true,
    unique: true, 
  },
  trends:[
    {
      type: String,
      required: true,
    },
  ],
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  ip_address: {
    type: String,
    required: true,
  },
});

export const Trends = new mongoose.model('TrendingTopic', trendingTopicSchema);

