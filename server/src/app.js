const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./config/env');

// Import routes
const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const companyRoutes = require('./routes/company.routes');
const interviewRoutes = require('./routes/interview.routes');
const noteRoutes = require('./routes/note.routes');
const notificationRoutes = require('./routes/notification.routes');
const externalJobRoutes = require('./routes/externalJob.routes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting (generous limits for development/local use)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.NODE_ENV === 'development' ? 5000 : 500,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files - uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root landing route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Job Application Tracker API is Live and Operational!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      jobs: '/api/jobs',
      companies: '/api/companies',
      interviews: '/api/interviews',
      externalJobs: '/api/external-jobs',
    },
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/external-jobs', externalJobRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
