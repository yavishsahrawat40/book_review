    import express from 'express';
    import authRoutes from './authRoutes.js';
    import userRoutes from './userRoutes.js'; 
    import bookRoutes from './bookRoutes.js';
    import reviewRoutes from './reviewRoutes.js';

    const router = express.Router();

    router.get('/', (req, res) => {
      res.status(200).json({
        message: 'Welcome to the BookReview Platform API! Main router is responding.',
        status: 'success',
        timestamp: new Date().toISOString()
      });
    });

    router.use('/auth', authRoutes);
    router.use('/users', userRoutes);
    router.use('/books', bookRoutes);
    router.use('/reviews', reviewRoutes);

    router.get('/ping', (req, res) => {
      res.status(200).json({
        message: 'pong!',
        timestamp: new Date().toISOString()
      });
    });

    export default router;
    