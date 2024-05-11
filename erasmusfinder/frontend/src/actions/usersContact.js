import { CONTACT } from '../constants/actionTypes';
import  * as api from '../api/index'

export const createContact = (formData) => async(dispatch) =>{
    
    try {
        const { data } = await api.contact(formData);

        dispatch({type: CONTACT, data});

    } catch (error) {
        console.log(error);
    }

}

export const breakContact = (formData) => async(dispatch) =>{
    
    try {
        const { data } = await api.breakContact(formData);

        dispatch({type: CONTACT, data});

    } catch (error) {
        console.log(error);
    }

}

export const sendContactRequest = (formData) => async(dispatch) =>{
    
    try {
        const { data } = await api.sendRequest(formData);

        dispatch({type: CONTACT, data});

    } catch (error) {
        console.log(error);
    }

}