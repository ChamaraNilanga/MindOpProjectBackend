const pool = require("../db");
const cors = require("cors");
const express = require("express");
require("dotenv").config();

const stripe = require("stripe")("sk_test_51KgMcOC0OWu3ZsneyNMClkFAhqIh3SmAxBOgPxRqX1JNasiHk3UlXyoJnqIOMw8lecr2WpmITLkhKCvvEUzggqag00f5TFecxH");
const { v4: uuid } = require("uuid");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send(`Test Stripe Secret Key - ${"sk_test_51KgMcOC0OWu3ZsneyNMClkFAhqIh3SmAxBOgPxRqX1JNasiHk3UlXyoJnqIOMw8lecr2WpmITLkhKCvvEUzggqag00f5TFecxH"}`);
});

const setPayment=async (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT ", product);
  console.log("PRICE ", product.price);
  const idempotencyKey = uuid(); // this key is used so that you do not double charge in case of error

  let request = stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email, //in case you want mail
          description: `purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));

  return request;
};


module.exports={
    setPayment
}