import mongoose from 'mongoose';

let init = false;

export async function connectDb() {
  mongoose.set('strictQuery', true);
  if (init) {
    console.log('Already connected to MongoDB database');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'techNotesDB',
    });
    console.log('Connected to MongoDB database');
    init = true;
  } catch (error) {
    console.log('Error connecting to MongoDB', error);
  }
}
