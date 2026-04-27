const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth-routes');
const adminRouter = require('./routes/admin-routes');
const commonRouter = require('./routes/common-routes');
const userRouter = require('./routes/user-routes');
const connectCloudinary = require('./config/cloudnary');
const passport = require('./config/passport');
const session = require('express-session');
const auth = require('./middleware/auth');
const connectDB = require('./config/db');

connectDB();

connectCloudinary().then(() => console.log('Cloudinary connected successfully')).catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'https://www.goodberry.store',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma',
        ],
        credentials: true,
    })
);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
      })
}));
  
app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/admin',adminRouter);
app.use('/api/user', userRouter);
app.use('/api', commonRouter);

app.use('*', (req, res) => {
    res.json({
        message: "Not found"
    })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
