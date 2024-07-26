import { THREAD, THREAD_UPDATE, THREAD_DELETE } from '../constants/actionTypes';
import { FETCH_THREADS } from '../constants/actionTypes';

const initialState = [];

const threadReducer = (state = initialState, action) => {
  switch (action.type) {
    case THREAD:
      return action.payload;
    case THREAD_UPDATE:
      return state.map((thread) =>
        thread._id === action.payload._id ? action.payload : thread
      );
    case THREAD_DELETE:
      return state.filter((thread) => thread._id !== action.payload);
    default:
      return state;

    case FETCH_THREADS:
    return action.payload;

  }
};

export default threadReducer;
