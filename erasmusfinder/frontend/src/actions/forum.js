import { FORUM } from '../constants/actionTypes';
import  * as api from '../api/index'

export const createForum = (forumData) => async(dispatch) =>{
    
    try {
        const { data } = await api.createForum(forumData);
        dispatch({type: FORUM, data});

    } catch (error) {
        console.log(error);
    }

}

export const updateForum = (forumData) => async(dispatch) =>{
    
    try {
        const { data } = await api.updateForum(forumData);
        dispatch({type: FORUM, data});

    } catch (error) {
        console.log(error);
    }

}

export const deleteForum = (forumData) => async(dispatch) =>{
    try {
        const { data } = await api.deleteForum(forumData);

        dispatch({type: FORUM, data});
    } catch (error) {
        console.log(error);
    }

}