import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Trends } from './model/trends.js';
import fetchTrendingTopics from './script.js';
import cors from 'cors';
import ProxyMesh from './proxymesh.js';

dotenv.config();
const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((e) => console.log('Database connection error:', e));


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
  }
}

const proxyList = [
    'us-ca.proxymesh.com:31280', 
    'us-wa.proxymesh.com:31280', 
    'fr.proxymesh.com:31280', 
    'jp.proxymesh.com:31280', 
    'au.proxymesh.com:31280' 
  ];
function getRandomProxy() {
  const randomIndex = Math.floor(Math.random() * proxyList.length);
  return proxyList[randomIndex];
}

app.get('/run_script', async (req, res) => {
  console.log("inside run_script");
  try {
    const proxy = `http://${process.env.PROXY_USERNAME}:${process.env.PROXY_PASSWORD}@us-ca.proxymesh.com:31280`;
    console.log(`Using Proxy: ${proxy}`);

    const twitterEmail = process.env.EMAIL;
    const twitterPassword = process.env.PASSWORD;
    const twitterUsername = process.env.ACCOUNT_USERNAME;

    const result = await fetchTrendingTopics(proxy, twitterEmail, twitterPassword, twitterUsername);

    const data = await storeResults(result);
    res.json(data);
  } catch (error) {
    console.error('Error running script:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
