require('dotenv').config();
const express = require('express');
const connectAtlasDB = require('./dbconnect');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5002;

connectAtlasDB();

app.use(cors());
app.use(express.json());

app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/admin', require('./routes/admin'));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
