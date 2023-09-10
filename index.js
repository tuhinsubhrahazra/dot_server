const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
const server = http.createServer(app);

const corsOptions = {
    origin: 'https://cxnnect-server.onrender.com',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify the HTTP methods you want to allow.
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization', // Specify the allowed headers.
};

app.use(cors());

server.listen(PORT, () => {
    console.log("server is runnong at PORT: " + PORT);
});

app.get('/', (req, res) => {
    res.send("server is running ...");
});

app.use('/auth', require('./router/auth'));
app.use('/details', require('./router/basicDetails'));
app.use('/profile', require('./router/profile.js'))