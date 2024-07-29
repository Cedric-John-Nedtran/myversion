//require env file
require('dotenv').config();

//require packages and routes
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

//express app
const app = express();

//middleware
app.use(express.json());
app.use(express.static('public'));      // to access the public folder for the css and images

// view engine
app.set('view engine', 'ejs');

//database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('listening on port', process.env.PORT)});
    })
    .catch((error) => {
        console.log(error)

        app.use((req, res) => {
            res.status(500).json({ error: error.message });
        })
    })

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

//routes
app.get('/', (req, res)=>{          //blank link leads to the user sign up page
    res.redirect('/user/login');
})

app.get('/user/login', userRoutes, (req, res) => 
    res.render('userLogin', {title: "User Log-in"}));  //Log in Page for Users

app.get('/admin/login', adminRoutes, (req, res) => 
    res.render('adminLogin', {title: "Admin Log-in"})); //Log in Page for Admin

app.get('/user/signup', userRoutes, (req,res) =>{
    res.render('userSignup', {title: 'User Sign-up'});  // Sign up page for users
});

app.get('/employee/login', employeeRoutes, (req, res)=>{
    res.render('employeeLogin', {title: 'Employee Log-in'}); //Log in for Employees
});

app.get('/employee/signup', employeeRoutes, (req, res)=>{
    res.render('employeeSignup', {title: 'Employee Sign-up'}); //Sign up for Employees
})

app.use((req, res) =>{                  // 404 error otherwise
    res.status(404).render('404', {title:'404'});
});
