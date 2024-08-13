const { Router } = require('express');
const router = Router();
const {
    createNotification,
    deleteNotification,
    deleteAllNotifications,
    getNotification,
    getNotifications,
    deleteNotificationsByUser
} = require('../controller/notification.controller');

// Ruta para todas las notificaciones
router.route('/')
    .get(getNotifications)
    .delete(deleteAllNotifications)
    .post(createNotification);

router.route('/:id')
    .get(getNotification)
    .delete(deleteNotification);

router.route('/user/:id')
    .delete(deleteNotificationsByUser);

module.exports = router;
