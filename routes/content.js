import { Router } from 'express';
const router = Router();
import { getCourseContent, addCourseContent } from '../config/mongo.js'; // MongoDB for course content

router.get('/courses', async (req, res) => {
  try {
    const courses = await getCourseContent();
    console.log('Courses fetched:', courses); 
    res.json({ status: 'success', data: courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/course-content/:courseId', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  try {
    const content = await getCourseContent(courseId); // Assuming this fetches content for specific course
    res.json({ status: 'success', data: content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/course-content', async (req, res) => {
  try {
    await addCourseContent(req.body);
    res.status(201).json({ message: 'Course content added successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add course content.' });
  }
});

export default router;
