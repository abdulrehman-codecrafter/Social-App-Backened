const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('../models/postModel');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, profilePic } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                data: null,
                message: "Please enter all fields",
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                data: null,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User({
            name,
            email,
            password: hashedPassword,
            profilePic
        });

        newUser.save();

        res.status(201).json({
            data: newUser,
            message: "User created successfully",
        });

    }
    catch (error) {
        res.status(409).json({
            data: null,
            message: "Failed to create user",
            error: error.message
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                data: null,
                message: "Please enter all fields",
            });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                data: null,
                message: "User does not exist",
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                data: null,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign({ _id: existingUser._id, email: existingUser.email }, process.env.SECRET_KEY);

        res.status(200).json({
            data: {
                user: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    profilePic: existingUser.profilePic,
                },
                token: token
            },
            message: "User logged in successfully",
        });
    }
    catch (error) {
        res.status(409).json({
            data: null,
            message: "Failed to login",
            error: error.message
        });
    }
}

const fetchUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id });
        const userPosts = await Post.find({ user: id }).populate('user', 'name profilePic _id').sort({ createdAt: -1 });
        res.status(200).json({
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePic: user.profilePic,
                    bio: user.bio,
                },
                posts: userPosts
            },
            message: "User fetched successfully",
        });
    }
    catch (error) {
        res.status(409).json({
            data: null,
            message: "Failed to fetch user",
            error: error.message
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, profilePic,bio } = req.body;
        if (!name) {
            return res.status(400).json({
                data: null,
                message: "Please enter credentials",
            });
        }
        const { _id } = req.user
        const user = await User.findOneAndUpdate({ _id }, { name, profilePic,bio }, { new: true });
        res.status(200).json({
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                bio: user.bio,
            },
            message: "User updated successfully",
        });
    }
    catch (error) {
        res.status(409).json({
            data: null,
            message: "Failed to update user",
            error: error.message
        });
    }

}

const fetchUser= async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await User.findOne({ _id })
        res.status(200).json({
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
            },
            message: "User fetched successfully",   
        }); 
    }

    catch (error) {
        res.status(409).json({
            data: null,
            message: "Failed to fetch user",
            error: error.message
        });
    }

}
module.exports = {
    registerUser,
    loginUser,
    updateProfile,
    fetchUserProfile,
    fetchUser
}