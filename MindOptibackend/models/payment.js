const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/paymentcontroller");


app.use(express.json());
app.use((req,res,next)=>{
next();
});

router.post("/payment/:sid", controller.setPayment);
router.post("/create-checkout-session/:sid&:mid", controller.createpayment);
router.get("/getdetails/:mid",controller.getPaymentdetails);
// app.post("/create-checkout-session", async (req, res) => {
//     let courseDetails = req.body
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: [
//             {
//                 price_data: {
//                     currency: "lkr",
//                     product_data: {
//                         name: "T-shirt",
//                     },
//                     unit_amount: 40000,
//                 },
//                 quantity: 1,
//             },
//         ],
//         mode: "payment",
//         success_url: `${process.env.CLIENT_NAME}/stripepaymentsuccess`,
//         cancel_url: `${process.env.CLIENT_NAME}/stripepaymentcancel`,
//     });
//     res.status(200).json({ id: session.id });
//     // res.json({ id: session.id });
//   });


// router.delete("router.get("/", controller.getblog);",controller.deleteblog);
// router.put("/updateblog/:id",controller.updateblog);

   

module.exports=router;