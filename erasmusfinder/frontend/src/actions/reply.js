import { REPLY } from '../constants/actionTypes';
import  * as api from '../api/index'

export const createReply = (replyData) => async(dispatch) =>{
    
    console.log(replyData);

    try {
        const { data } = await api.createReply(replyData);
        dispatch({type: REPLY, data});

    } catch (error) {
        console.log(error);
    }

}

export const updateReply = (replyData) => async(dispatch) =>{
    
    try {
        const { data } = await api.createThread(replyData);
        dispatch({type: REPLY, data});

    } catch (error) {
        console.log(error);
    }

}

export const deleteReply = (replyData) => async(dispatch) =>{
    try {
        const { data } = await api.deleteReply(replyData);

        dispatch({type: REPLY, data});
    } catch (error) {
        console.log(error);
    }

}