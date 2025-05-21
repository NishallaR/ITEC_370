import { MongoClient } from 'mongodb';
import 'dotenv/config';

const client = new MongoClient(process.env.MONGO_URI);
const dbName = 'eduflex';
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(dbName); 
    console.log('MongoDB connected');
  }
  return db;
}

async function getCourseContent(courseId) {
  const db = await connectDB();
  const collection = db.collection('course_content');

  if (courseId) {
    return await collection.find({ course_id: courseId }).toArray();
  } else {
    return await collection.find().toArray(); 
  }
}

async function addCourseContent(course) {
  const db = await connectDB();
  const collection = db.collection('course_content');
  await collection.insertOne(course);
}

const _getCourseContent = getCourseContent;
export { _getCourseContent as getCourseContent, addCourseContent };
