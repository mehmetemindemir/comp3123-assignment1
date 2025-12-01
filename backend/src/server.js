require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const { authRequired } = require('./middleware/auth');

const app = express();

const rawContextPath = process.env.CONTEXT_PATH || '/gbc-service/comp3123';
const contextPath = rawContextPath.startsWith('/') ? rawContextPath : `/${rawContextPath}`;
const basePath = contextPath !== '/' && contextPath.endsWith('/') ? contextPath.slice(0, -1) : contextPath;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(`${basePath}/uploads`, express.static(path.join(__dirname, 'uploads')));
app.use(`${basePath}/user`, userRoutes);
app.use(`${basePath}/emp`, authRequired, employeeRoutes);

app.get(`${basePath}/health`, (req, res) => res.json({ ok: true }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8092;
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/comp3123_assignment1';

connectDB(uri).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}${basePath === '/' ? '' : ` (base path ${basePath})`}`));
});
