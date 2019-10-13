import User from "../models/user";
import getMatchingUnitsFromCoordinates from "../gusDrivers/unitFinding/getMatchingUnitsFromCoordinates";

const coordinates = async (req, res) => {
    const {body: {coordinates, set}, params: {userId}} = req.value;

    try {
        const matchingUnits = await getMatchingUnitsFromCoordinates(coordinates);
        const matchingVoivodeship = matchingUnits.find( unit => unit.level === 2);

        if(set)
            await User.findByIdAndUpdate(userId, {gusVoivodeshipUnitId: matchingVoivodeship.id});

        res.status(200).json({success: true, matchingUnits});
    }
    catch (error) {
        res.status(400).json({success: false, matchingUnits: [], error});
    }

};

const daily = async (req, res) => {
    const {body, params: {userId}} = req.value;

    const user = await User.findById(userId);

    const result = await user.todaysActivity(body);

    res.status(200).json({success: true,
        data: {
            totalPlasticSaved: user.totalPlasticSaved,
            totalWaterSaved: user.totalWaterSaved,
            totalCarbonSaved: user.totalCarbonSaved,
            ...result
        }
    });
};

const addPhoto = async (req, res) => {

    res.status(200).json({success: true});
};

export default {coordinates, daily, addPhoto};
