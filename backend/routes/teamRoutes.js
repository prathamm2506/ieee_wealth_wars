const express = require("express");
const bcrypt = require("bcryptjs");
const Team = require("../models/Team.js");

const router = express.Router();

// signup api
router.post("/signup", async (req, res) => {
    try {
        const { teamNumber, teamName, wallet, password, assets, tenders, allianceName } = req.body;

        const existingTeam = await Team.findOne({ teamNumber });
        if (existingTeam) {
            return res.status(400).json({ message: "Team number already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const assetsTotal = assets?.reduce((sum, asset) => sum + asset.value, 0) || 0;
        const tendersTotal = tenders?.reduce((sum, tender) => sum + tender.value, 0) || 0;
        const valuation = (wallet || 0) + assetsTotal + tendersTotal;

        const newTeam = new Team({
            teamNumber,
            teamName,
            wallet,
            valuation,
            password: hashedPassword,
            assets,
            tenders,
            allianceName: allianceName || "None",
        });

        await newTeam.save();
        res.status(201).json({ message: "Team registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login API
router.post("/login", async (req, res) => {
    try {
        const { teamNumber, password } = req.body;

        // Check if the team exists
        const team = await Team.findOne({ teamNumber });
        if (!team) {
            return res.status(400).json({ message: "Invalid team number or password" });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, team.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid team number or password" });
        }

        // Exclude password from response
        const { password: _, ...teamData } = team.toObject();

        res.status(200).json({
            message: "Login successful",
            team: teamData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// fetch all the teams
router.get("/all", async (req, res) => {
    try {
        const teams = await Team.find(); // Fetch all teams from the database
        res.status(200).json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// edit team details
router.put("/edit/:teamNumber", async (req, res) => {
    try {
        const { teamNumber } = req.params;
        const { wallet, assets, tenders, allianceName } = req.body;

        // Find the team by teamNumber
        const team = await Team.findOne({ teamNumber });
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        // Update fields if provided
        if (wallet !== undefined) team.wallet = wallet;
        if (assets) team.assets = assets;
        if (tenders) team.tenders = tenders;
        if (allianceName !== undefined) team.allianceName = allianceName;

        // Recalculate valuation
        const assetsTotal = team.assets.reduce((sum, asset) => sum + asset.value, 0);
        const tendersTotal = team.tenders.reduce((sum, tender) => sum + tender.value, 0);
        team.valuation = team.wallet + assetsTotal + tendersTotal;

        // Save updated team
        await team.save();

        res.status(200).json({ message: "Team updated successfully", team });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// for the user
router.get("/:teamNumber", async (req, res) => {
    try {
        const teamNumber = parseInt(req.params.teamNumber, 10); // Ensure it's a number
        if (isNaN(teamNumber)) {
            return res.status(400).json({ message: "Invalid team number" });
        }

        const team = await Team.findOne({ teamNumber });
        if (!team) return res.status(404).json({ message: "Team not found" });

        res.json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});




module.exports = router;
