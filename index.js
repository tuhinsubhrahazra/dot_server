const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
const server = http.createServer(app);
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

server.listen(PORT, () => {
    console.log("server is runnong at PORT: " + PORT);
});

app.get('/', (req, res) => {
    res.send("server is running ...");
});

app.use('/auth', require('./router/auth'));
app.use('/details', require('./router/basicDetails'));
app.use('/profile', require('./router/profile.js'))