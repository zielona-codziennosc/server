import User from '../models/user';

const get = async (req, res) => {
    const { userId } = req.value.params;
    const user = await User.findById(userId).select("email nickname lifestyleBetterThan totalSavings");
    res.status(200).json(user);
};

const update = async (req, res) => {
    const { userId } = req.value.params;

    await User.findByIdAndUpdate(userId, req.value.body);

    res.status(201).json({ success: true });
};

const remove = async (req, res) => {
    const { userId } = req.value.params;
    await User.findByIdAndRemove(userId);
    res.status(202).json({ success: true });
};


export default { get, remove, update }
