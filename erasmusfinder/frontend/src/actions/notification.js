import { NOTIFICATION } from '../constants/actionTypes';
import * as api from '../api/index';

export const deleteNotification = (id) => async (dispatch) => {
    try {
        await api.deleteNotification(id);

        dispatch({ type: NOTIFICATION });
    } catch (error) {
        console.log(error);
    }
};

export const deleteNotificationsByUser = (userId) => async (dispatch) => {
    try {
        await api.deleteNotificationsByUser(userId);

        dispatch({ type: NOTIFICATION });
    } catch (error) {
        console.log(error);
    }
};

export const deleteAllNotifications = () => async (dispatch) => {
    try {
        await api.deleteAllNotifications();

        dispatch({ type: NOTIFICATION });
    } catch (error) {
        console.log(error);
    }
};
