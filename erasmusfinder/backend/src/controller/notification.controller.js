const Notification = require('../models/Notification');
const User = require('../models/User');
const notificationCtrlr = {};

notificationCtrlr.createNotification = async (req, res) => {
    try {
        const notification = new Notification({
            user: req.body.user,
            text: req.body.text,
            type: req.body.type,
            forum: req.body.forum
        });

        await notification.save();

        await User.findByIdAndUpdate(
            req.body.user,
            { $push: { notifications: notification._id } },
            { new: true }
        );

        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

notificationCtrlr.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await Notification.findByIdAndDelete(req.params.id);

        await User.findByIdAndUpdate(
            notification.user,
            { $pull: { notifications: notification._id } },
            { new: true }
        );

        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

notificationCtrlr.deleteAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({});
        const userIds = [...new Set(notifications.map(notification => notification.user.toString()))];

        await Notification.deleteMany({});

        for (const userId of userIds) {
            await User.findByIdAndUpdate(
                userId,
                { $pull: { notifications: { $in: notifications.map(notification => notification._id) } } },
                { new: true }
            );
        }

        res.status(200).json({ message: 'All notifications deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

notificationCtrlr.getNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

notificationCtrlr.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({});
        res.status(200).json(notifications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

notificationCtrlr.deleteNotificationsByUser = async (req, res) => {
    const userId = req.params.id;

    console.log(req.params);

    try {
        const notifications = await Notification.find({ user: userId });
        const notificationIds = notifications.map(notification => notification._id);

        await Notification.deleteMany({ user: userId });

        await User.findByIdAndUpdate(
            userId,
            { $pull: { notifications: { $in: notificationIds } } },
            { new: true }
        );

        res.status(200).json({ message: 'All notifications for the user have been deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = notificationCtrlr;
