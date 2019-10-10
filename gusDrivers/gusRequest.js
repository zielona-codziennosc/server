import fetch from "node-fetch";

export default async (endpoint, query={}) => {

    let queryString = "?";

    Object.entries(query).forEach(([key, value]) => queryString += (encodeURI(key)+"="+encodeURI(value)+"&"));

    queryString += "&format=json";


    return await fetch(
        `https://bdl.stat.gov.pl/api/v1/${endpoint}${queryString}`,
        {
            headers: {
                "X-ClientId": process.env.GUS_API_KEY
            }
        }
    ).then(response => response.json());
}
