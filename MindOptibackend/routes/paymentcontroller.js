const pool = require("../db");
const cors = require("cors");
const express = require("express");
require("dotenv").config();

const stripe = require("stripe")("sk_test_51KgMcOC0OWu3ZsneyNMClkFAhqIh3SmAxBOgPxRqX1JNasiHk3UlXyoJnqIOMw8lecr2WpmITLkhKCvvEUzggqag00f5TFecxH");


const app = express();

// middlewares
app.use(express.json());
app.use(cors());

const setPayment =async(req,res)=>{
// routes
app.get("/", async (req, res) => {
  res.json("Hello this is stripe setup server.");
});
}

app.post("/create-checkout-session", async (req, res) => {
  let courseDetails = req.body
  const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
          {
              price_data: {
                  currency: "lkr",
                  product_data: {
                      name: "T-shirt",
                  },
                  unit_amount: 40000,
              },
              quantity: 1,
          },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_NAME}/stripepaymentsuccess`,
      cancel_url: `${process.env.CLIENT_NAME}/stripepaymentcancel`,
  });
  res.status(200).json({ id: session.id });
  // res.json({ id: session.id });
});



const createpayment = async(req,res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
        {
            price_data: {
                currency: "lkr",
                product_data: {
                    name: "T-shirt",
                },
                unit_amount: 40000,
            },
            quantity: 1,
        },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_NAME}/stripepaymentsuccess`,
    cancel_url: `${process.env.CLIENT_NAME}/stripepaymentcancel`,
});
res.status(200).json({ id: session.id });
   }


const addPayment = async(req,res) => {
  const { amount} =req.body;
  const sid = req.params.sid;
  const mid =req.params.mid;
  //check already added
  await pool.query("INSERT INTO Payment (amount,moduleid,studentid,paidtime) values ($1,$2,$3,CURRENT_TIMESTAMP)",[amount,mid,sid],(error,results)=>{
         if (error) throw  error;
         res.status(200).send("added payment");
     
     });
   }

   //get payment by module id
   const getPaymentdetails = async(req,res) => {
    const mid=req.params.mid;
    
    await pool.query("SELECT paymentid,amount,studentid,paidtime FROM payment WHERE moduleid=$1",[mid],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
    };




module.exports={
    setPayment,
    addPayment,
    getPaymentdetails,
    createpayment
   
}