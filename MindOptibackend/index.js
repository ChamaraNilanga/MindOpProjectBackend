const express = require("express");
const bodyParser = require ("body-parser");
const cors = require ("cors");
const app = express(); 
const pool = require("./db");
require('dotenv').config();
const courseroutes = require("./models/course");
const chatroutes = require("./models/chat");
const userroutes = require("./models/user");
const assignmentroutes = require("./models/assignment");
const blogroutes = require("./models/blog");
const path = require('path')
const forumroutes=require("./models/forum");

app.get("/",(req,res) =>{
    res.send("hello");
    console.log("server");
});


app.use(express.json());
app.use(bodyParser.urlencoded({extented:false}))
app.use(bodyParser.json())

app.use("/coursedetails",courseroutes);

app.use("/userdetails",userroutes);
app.use("/assignmentdetails",assignmentroutes);

app.use("/message",chatroutes);
app.use("/blog",blogroutes);
app.use("/forums",forumroutes);




const PORT =process.env.PORT || 3000




app.listen(8052, () => {
    console.log(`Server is running on port 8052`)
}
)

//http://localhost:3000/chat



app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({type:"application/json"}));

