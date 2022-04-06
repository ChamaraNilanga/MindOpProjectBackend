const express = require("express");
const bodyParser = require ("body-parser");
const cors = require ("cors");
const app = express(); 
const pool = require("./db");
const courseroutes = require("./models/course");
const chatroutes = require("./models/chat");
const blogroutes = require("./models/blog");
const path = require('path')

app.get("/",(req,res) =>{
    res.send("hello");
    console.log("server");
});


app.use(express.json());
app.use("/coursedetails",courseroutes);
app.use("/message",chatroutes);
app.use("/blog",blogroutes);



const PUBLISHABLE_KEY="pk_test_51KgMcOC0OWu3ZsneXN1dSucXI34DGfatpaJ1WyOTa1Q6ju541yRxGARpdwxywtboksGRNF818yb0QATP09YljJwI007Nei7X9f"


const SECRET_KEY="sk_test_51KgMcOC0OWu3ZsneyNMClkFAhqIh3SmAxBOgPxRqX1JNasiHk3UlXyoJnqIOMw8lecr2WpmITLkhKCvvEUzggqag00f5TFecxH"

const stripe = require('stripe')(SECRET_KEY)



app.use(bodyParser.urlencoded({extented:false}))
app.use(bodyParser.json())

const PORT =process.env.PORT || 3000

app.set("view engine","ejs")

app.get('/',(rew,res) => {
     res.render('Home',{
         key:PUBLISHABLE_KEY
     })
    })

app.post('/payment',(req,res) => {
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        name:'John Paul',
        address:{
            line1:'43 mountain lotus road',
            postal_code:'28444',
            state:'Delhi',
            country:'India'
        }
    })
  .then((customer) => {
      return stripe.charges.create({
          amount:7000,
          description:'Web develop',
          currency:'USD',
          customer:customer.id
      })
  })
  .then((charge) =>{
      console.log(charge)
      res.send("Success")
  })
  .catch((err) =>{
      res.send(err)
  })
})


app.listen(8052, () => {
    console.log(`Server is running on port 8052`)
}
)

//http://localhost:3000/chat



app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({type:"application/json"}));

