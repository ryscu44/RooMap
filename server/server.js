const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors');
const ItemModel = require("./models/Item")

mongoose.connect("mongodb://localhost:27017/rootracker")
app.use(cors());
app.use(express.json())

app.listen(5000, () => {console.log(
    "Server started on port 5000"
)})

app.get("/getItems", async (req, res) => {
        ItemModel.find()
        .then(markers => res.json(markers))
        .catch(err => res.json(err))
    
});

app.post("/addMarker", async (req,res) => {
    const { latitude, longitude, alive, pouch, sex, joey, joeyAlive, userPos } = req.body;
    try {
        const newItem = newItemModel({
            latitude,
            longitude,
            alive,
            pouch, sex, joey, joeyAlive, userPos
        });
        const savedItem = await newItem.save();
        res.json(savedItem)
    } catch (err) {
        res.status(500).json({ error: error.message })
    }
})

