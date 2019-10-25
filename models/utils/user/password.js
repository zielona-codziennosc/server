import bcrypt from "bcryptjs";

export const hashPassword = function(next) {
    const user = this;

    if (user.isModified("password")) {
        console.log("hehehe");
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
    }
    next();
};

export const hashPasswordAfterUpdate = function(next) {

    if("password" in this._update) {
        const salt = bcrypt.genSaltSync(10);
        this._update.password = bcrypt.hashSync(this._update.password, salt);
    }

    next();
};


export const checkPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
