require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const getManga = require("./utils/aniList.js")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', async (req, res) => {  // Mark the function as async
  try {
    const value = await getManga();  // Await the asynchronous function
    res.json(value);  // Send the JSON object as the response
  } catch (error) {
    res.status(500).send('Error occurred: ' + error.message);
  }
});


// Requiring routers
const loginRouter = require('./routes/auth/login.js');
const signUpRouter = require('./routes/auth/sign-up.js');
const userContentAddRouter = require('./routes/user content/add.js');

app.use('/auth/login', loginRouter);
app.use('/auth/sign-up', signUpRouter);
app.use('/user', userContentAddRouter);


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
