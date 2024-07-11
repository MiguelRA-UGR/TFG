import { PHOTO, LIKE, DISLIKE } from '../constants/actionTypes';
import  * as api from '../api/index'

export const uploadPhoto = (photoData) => async(dispatch) =>{
    
    try {
        const { data } = await api.uploadPhoto(photoData);
        dispatch({type: PHOTO, data});

    } catch (error) {
        console.log(error);
    }

}

export const deletePhoto = (photoData) => async(dispatch) =>{
    try {
        const { data } = await api.deletePhoto(photoData);

        dispatch({type: PHOTO, data});
    } catch (error) {
        console.log(error);
    }

}

export const like = (photoData) => async(dispatch) =>{
    try {
        const { data } = await api.likePhoto(photoData);

        dispatch({type: LIKE, data});
    } catch (error) {
        console.log(error);
    }

}

export const dislike = (photoData) => async(dispatch) =>{
    try {
        const { data } = await api.dislikePhoto(photoData);

        dispatch({type: DISLIKE, data});
    } catch (error) {
        console.log(error);
    }

}
