import gusRequest from "../../gusRequest";
import {sleep, normalizeGusResultArray, injectVoivodeshipIdToPowiaty, stampVoivodeshipsFlag} from "./index";

export default async () => {
    const allVoivodeships = await getAllVoivodeships();

    const allPowiaty = await getAllPowiaty(allVoivodeships);

    return {...allVoivodeships, ...allPowiaty};
};

const getAllVoivodeships = async () => {
    let allVoivodeships = [];

    for(let i=0; i<5; i++) {
        const voivodeshipSheet = await gusRequest(`/units`, {level: "2", page: i, "page-size": "100"});

        allVoivodeships = [...allVoivodeships, ...voivodeshipSheet.results];

        if(!voivodeshipSheet?.links?.next)
            break;
    }

    stampVoivodeshipsFlag(allVoivodeships);

    return normalizeGusResultArray(allVoivodeships);
};

const getAllPowiaty = async (voivodeships) => {
    let allPowiaty = {};

    for(const voivodeshipGusid in voivodeships) {
        const currentPowiaty = await getPowiatyFromVoivodeship(voivodeshipGusid);

        injectVoivodeshipIdToPowiaty(voivodeshipGusid, currentPowiaty);

        await sleep(125);

        allPowiaty = {...allPowiaty, ...currentPowiaty};
    }


    return allPowiaty;
};

const getPowiatyFromVoivodeship = async (voivodeshipGusId) => {
    let allPowiaty = [];

    for(let page = 0; page < 2; page++) {
        const powiatySheet = await gusRequest(`/units`,
            {"parent-id": voivodeshipGusId, page, level: "5", "page-size": "100"});

        allPowiaty = [...allPowiaty, ...powiatySheet.results];

        if(!powiatySheet?.links?.next)
            break;
        page++;
    }

    return normalizeGusResultArray(allPowiaty);
};
