import Unit from "../../unit";

export default async function({waterConsumption, commute, plasticWeight}) {

    const [powiat, voivodeship] = await Promise.all(Unit.findById(this.gusPowiatUnitId), Unit.findById(this.gusVoivodeshipUnitId));

    //do some magic here

    return {};
}
