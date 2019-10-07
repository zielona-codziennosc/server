import bcrypt from 'bcryptjs';

export default async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}
