const express = require('express');
const mongoose = require('mongoose');
const Users = require('./models/userModel')
const session = require('express-session');
const Forms = require('./models/formModel')
const Address = require('./models/addressModel')
require('dotenv').config();
const cors = require('cors')



const MongoStore = require('connect-mongo'); // MongoDB session store

const app = express();
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const sessionSecret = 'make a secret string';

var dbURL =  process.env.MONGO_URL||'mongodb+srv://mlee0125:Wj99748838)@cluster0.zerxd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'; // insert your database URL here
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const store = MongoStore.create({
  mongoUrl: dbURL,
  secret: sessionSecret,
  touchAfter: 24 * 60 * 60
})

const sessionConfig = {
  store,
  name: 'session',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}

app.use(session(sessionConfig));

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(e => next(e))
  }
}

const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send("Need to login");
  }
  next();
}

app.use((req, res, next) => {
  req.requestTime = Date.now();
  console.log(req.method, req.path);
  next();
});

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validatePassword(password){
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
  return re.test(password)
}
  

app.post('/api/register',wrapAsync(async function(req,res){
  const {name,email,password} = req.body;
  if (!validateEmail(email))
        return res.status(400).json({ msg: "Invalid Email." });
  if (!validatePassword(password))
        return res.status(400).json({ msg: "Invalid Password." });
  
  const locations = new Address({location: "", locationDetail: ""});
  await locations.save();
  const user = new Users({profileImg: 'defaultProfile.png', name,email,password, locations})
  await user.save();
  req.session.userId = user._id;
  res.json(user)
}));

app.get('/', async function(req,res){
  res.send(await Users.find({}).populate('locations'));
  
})

app.post('/api/login', async function(req,res){
  //console.log("LOGIN CALLED")
  const {email, password} = req.body;
  const user =  await Users.findAndValidate(email,password)
  if (user){
    req.session.userId = user._id;
    console.log("ㄴ-----> ", req.session.userId)
    // const newUser = user.populate('locations')
    res.json(user);
  }
  else{
    console.log("FAIL : PASSWORD DOESN'T MATCH", user)
    res.send("Login Failed")
    //res.sendStatus(400)
    

  }
});


app.get('/api/userid', async function (req,res) {
  console.log(">>",req.session,"<<")
});

app.post('/api/logout', wrapAsync(async function(req,res){
  req.session.userId = null;
  res.sendStatus(204);
}));


app.use('/api/users/:id', (req,res,next)=>{
  console.log("Request involving a specific user")
  next();
})
app.get('/api/users', wrapAsync(async function (req,res) {
  let users = await Users.findById({})
  res.json(users);
}));

app.get('/api/currentuser',wrapAsync(async function (req,res){ //requireLogin,
  const user = await Users.findById(req.session.userId).populate('locations');
  res.json(user);
}))

// requireLogin,
app.get('/api/users/:id', wrapAsync(async function (req,res,next) {
  let id = req.params.id;
  if(mongoose.isValidObjectId(id)){
    const user = await Users.findById(id).populate('locations');
    if( user ) {
      res.json(user);
      return;
    } else {
      res.send("No User with id: " + id);
      throw new Error('User Not Found');
    }
  }else{
    throw new Error('Invalid User Id');
  }
}));

app.delete('/api/users/:id', wrapAsync(async function(req,res){
  const id = req.params.id;
  const result = await Users.findByIdAndDelete(id);
  console.log('Deleted succesfully:' + result);
  res.json(result);
}))

app.put('/api/users/:id', wrapAsync(async function(req,res){
  const id = req.params.id;
  const {name,email,location,profileImg, locationDetail} = req.body;
  const locations = new Address({ location: location, locationDetail: locationDetail})
  await locations.save()
  
  console.log("Put with id : " + id, ", body : " + JSON.stringify(req.body));
  const user = await Users.findByIdAndUpdate(id,{name,email,locations,profileImg},
      {runValidators:true});
  // res.json(user)

  res.sendStatus(204);
}));

// app.get('/', wrapAsync(async function (req, res){
//   // const test = await Users.find({});
//   res.send("");
// }));

app.post('/api/users', wrapAsync(async function (req,res) {
  console.log("Posted with body: " + JSON.stringify(req.body));


  const locations = new Address({location: req.body.location, locationDetail: req.body.loctionDetail});
  await locations.save()
  const newUsers = new Users({
    name: req.body.name,
    email: req.body.email,
    locations: locations,
    profileImg:req.body.profileImg,
    password : req.body.password
  })
  await newUsers.save();
  res.json(newUsers);

}));

app.get('/api/form', wrapAsync(async function (req, res){
  console.log("api/form", req.session.userId)
  const forms = await Forms.find({owner:req.session.userId})
  res.json(forms);
}))

const formRouter = require('./routes/formRouter')
app.use('/api/form', formRouter);

app.use((err, req, res, next) => {
  console.log("Error handling called");
  res.statusMessage = err.message;
  console.log(err.message)

  if (err.name === 'ValidationError') {
    res.status(400).end();
  } else {
    res.status(500).end();
  }
})

port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('server started!')
});