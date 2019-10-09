import User from '../models/user';

const get = async (req, res) => {
    const { userId } = req.value.params;
    const user = await User.findById(userId).select("email nickname profile_photo APIs");
    res.status(200).json(user);
};


const remove = async (req, res) => {
    const { userId } = req.value.params;
    await User.findByIdAndRemove(userId);
    res.status(202).json({ success: true });
};

export default { get, remove }
