const express = require("express");
const asyncMiddleware = require('../middleware/catchAsyncErrors');
const fs = require('fs');
const path = require('path');

// reading the states whole json file
const statesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'district_list.json'), 'utf-8'));

const fetchDistricts = async (req, res) => {
    const { stateName } = req.body;
    if (!stateName) {
        return res.status(400).json({ error: 'State name is required' });
    }
    // Find the state in the JSON data
    const state = statesData.states.find(s => s.state.toLowerCase() === stateName.toLowerCase());
    if (state) {
        res.status(200).json({districts: state.districts });
    } else {
        res.status(404).json({ error: 'State not found' });
    }
}

const router = express.Router();

// get districts
router.route('/districts').post(asyncMiddleware(fetchDistricts)); 

module.exports = router;