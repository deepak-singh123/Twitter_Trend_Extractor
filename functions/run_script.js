import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fetchTrendingTopics from '../backend/script.js';
import { Trends } from '../backend/model/trends.js';

dotenv.config();

let isConnected = false; // To track MongoDB connection status

async function connectToDatabase() {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGO_URI, { dbName: 'TrendingTopic' });
      isConnected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }
}

async function storeResults(data) {
  const { topics, ipAddress } = data;

  const result = new Trends({
    uniqueID: new Date().getTime().toString(),
    trends: topics,
    ip_address: ipAddress,
  });

  try {
    const savedData = await result.save();
    console.log('Data stored in MongoDB:', savedData);
    return savedData;
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    throw error;
  }
}

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // Prevents the function from waiting for MongoDB connection to close

  try {
    await connectToDatabase();

    const proxyList = [
      'us-ca.proxymesh.com:31280',
      'us-wa.proxymesh.com:31280',
      'fr.proxymesh.com:31280',
      'jp.proxymesh.com:31280',
      'au.proxymesh.com:31280',
    ];

    function getRandomProxy() {
      const randomIndex = Math.floor(Math.random() * proxyList.length);
      return proxyList[randomIndex];
    }

    const proxy = `http://${process.env.PROXY_USERNAME}:${process.env.PROXY_PASSWORD}@${getRandomProxy()}`;
    console.log(`Using Proxy: ${proxy}`);

    const twitterEmail = process.env.EMAIL;
    const twitterPassword = process.env.PASSWORD;
    const twitterUsername = process.env.ACCOUNT_USERNAME;

    const result = await fetchTrendingTopics(proxy, twitterEmail, twitterPassword, twitterUsername);

    const data = await storeResults(result);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Add CORS headers
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error running script:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Add CORS headers
      },
      body: JSON.stringify({ error: 'Internal Server Error', message: error.message }),
    };
  }
};
