// functions/runScript.js
import storeResults from '../storeResults.js'; // Adjust path as needed

export const handler = async (event, context) => {
  try {
    const proxy = `http://${process.env.PROXY_USERNAME}:${process.env.PROXY_PASSWORD}@us-ca.proxymesh.com:31280`;
    const twitterEmail = process.env.EMAIL;
    const twitterPassword = process.env.PASSWORD;
    const twitterUsername = process.env.ACCOUNT_USERNAME;

    const result = await fetchTrendingTopics(proxy, twitterEmail, twitterPassword, twitterUsername);
    const data = await storeResults(result);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error running script:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error running the script' }),
    };
  }
};
