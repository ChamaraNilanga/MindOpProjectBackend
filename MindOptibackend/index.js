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
const categoryroutes = require("./models/category");
const questionroutes = require("./models/question");
const quizroutes = require("./models/quiz");

app.get("/",(req,res) =>{
    res.send("hello");
    console.log("server");
});


app.use(express.json());
app.use(bodyParser.urlencoded({extented:false}))
app.use(bodyParser.json())

app.use("/coursedetails",courseroutes);
app.use("/message",chatroutes);
app.use("/blog",blogroutes);
app.use("/forums",forumroutes);
app.use("/categorydetails",categoryroutes);
app.use("/questiondetails",questionroutes);
app.use("/quizdetails",quizroutes);

const PORT =process.env.PORT || 8070




app.listen(8070, () => {
    console.log("server is in port 8070");
});

//http://localhost:8070/cate/add



app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({type:"application/json"}));

