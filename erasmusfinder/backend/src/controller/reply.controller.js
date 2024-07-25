const replyCtrlr = {};
const Reply = require('../models/Reply');
const Thread = require('../models/Thread');

// GET
replyCtrlr.getReplies = async (req, res) => {
    try {
        const replys = await Reply.find();
        res.json(replys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST
replyCtrlr.createReply = async (req, res) => {
    
    try {
        const { author, thread, content } = req.body;
        const newReply = new Reply({ author, thread, content });
        await newReply.save();

        const threadReply = await Thread.findById(thread);
        threadReply.replies.push(newReply._id);
        await threadReply.save();

        res.json({ message: "Respuesta creada" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET
replyCtrlr.getReply = async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.id);
        if (reply === null) {
            return res.status(404).json({ message: "Respuesta no encontrada" });
        }
        res.json(reply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE
replyCtrlr.deleteReply = async (req, res) => {
    try {

        const reply = await Reply.findById(req.params.id);
        await Reply.findByIdAndDelete(req.params.id);

        const thread = await Thread.findById(reply.thread);
        thread.replies.pull(reply._id);
        await thread.save();

        res.json({ message: "Respuesta eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT update reply
replyCtrlr.updateReply = async (req, res) => {
    try {
        const { 
            author, 
            thread, 
            content 
        } = req.body;
        await Reply.findByIdAndUpdate(
            req.params.id, { 
                author, 
                thread, 
                content 
            });
        res.json({ message: "Respuesta actualizada" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
module.exports = replyCtrlr;
