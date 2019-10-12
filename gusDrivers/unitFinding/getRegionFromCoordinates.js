import fetch from "node-fetch";

export default async (coordinates) => {
    const {HERE_APP_ID, HERE_APP_SECRET} = process.env;

    const requestUrl = `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=${coordinates}&mode=retrieveAddresses&maxresults=1&gen=9&app_id=${HERE_APP_ID}&app_code=${HERE_APP_SECRET}`;

    const response = await fetch(requestUrl).then(result => result.json());

    if(!response)
        return false;

    const {Response: {View}} = response;
    let {Location: {Address: {State, County, Country}}} = View[0].Result[0];

    if(Country !== "POL")
        throw "Fed coordinates do not point to the Polish state territory.";

    State = State.split("Woj.")?.[1]?.trim?.() || State;
    County = County.split("Powiat")?.[1]?.trim?.() || County;

    return {State, County};
}
