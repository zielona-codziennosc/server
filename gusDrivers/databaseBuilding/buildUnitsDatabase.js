import Unit from "../../models/unit";
import {getAllPowiaty, grabStatisticalVariables, mergeVariablesWithUnits, saveUnits} from "./utils";

export default async () => {

    const allPowiaty = await getAllPowiaty();
    const statisticalVariables = await grabStatisticalVariables();

    const detailedUnits = mergeVariablesWithUnits(statisticalVariables, allPowiaty);

    await saveUnits(detailedUnits);

}
