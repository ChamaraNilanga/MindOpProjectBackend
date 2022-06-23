const express = require("express");
const bodyParser = require ("body-parser");
const cors = require ("cors");
const app = express(); 
const pool = require("./db");
require('dotenv').config();
const courseroutes = require("./models/course");
const chatroutes = require("./models/chat");
const blogroutes = require("./models/blog");
const path = require('path')
const forumroutes=require("./models/forum");
const userroutes = require("./models/user");
const assignmentroutes = require("./models/assignment");

app.get("/",(req,res) =>{
    res.send("hello");
    console.log("server");
});

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use("/coursedetails",courseroutes);
app.use("/message",chatroutes);
app.use("/blog",blogroutes);
app.use("/forums",forumroutes);
app.use("/userdetails",userroutes);
app.use("/assignmentdetails",assignmentroutes);



const PORT =process.env.PORT || 3000




app.listen(8070, () => {
    console.log(`Server is running on port 8070`)
}
)

//http://localhost:3000/chat



app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({type:"application/json"}));

