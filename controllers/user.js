import User from '../models/user';

const add = async (req, res) => {
    let newUser = new User(req.value.body);
    newUser = await newUser.save();
    res.status(201).json({success: true, id: newUser._id});
};

const get = async (req, res) => {
    const { userId } = req.value.params;
    const user = await User.findById(userId).select("email nickname profile_photo APIs");
    res.status(200).json(user);
};

const update = async (req, res) => {
    const { userId } = req.value.params;
    const newUser = req.value.body;
    await User.findByIdAndUpdate(userId, newUser);
    res.status(200).json({ success: true });
};

const remove = async (req, res) => {
    const { userId } = req.value.params;
    await User.findByIdAndRemove(userId);
    res.status(202).json({ success: true });
};


export default { get, update, add, remove }
