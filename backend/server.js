require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const authRoutes = require('./routes/authroutes');
const emaiRoutes= require('./routes/emailRoutes');
const taskRoutes = require('./routes/taskRoutes')
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');


const port = process.env.PORT || 4000;
const app=express();
app.use(cookieParser());
const cors = require('cors');
app.use(cors());
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
  app.get("/api/test",(req,res)=>{
    res.json("hello");
  })
  //routes
  app.use('/api', authRoutes); 
  app.use('/api', emaiRoutes);
  app.use('/api/task',taskRoutes);
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 4000; // Vercel provides the port dynamically
    app.listen(port, () => {
  console.log(`Connected to Database and listening on port ${port}`);
});
  })
  .catch((error) => {
    console.error(error);
  });

  app.get('*', checkUser);

  
