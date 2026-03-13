import User from '../models/user.js';

export const getProfile = async (req,res) => {
    try {
        const user = req.user;
        if(!user) {
            return res.status(404).json({message: "This profile does not exist"});
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message});
    }
}

export const getUsers = async (req,res) => {
    try {
        const users = await User.find({});
        if(!users) {
            return res.status(404).json({message: "No User Found"});
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({message: "Fatal server error", error: err.message});
    }
}

export const editUser = async (req,res) => {
    try {
        const updates = {};
        for (const field of Object.keys(User.schema.paths)) {
           if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const { username } = req.query;

        const user = await User.findOneAndUpdate(
            {username: username},
            {$set: updates},
            {new: true, runValidators: true }
        )

        if(!user) {
            return res.status(404).json({message: "No user found with the given username", username: username});
        }
        res.status(200).json({message: "User edited successfully", updates: updates});
    } catch (err) {
        res.status(500).json({message: "Fatal server error", error: err.message});
    }
}

export const deleteUser = async (req,res) => {
    try {
        const { username } = req.query;
        if(!username) {
            return res.status(400).json({message: "No username specified."});
        }
        const user = await User.findOneAndDelete({ username });
        if(!user) {
            return res.status(404).json({message: "User does not exist."});
        }
        res.status(200).json({ message: "Project deleted successfully" });

    } catch (err) {
        res.status(500).json({message: "Fatal server error", error: err.message});
    }

}
