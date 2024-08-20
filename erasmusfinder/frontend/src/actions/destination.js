import { CREATE_DEST, DELETE_DEST, UPDATE_DEST } from '../constants/actionTypes';
import  * as api from '../api/index'

export const createDestination = (destinationData) => async(dispatch) =>{
    
    console.log(destinationData);

    try {
        const { data } = await api.createDestination(destinationData);
        dispatch({type: CREATE_DEST, data});

    } catch (error) {
        console.log(error);
    }

}

export const updateDestination = (destinationId, destinationData) => async(dispatch) =>{
    
    console.log(destinationData);

    try {
        const { data } = await api.updateDestination(destinationId, destinationData);
        dispatch({type: UPDATE_DEST, data});

    } catch (error) {
        console.log(error);
    }

}

export const deleteDestination = (destinationData) => async(dispatch) =>{
    try {
        const { data } = await api.deleteDestination(destinationData);

        dispatch({type: DELETE_DEST, data});
    } catch (error) {
        console.log(error);
    }

}