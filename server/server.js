const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

// Define API Routes
const paymentRouter = require('./routes/payment.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cors middleware
app.use(cors());

// Routes
app.use('/api/payment', paymentRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });