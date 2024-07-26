import { CREATE_REPLY, UPDATE_REPLY, DELETE_REPLY } from '../constants/actionTypes';

const initialState = {
    replies: [],
};

const replyReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_REPLY:
            return { ...state, replies: [...state.replies, action.payload] };
        case UPDATE_REPLY:
            return {
                ...state,
                replies: state.replies.map((reply) =>
                    reply._id === action.payload._id ? action.payload : reply
                ),
            };
        case DELETE_REPLY:
            return {
                ...state,
                replies: state.replies.filter((reply) => reply._id !== action.payload),
            };
        default:
            return state;
    }
};

export default replyReducer;