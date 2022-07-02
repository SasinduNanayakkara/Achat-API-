const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    isImageSet: {
        type: Boolean,
        default: false,
    },

    avatarImage: {
        type: String,
        default:"",
    }
});

module.exports = mongoose.model("Users", Schema);
