import mongoose from 'mongoose';
const handler = async (event, context) => {
  const { DB_URI } = process.env;

  // Connect to MongoDB
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully.');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'MongoDB connected' }),
    };
  } catch (error) {
    console.error('MongoDB connection error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'MongoDB connection failed' }),
    };
  }
};

module.exports = { handler };
