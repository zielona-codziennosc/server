import bcrypt from "bcryptjs";

export default function(next) {
    const user = this;

    if(user.isModified("password")) {
        console.log("hehehe");
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
    }
    next();
}
