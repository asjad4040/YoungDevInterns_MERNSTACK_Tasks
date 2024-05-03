const express = require('express');
const router = express.Router();
const AnalgesicMed = require('../../models/Analgesics');
const Users = require('../../models/Users');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../../middleware/fetchUser');

//Route# 01: Add to cart
router.post('/addtocart/:id', fetchUser, [
    body('quantity', 'Enter the quantity of medicine').isLength({ min: 1 }),
], async (req, res) => {
    const { quantity } = req.body;
    try {
        const user = await Users.findById(req.user.id);
        const medicine = await AnalgesicMed.findById(req.params.id);
        if (!user || !medicine) {
            return res.status(404).json({ message: 'User or Medicine not found' });
        }
        medicine.quantity -= quantity;
        await medicine.save();
        user.cart.push(medicine);
        await user.save();
        res.json({ message: 'Medicine added to cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//Route# 02: Fetch User Specific Cart Details
router.get('/fetchcart',fetchUser,async(req,res)=>{
    try {
        const userCart=await Users.findById(req.user.id).populate('cart');
        
        res.send(userCart.cart);
        console.log(userCart.cart);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports=router;