const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

dotenv.config();

const app = express();

console.log(process.env.FRONTEND_URL);

const corsOptions = {
    origin: process.env.FRONTEND_URL, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes); 

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Conectado ao banco de dados'))
    .catch((error) => console.error('Erro ao conectar ao banco de dados', error));

// Rota de teste
app.get('/', (req, res) => {
    res.send('Lizzy Moda Evangelica');
});

// porta
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});