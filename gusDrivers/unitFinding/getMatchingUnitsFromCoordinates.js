import gusRequest from "../gusRequest";
import getRegionFromCoordinates from "./getRegionFromCoordinates";

export default async (coordinates) => {

    const region = await getRegionFromCoordinates(coordinates);

    const voivodeship = await getVoivodeshipFromGus(region.State);
    const powiatList =  await getPowiatListFromGus(voivodeship.id, region.County);

    return [...powiatList, voivodeship];

};

export const getVoivodeshipFromGus = async (voivodeshipName) => {
    const gusResponse =  await gusRequest("/units/search", {level: "2", name: voivodeshipName});
    return gusResponse?.results?.find?.( voivodeship => voivodeship.name === voivodeshipName.toUpperCase());
};

export const getPowiatListFromGus = async (voivodeshipId, powiatName) => {
    const gusResponse = await gusRequest(`/units/search`, {level: "5", "parent-id": voivodeshipId, name: powiatName});
    return gusResponse?.results;
};
