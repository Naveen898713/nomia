const express = require('express');
const cors = require('cors');
const connectdb = require('./DataBase/db');
const fs = require("fs");
const path = require("path");
// const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
// app.use("/webhook",require('./Routes/WebhookRoutes'),)
// app.use('/webhook', bodyParser.raw({ type: 'application/json' }));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
connectdb();
app.use("/otp",require('./Routes/OtpRoutes'),);
app.use("/login",require('./Routes/otp/OtpRoutes'),);

app.use("/user",require('./Routes/user/UserRoutes'),);
app.use("/video",require('./Routes/videos/VideoRoutes'),);
app.use("/photo",require('./Routes/photo/PhotoRoutes'),);
app.use("/recording",require('./Routes/recording/RecordingRoutes'),);
app.use("/help-support",require('./Routes/Supports/SupportsOfHelpRoutes'),);

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));

