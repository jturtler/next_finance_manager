
import mongoose from 'mongoose';


// Define the MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI as string;
        
  console.log('===== MongoDB connecting ... ');
// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('===== MongoDB connected.');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

export { mongoose };
