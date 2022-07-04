const Message = require('../models/messageModel');
module.exports.addMessage = async (req,res,next) => {
    try {
        const {from, to, message} = req.body;
        const data = await Message.create({
            message: {text: message},
            user: [from, to],
            sender: from,
        });

        if(data) {
            return res.json({
                status: true,
                message: "Message sent",
            });
        }
        else {
            return res.json({
                status: false,
                message: "Message not sent",
            }); 
        }
    }
    catch(err){
        next(err);
    }
}

module.exports.getMessages = async (req,res,next) => {
    try {
        const {from, to} = req.body;

        const messages = await Message.find({
            user: {
                $all: [from, to],
            },
        }).sort({updatedAt: 1});

        const projectedMessages = messages.map(message => {
            return {
                fromSelf: message.sender.toString() === from,
                message: message.message.text,
            };
        });

        res.json(projectedMessages);
    }
    catch(err){
        next(err);
    }
}