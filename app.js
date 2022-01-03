const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');



//routes files
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const propertyRoutes = require('./routes/propertyRoutes')
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// MiddleWare for getting the data sent in the request body
app.use(express.json({ limit: '10kb' }));

// Form Parser (Parses data from an html form to the req.body)
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  })
);

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for enabling CORS (Cross Origin Request Sharing)
app.use(cors()); // Only works for simple requests (GET, POST)



// Santize data
app.use(mongoSanitize());

// set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max : 100
})

app.use(limiter);

app.use(hpp());

// Middleware for enabling CORS for non-simple request (PATCH, PUT, DELETE, request with cookies etc)
app.options('*', cors());

// Middleware for testing data
// app.use((req, res, next) => {
//   console.log(req.originalUrl, req.method);
//   next();
// });

app.get('/', (req, res)=>{
  res.json({
    success: true,
    data: 'Server is active'
  })
 })

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/property', propertyRoutes)

// Unhandled Routes
app.all('*', (req, res, next) => {
  const error = `Can't find ${req.originalUrl} on this server`;

  next(new AppError(error, 400));
});

// Error Handler
app.use(globalErrorHandler);

module.exports = app;
