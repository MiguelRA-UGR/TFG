import { LIKE, DISLIKE, PHOTO } from '../constants/actionTypes';

const photos = (state = [], action) => {
    switch (action.type) {
        case LIKE:
            return state.map((photo) =>
                photo._id === action.payload._id ? { ...photo, likes: action.payload.likes } : photo
            );
        case DISLIKE:
            return state.map((photo) =>
                photo._id === action.payload._id ? { ...photo, likes: action.payload.likes } : photo
            );
        default:
            return state;
    }
};

export default photos;
