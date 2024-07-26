import { CREATE_FORUM, UPDATE_FORUM, DELETE_FORUM } from '../constants/actionTypes';

const initialState = {
    forums: [],
};

const forumReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_FORUM:
            return { ...state, forums: [...state.forums, action.payload] };
        case UPDATE_FORUM:
            return {
                ...state,
                forums: state.forums.map((forum) =>
                    forum._id === action.payload._id ? action.payload : forum
                ),
            };
        case DELETE_FORUM:
            return {
                ...state,
                forums: state.forums.filter((forum) => forum._id !== action.payload),
            };
        default:
            return state;
    }
};

export default forumReducer;
