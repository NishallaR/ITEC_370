import { MongoClient } from 'mongodb';
import 'dotenv/config';

const client = new MongoClient(process.env.MONGO_URI);
const dbName = 'eduflex';
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(dbName); // Initialize the db instance once
    console.log('MongoDB connected');
  }
  return db;
}

async function getCourseContent(courseId) {
  const db = await connectDB();
  const collection = db.collection('course_content');

  // If courseId is passed, filter by course_id, otherwise return all courses
  if (courseId) {
    return await collection.find({ course_id: courseId }).toArray();
  } else {
    return await collection.find().toArray(); // If no courseId, return all courses
  }
}

async function addCourseContent(course) {
  const db = await connectDB();
  const collection = db.collection('course_content');
  await collection.insertOne(course);
}

const _getCourseContent = getCourseContent;
export { _getCourseContent as getCourseContent, addCourseContent };
