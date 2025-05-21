import { Router } from 'express';
const router = Router();
import { insertUser, getAllUsers } from '../config/oracle.js';
import { registerCourse } from '../config/oracle.js'; // Assuming you have a function to register course for users
import { getAllRegistrations, deleteRegistration, updateRegistration, getPayments } from '../config/oracle.js';

router.post('/register', async (req, res) => {
  try {
    await insertUser(req.body);
    res.json({ status: 'success', message: 'User registered' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ status: 'success', data: users });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/enroll', async (req, res) => {
  try {
    await registerCourse(req.body); 
    res.json({ status: 'success', message: 'Enrollment recorded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/registrations', async (req, res) => {
  try {
    const registrations = await getAllRegistrations();
    res.json({ status: 'success', data: registrations });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.put('/registrations', async (req, res) => {
  try {
    await updateRegistration(req.body); 
    res.json({ status: 'success', message: 'Registration updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.delete('/registrations', async (req, res) => {
  try {
    const { user_id, course_id } = req.body;
    await deleteRegistration(user_id, course_id);
    res.json({ status: 'success', message: 'Registration deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/payments', async (req, res) => {
  try {
    const payments = await getPayments(); 
    res.json({ status: 'success', data: payments });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


export default router;
