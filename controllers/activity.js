import User from "../models/user";
import getMatchingUnitsFromCoordinates from "../gusDrivers/unitFinding/getMatchingUnitsFromCoordinates";

const coordinates = async (req, res) => {
    const {body: {coordinates, set}, params: {userId}} = req.value;

    try {
        const matchingUnits = await getMatchingUnitsFromCoordinates(coordinates);
        const matchingVoivodeship = matchingUnits.find( unit => unit.level === 2);

        if(set)
            await User.findByIdAndUpdate(userId, {gusUnitId: matchingVoivodeship.id});

        res.status(200).json({success: true, matchingUnits});
    }
    catch (error) {
        res.status(400).json({success: false, matchingUnits: [], error});
    }

};

const daily = async (req, res) => {
    const {
        body: {waterConsumption, commute, plasticContainers},
        params: {userId}
    } = req.value;




};

export default {coordinates, daily};
