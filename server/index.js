const express = require('express'),
      mongoose = require('mongoose'),
      cors = require('cors'),
      morgan = require('morgan');

require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth',      require('./routes/auth.routes'));
app.use('/api/leads',     require('./routes/lead.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mini-crm')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log('🚀 Server running on port ' + (process.env.PORT || 5000));
    });
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });