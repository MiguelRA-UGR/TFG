const threadCtrlr = {};
const Thread = require('../models/Thread');
const Forum = require('../models/Forum');

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

        res.json({ message: "Thread creado" });
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

// PUT VOTE
threadCtrlr.voteThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id);
        if (!thread.votes.includes(req.user._id)) {
            thread.votes.push(req.user._id);
            await thread.save();
        }

        //Informar al autor

        res.json({ message: "Thread votado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT UNVOTE
threadCtrlr.unvoteThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id);
        if (thread.votes.includes(req.user._id)) {
            thread.votes.pull(req.user._id);
            await thread.save();
        }

        //Informar al autor

        res.json({ message: "Thread eliminado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = threadCtrlr;
