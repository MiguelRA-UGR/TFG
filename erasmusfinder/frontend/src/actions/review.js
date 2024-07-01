import { REVIEW } from '../constants/actionTypes';
import  * as api from '../api/index'

export const createReview = (formData) => async(dispatch) =>{
    
    try {
        const { data } = await api.createReview(formData);

        dispatch({type: REVIEW, data});

    } catch (error) {
        console.log(error);
    }

}

export const deleteReview = (formData) => async(dispatch) =>{
    
    try {
        const { data } = await api.deleteReview(formData);

        dispatch({type: REVIEW, data});

    } catch (error) {
        console.log(error);
    }

}
