import { REQUEST } from '../constants/actionTypes';
import  * as api from '../api/index'

export const createRequest = (formData) => async(dispatch) =>{
    console.log(formData);
    try {
        const { data } = await api.createRequest(formData);

        dispatch({type: REQUEST, data});

    } catch (error) {
        console.log(error);
    }

}

export const deleteRequest = (formData) => async(dispatch) =>{
    try {
        const { data } = await api.deleteRequest(formData);

        dispatch({type: REQUEST, data});

    } catch (error) {
        console.log(error);
    }

}

export const approveRequest = (formData) => async(dispatch) =>{
    try {
        const { data } = await api.approveRequest(formData);

        dispatch({type: REQUEST, data});

    } catch (error) {
        console.log(error);
    }

}
