const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// external packages
require('dotenv').config();

// internal packages
const getManga = require("./utils/aniList.js");
const { isAuthenticated } = require('./utils/auth.js');
const port = process.env.PORT || 3000;

// Utility function to mask password fields
function maskSensitiveData(data) {
  const maskedData = JSON.parse(JSON.stringify(data)); // Deep copy of the data object
  for (let key in maskedData) {
    if (key.toLowerCase() === 'password') {
      maskedData[key] = '*****'; // Mask password with asterisks
    } else if (typeof maskedData[key] === 'object' && maskedData[key] !== null) {
      maskedData[key] = maskSensitiveData(maskedData[key]); // Recursive masking for nested objects
    }
  }
  return maskedData;
}

// logging api requests
morgan.token('timestamp', function (req, res) {
  return new Date().toISOString();
});

morgan.token('request-headers', function (req, res) {
  return JSON.stringify(req.headers, null, 2); // Format request headers with 2-space indentation
});

morgan.token('request-body', function (req, res) {
  const maskedBody = maskSensitiveData(req.body || req.params || 'no data received');
  return JSON.stringify(maskedBody, null, 2); // Format request body with 2-space indentation
});

morgan.token('response-body', function (req, res) {
  if (res._responseBody) {
    const maskedBody = maskSensitiveData(JSON.parse(res._responseBody));
    return JSON.stringify(maskedBody, null, 2); // Format response body with 2-space indentation
  }
  return 'response not available';
});

// Middleware to capture response body
app.use((req, res, next) => {
  const oldSend = res.send;
  res._responseBody = ''; // Initialize empty response body

  res.send = function (body) {
    // Capture the response body, ensure it's a valid JSON string
    res._responseBody = typeof body === 'object' ? JSON.stringify(body, null, 2) : body;
    return oldSend.apply(res, arguments); // Call the original send function
  };

  next();
});

// Logging middleware setup with custom format
app.use(morgan(function (tokens, req, res) {
  const firstString = [
    `+ [${tokens.timestamp(req, res)}]`,
    ` - IP [${tokens['remote-addr'](req, res)}]`,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    '-',
    '(' + tokens['response-time'](req, res), 'ms)'
  ].join(' ');

  const separator = '='.repeat(firstString.length + 4);

  return [
    `${separator} \n`,
    firstString,
    '\n\nRequest Headers:',
    tokens['request-headers'](req, res), // This will print the request headers in formatted JSON
    '\n\nRequest Body:',
    tokens['request-body'](req, res),    // This will print the request body in formatted JSON
    '\n\nResponse Body:',
    tokens['response-body'](req, res),   // This will print the response body in formatted JSON
    "\n",
  ].join(' ');
}));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  res.send("this is the bookmark api");
});

// Requiring routers
const loginRouter = require('./routes/auth/login.js');
const signUpRouter = require('./routes/auth/sign-up.js');
const userContentAddRouter = require('./routes/user_content/add.js');
const content = require('./routes/content/get.js');

// Instantiating routes
app.use('/auth/login', loginRouter);
app.use('/auth/sign-up', signUpRouter);

// These routes will need an auth token
app.use(isAuthenticated);
app.use('/user', userContentAddRouter);
app.use('/content', content);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
