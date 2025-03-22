const mongoose = require("mongoose");

const assetSchema = mongoose.Schema({
    name: String,
    value: Number
});

const tenderSchema = mongoose.Schema({
    name: String,
    value: Number
});

const teamSchema = mongoose.Schema({
    teamNumber: { type: String, required: true, unique: true },
    teamName: { type: String, required: true },
    wallet: { type: Number, required: true },
    valuation: { type: Number, default: 0 },
    assets: [assetSchema],  // Array of assets (5 max)
    tenders: [tenderSchema], // Array of tenders (2 max)
    allianceName: { type: String, default: "None" },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);  // ✅ Use CommonJS
