const express = require('express')
const router = express.Router()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


router.post("/create-checkout-session", async (req, res) => {
    const {products} = req.body;
    const lineItems = products.map((product)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:product.title,
            },
            unit_amount:product.price * 100,
        },
        quantity:product.quantity
    }));

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ id: session.id })
})

module.exports = router;