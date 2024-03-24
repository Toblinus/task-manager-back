import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  // parent: Task,
  id: Schema.ObjectId,
  text: String,
});

export const Task = mongoose.model('Task', TaskSchema);

let db = null;

export const DB = () => db;

export const connectDB = async (url: string) => {
  db = await mongoose.connect(url, {
    auth: {
      username: 'admin',
      password: 'example',
    },
    dbName: 'chattask',
  });
  return db;
};
