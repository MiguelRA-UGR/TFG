import { THREAD } from '../constants/actionTypes';
import  * as api from '../api/index'

export const createThread = (threadData) => async(dispatch) =>{
    
    console.log(threadData);

    try {
        const { data } = await api.createThread(threadData);
        dispatch({type: THREAD, data});

    } catch (error) {
        console.log(error);
    }

}

export const updateThread = (threadData) => async(dispatch) =>{
    
    try {
        const { data } = await api.updateThread(threadData);
        dispatch({type: THREAD, data});

    } catch (error) {
        console.log(error);
    }

}

export const deleteThread = (threadData) => async(dispatch) =>{
    try {
        const { data } = await api.deleteThread(threadData);

        dispatch({type: THREAD, data});
    } catch (error) {
        console.log(error);
    }

}