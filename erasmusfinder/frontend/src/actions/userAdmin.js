import { USER_ADMIN, USER_DELETE, USER_WARNING } from '../constants/actionTypes';
import  * as api from '../api/index'

export const makeAdmin = (formData) => async(dispatch) =>{
    
    try {
        const { data } = await api.makeAdmin(formData);

        dispatch({type: USER_ADMIN, data});

    } catch (error) {
        console.log(error);
    }

}

export const deleteUser = (formData) => async(dispatch) =>{
    
    try {
        const { data } = await api.deleteUser(formData);

        dispatch({type: USER_DELETE, data});

    } catch (error) {
        console.log(error);
    }

}

export const warnUser = (formData) => async(dispatch) =>{
    
    try {
        const { data } = await api.warnUser(formData);

        dispatch({type: USER_WARNING, data});

    } catch (error) {
        console.log(error);
    }

}