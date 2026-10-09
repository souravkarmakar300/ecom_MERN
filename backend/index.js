const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const userRoutes = require('./routes/authRoutes');
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello.. Starting Ecom MERN Website');
});

app.use('/api/auth', userRoutes);
// app.use('/api/products', required('./routes/productRoutes'));
// app.use('/api/orders', required('./routes/orderRoutes'));
// app.use('/api/payment', required('./routes/paymentRoutes'));
// app.use('/api/analytics', required('./routes/analyticsRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});