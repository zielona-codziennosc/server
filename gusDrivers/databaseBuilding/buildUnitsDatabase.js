import Unit from "../../models/unit";
import { getAllPowiaty, grabPowiatVariables } from "./utils";

export default async () => {

    const allPowiaty = await getAllPowiaty();

    const detailedPowiat = await grabPowiatVariables(allPowiaty[0]);
}
