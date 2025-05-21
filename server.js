import express, { json }  from 'express';
import 'dotenv/config';
import userRoutes from './routes/user.js';
import contentRoutes from './routes/content.js';

const app = express();

// middleware
app.use(json());
app.use(express.static('public'));
app.use('/api', userRoutes);
app.use('/api', contentRoutes);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EduFlex Node server running on port ${PORT}`);
});
