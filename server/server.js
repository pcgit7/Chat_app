const express = require('express');
require('dotenv').config();
const app = express();
const port  = process.env.PORT || 5000;
const dbconfig = require('./dbconfig');
const userRoutes = require('./Routes/userRoutes');

app.use('/api/users',userRoutes)
app.listen(port , () => console.log("server runnning on port"));