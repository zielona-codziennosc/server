export default async function({email, given_name}) {

    const seekedUser = await this.findOne({email});

    if(seekedUser)
        return seekedUser;

    const newUser = new this({email, name: given_name});

    await newUser.save();

    return newUser;
}
