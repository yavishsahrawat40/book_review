import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error('--------------------------------------------------------------------');
      console.error('🚫 ERROR: MONGO_URI is not defined in your .env file.');
      console.error('Please ensure your .env file exists in the backend root and contains the MONGO_URI.');
      console.error('--------------------------------------------------------------------');
      process.exit(1); // Exit process with failure code
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`--------------------------------------------------------------------`);
    console.log(`🎉 MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`--------------------------------------------------------------------`);

  } catch (error) {
    console.error('--------------------------------------------------------------------');
    console.error(`🚫 MongoDB Connection ERROR: ${error.message}`);
    console.error('--------------------------------------------------------------------');
    // Exit process with failure code
    process.exit(1);
  }
};

export default connectDB;
