
const bodyParser = require ("body-parser");
const cors = require ("cors");
const pool = require("./db");
require('dotenv').config();
const courseroutes = require("./models/course");
// const chatroutes = require("./models/chat");
const blogroutes = require("./models/blog");
const path = require('path')
const forumroutes=require("./models/forum");
const paymentroutes=require("./models/payment")





const express = require("express")
var app = express();
var server = app.listen(3010);
var io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});


let clients = [];
let messageList = [];

io.on('connection', (socket) => {
  clients.push(socket);
  socket.emit('messageList', messageList);
  socket.on('onMessage', data => {
      messageList.push({
          message:data.message,
          senderId: socket.id
      });
      clients.map((cl)=> cl.emit('messageList', messageList))

  });

  socket.on('disconnect', () => {
      clients = clients.filter((client, index) => client.id !== socket.id);
  });
});

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
// app.use("/message",chatroutes);
app.use("/blog",blogroutes);
app.use("/forums",forumroutes);
app.use("/payment",paymentroutes);



const PORT =process.env.PORT || 3000




app.listen(8052, () => {
    console.log(`Server is running on port 8052`)
}
)

//http://localhost:3000/chat



app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({type:"application/json"}));

