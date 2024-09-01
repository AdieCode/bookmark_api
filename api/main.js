require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Define a route
app.get('/', (req, res) => {
  res.send('This is the bookmark api');
});

// Requiring routers
const loginRouter = require('./routes/auth/login');
const signUpRouter = require('./routes/auth/sign-up');

app.use('/auth/login', loginRouter);
app.use('/auth/sign-up', signUpRouter);


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
