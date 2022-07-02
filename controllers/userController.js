const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req,res,next) => {
    try{
        const {username, email, password} = req.body;
        const usernameCheck = await User.findOne({username});

        if(usernameCheck) {
            return res.json({
                message: "Username already exists",
                status: false
            });
        }

        const emailCheck = await User.findOne({email});
        if (emailCheck) {
            return res.json({
                message: "Email already exists",
                status: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({status: true}); 
    }
    catch(err){
        next(err);
    }
}

module.exports.login = async (req,res,next) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user) {
            return res.json({
                message: "User not found",
                status: false,
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.json({
                message: "Invalid password",
                status: false,
            });
        }
        return res.status(201).json({status: true, user}); 
    }
    catch(err){
        next(err);
    }
}

module.exports.setAvatar = async (req,res,next) => {
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isImageSet: true,
            avatarImage: avatarImage,
        });

        return res.json({
            isSet: userData.isImageSet,
            image: userData.avatarImage
        });
    }
    catch(err){
        next(err);
    }
}

module.exports.getAllUsers = async (req,res,next) => {
    try {
        const userId = req.params.id;
        const users = await User.find({_id: {$ne: userId}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    }
    catch(err){
        next(err);
    }
}