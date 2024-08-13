const replyCtrlr = {};
const Reply = require('../models/Reply');
const Thread = require('../models/Thread');
const Notification = require('../models/Notification');
const User = require('../models/User');

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

        const threadDetails = await Thread.findById(thread).populate('author').populate('forum').populate('title');
        const threadAuthor = threadDetails.author;
        const threadName = threadDetails.title;
        const forum = threadDetails.forum;

        const forumName = forum.title;

        const existingNotificationCount = await Notification.countDocuments({
            user: threadAuthor._id,
            forum: forum,
            type: 2
        });

        const exists = existingNotificationCount > 0;


        if (!exists) {
            const newNotification = new Notification({
                user: threadAuthor._id,
                text: `A new reply has been posted in your thread "${threadName}" in the forum "${forumName}".`,
                type: 2,
                forum: forum._id
            });

            await newNotification.save();

            const user = await User.findById(threadAuthor._id);

            user.notifications.push(newNotification._id);
            await user.save();
        }

        res.json({ message: "Reply created" });
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
