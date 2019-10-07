import bcrypt from "bcryptjs";

export default function(next) {

    if("password" in this._update) {
        const salt = bcrypt.genSaltSync(10);
        this._update.password = bcrypt.hashSync(this._update.password, salt);
    }

    next();
}
