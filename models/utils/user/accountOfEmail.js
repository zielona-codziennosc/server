export default async function(email) {

    const seekedUser = await this.findOne({email});

    if(seekedUser)
        return seekedUser;

    const newUser = new this({email});

    await newUser.save();

    return newUser;
}
