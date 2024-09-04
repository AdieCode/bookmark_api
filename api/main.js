require('dotenv').config();

// external packages
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// enternal packages
const getManga = require("./utils/aniList.js");
const { isAuthenticated } = require('./utils/auth.js');
const port = process.env.PORT || 3000;

// logging api requests
morgan.token('timestamp', function (req, res) {
  return new Date().toISOString();
});

morgan.token('request-headers', function (req, res) {
  return JSON.stringify(req.headers, null, 2);
});

morgan.token('request-body', function (req, res) {
  return JSON.stringify(req.body || req.params || 'no data received', null, 2);
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
      "("+tokens['response-time'](req, res), 'ms)'
  ].join(' ')
  const separator = '='.repeat(firstString.length + 4);
  return [
      `${separator} \n`,
      firstString,
      '\n\nRequest Headers:',
      tokens['request-headers'](req, res),
      '\n\nRequest Body:',
      tokens['request-body'](req, res) + "\n",
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

// instantiating routes
app.use('/auth/login', loginRouter);
app.use('/auth/sign-up', signUpRouter);

// these routes wiil need an auth token
app.use(isAuthenticated)
app.use('/user', userContentAddRouter);
app.use('/content', content);


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
