import { AUTH } from '../constants/actionTypes';
import  * as api from '../api/index'

export const login = (formData, history) => async(dispatch)=>{
    try {
        const { data } = await api.logIn(formData);

        dispatch({type: AUTH, data});

        history('/'); 
    } catch (error) {
        const errorMessage = error.response?.data?.message;

        return { error: errorMessage };
    }

}

export const signup = (formData, history) => async(dispatch) =>{
    
    try {
        const { data } = await api.signUp(formData);

        dispatch({type: AUTH, data});

       history('/'); 
    } catch (error) {
        console.log(error);
    }

}

