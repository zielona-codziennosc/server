import {grabStatisticalVariables, updateUnitsWithVariables} from "./utils";


export default async () => {
    const statisticalVariables = await grabStatisticalVariables();

    await updateUnitsWithVariables(statisticalVariables);
}
