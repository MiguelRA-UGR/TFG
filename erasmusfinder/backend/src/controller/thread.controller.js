const threadCtrlr = {};
const Thread = require('../models/Thread');
const Forum = require('../models/Forum');
const Notification = require('../models/Notification');
const User = require('../models/User');

// GET
threadCtrlr.getThreads = async (req, res) => {
    try {
        const threads = await Thread.find();
        res.json(threads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST
threadCtrlr.createThread = async (req, res) => {
    try {
        const { author, forum, url, title, content } = req.body;
        
        const newThread = new Thread({ author, forum, url, title, content });
        await newThread.save();

        const forumThread = await Forum.findById(forum);
        forumThread.threads.push(newThread._id);
        await forumThread.save();

        const forumName = forumThread.title; 
        const forumUsers = forumThread.users;

        const notificationPromises = forumUsers.map(async (userId) => {
            const existingNotificationCount = await Notification.countDocuments({
                user: userId,
                forum: forum,
                type: 1
            });

            if (existingNotificationCount === 0) {
                const newNotification = new Notification({
                    user: userId,
                    text: `A new thread has been posted in "${forumName}".`,
                    type: 1,
                    forum: forum
                });

                await newNotification.save();

                const user = await User.findById(userId);

                user.notifications.push(newNotification._id);
                await user.save();
            }
        });

        await Promise.all(notificationPromises);

        res.json({ message: "Thread created" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// GET
threadCtrlr.getThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id);
        if (thread === null) {
            return res.status(404).json({ message: "Thread no encontrado" });
        }
        res.json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE
threadCtrlr.deleteThread = async (req, res) => {
    try {

        const thread = await Thread.findById(req.params.id);
        await Thread.findByIdAndDelete(req.params.id);

        const forum = await Forum.findById(thread.forum);
        forum.threads.pull(thread._id);
        await forum.save();

        res.json({ message: "Thread eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT update thread
threadCtrlr.updateThread = async (req, res) => {
    try {
        const { 
            author, 
            forum, 
            url, 
            title, 
            content 
        } = req.body;
        await Thread.findByIdAndUpdate(
            req.params.id, { 
                author, 
                forum, 
                url, 
                title, 
                content 
            });
        res.json({ message: "Thread actualizado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = threadCtrlr;