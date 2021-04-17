import { combineReducers } from 'redux';
import todoReducer from "./todoSlice";
import filterReducer from "./filterSlice";

const rootReducer = combineReducers({
    todo: todoReducer,
    filter: filterReducer
})

export default rootReducer;