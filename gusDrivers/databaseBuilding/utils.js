import gusRequest from "../gusRequest";

export const getAllPowiaty = async () => {

    let allPowiaty = [];

    for(let i=0; i<1; i++) { //TODO: increase i<1 to i<5, 1 is to prevent us from going over gus api limit
        const powiatySheet = await gusRequest(`/units`, {level: "5", page: i, "page-size": "100"});

        allPowiaty = [...allPowiaty, ...powiatySheet.results];

        if(!powiatySheet?.links?.next)
            break;
    }


    return allPowiaty;
};

export const grabPowiatVariables = async (powiat) => {

};
