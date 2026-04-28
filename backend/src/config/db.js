const mongoose = require('mongoose');
const env = require('./env');

let connection = null;

const connectDB = async () => {
  if (connection) {
    return connection;
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    connection = conn;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

const disconnectDB = async () => {
  if (connection) {
    await mongoose.disconnect();
    connection = null;
  }
};

module.exports = { connectDB, disconnectDB };
