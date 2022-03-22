const express = require("express");
const bodyParser = require ("body-parser");
const cors = require ("cors");
const app = express(); 
const pool = require("./db");
const courseroutes = require("./models/course");
const chatroutes = require("./models/chat");
const forumroutes=require("./models/forum");

app.get("/",(req,res) =>{
    res.send("hello");
    console.log("server");
});


app.use(express.json());
app.use("/coursedetails",courseroutes);
app.use("/forums",forumroutes);




app.listen(8070, () => {
    console.log("server is in port 8070");
});

//http://localhost:3000/chat



app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({type:"application/json"}));