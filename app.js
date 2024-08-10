require('dotenv').config();
require('express-async-errors');
const express = require('express');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const jobsRoute = require('./routes/jobs');
const authRoute = require('./routes/auth');
const protectedRoute = require('./middleware/authentication');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit');

require('./db/connect');

const app = express();

app.use(express.json());
// extra packages

// routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/jobs', protectedRoute, jobsRoute);

// error handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.set('trust proxy',1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
}))
app.use(helmet())
app.use(cors())
app.use(xss())

const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`Server is listening on port ${port}...`)
);