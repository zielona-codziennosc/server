export default async function(userId, units) {

    const updates = {
        gusVoivodeshipUnitId: units?.voivodeship?.gusId
    };

    if(units?.powiaty?.length === 1)
        updates.gusPowiatUnitId = units?.powiaty?.[0]?.gusId;

    await this.findByIdAndUpdate(userId, updates);
}
