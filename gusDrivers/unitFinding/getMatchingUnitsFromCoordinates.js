import gusRequest from "../gusRequest";
import Unit from "../../models/unit";
import getRegionFromCoordinates from "./getRegionFromCoordinates";

export default async (coordinates) => {

    const region = await getRegionFromCoordinates(coordinates);

    const voivodeship = await getMatchingVoivodeship(region.State);
    const powiatList =  await getMatchingPowiatsFromVoivodeship(voivodeship.gusId, region.County);

    return [...powiatList, voivodeship];
};

export const getMatchingVoivodeship = async voivodeshipName => {
    const voivodeshipRegex = new RegExp(voivodeshipName);

    return await Unit.findOne({name: { $regex: voivodeshipRegex, $options: 'ig' }});
};

export const getMatchingPowiatsFromVoivodeship = async (voivodeshipGusId, powiatName) => {
    const powiatRegex = new RegExp(powiatName);

    return await Unit.find({
        name: { $regex: powiatRegex, $options: 'ig'},
        voivodeshipGusId
    });
};
