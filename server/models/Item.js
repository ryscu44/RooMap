const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
});

const ItemModel = mongoose.model("Item", itemSchema);
module.exports = ItemModel