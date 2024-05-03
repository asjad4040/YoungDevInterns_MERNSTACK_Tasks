const express = require('express');
const router = express.Router();
const fetchAdmin = require('../../middleware/fetchAdmin');
const AnalgesicMed = require('../../models/Analgesics');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../../middleware/fetchAdmin');

//Route#01: Add a medicine
router.post('/addanalgesic', fetchAdmin, [
    body('title', 'Enter a valid name').isLength({ min: 3 }),
    body('description', 'Enter a description for the medicine').isLength({ min: 5 }),
    body('quantity', 'Enter quantity of medicine').exists(),
    body('unitPrice', 'Enter unit price of the medicine').exists()
], async (req, res) => {
    try {
        const { title, description, quantity, unitPrice } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        const analgesic = new AnalgesicMed({
            title, description, quantity, unitPrice, admin: req.admin.id,
        })
        const savedMed = await analgesic.save();
        res.json(savedMed);
        console.log(savedMed);
    } catch (error) {
        console.error(error.message());
        res.status(500).send("Internal Server Error");
    }
});

//Route# 02: update a medicine
router.put('/updateanalgesic/:id', fetchAdmin, async (req, res) => {
    const { title, description, quantity, unitPrice } = req.body;
    try {
        const newAnalgesic = {}
        if (title) {
            newAnalgesic.title = title;
        }
        if (description) {
            newAnalgesic.description = description;
        }
        if (quantity) {
            newAnalgesic.quantity = quantity;
        }
        if (unitPrice) {
            newAnalgesic.unitPrice = unitPrice;
        }
        let analgesic = await AnalgesicMed.findById(req.params.id);
        if (!analgesic) return res.status(404).send("Not Found");
        // if (analgesic.admin.toString !== req.admin.id) return res.status(401).send("Not Allowed");
        analgesic = await AnalgesicMed.findByIdAndUpdate(req.params.id, { $set: newAnalgesic }, { new: true });
        res.json({ analgesic });
    } catch (error) {
        console.error(error.message());
        res.status(500).send("Internal Server Error");
    }
});

//Route# 03: Delete a medicine
router.delete('/deleteanalgesic/:id', fetchAdmin, async (req, res) => {
    try {
        let analgesic = await AnalgesicMed.findById(req.params.id);
        if (!analgesic) return res.status(404).send("Not Found");
        // if (analgesic.admin.toString !== req.admin.id) return res.status(401).send("Not Allowed");
        analgesic = await AnalgesicMed.findByIdAndDelete(req.params.id);
        res.json({ "success": "Medicine has been deleted", analgesic });

    } catch (error) {
        console.error(error.message());
        res.status(500).send("Internal Server Error");
    }
})

//Route# 04: Fetch Analgesics
router.get('/fetchanalgesic', async (req, res) => {
    try {
       const data=await AnalgesicMed.find();
       res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;
