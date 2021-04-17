import {applyMiddleware, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers";
import {todoInitialState, TodoSlice} from "./reducers/todoSlice";
import {filterInitialState, FilterSlice} from "./reducers/filterSlice";

export type Store = {
    todo: TodoSlice,
    filter: FilterSlice;
}

export const initialState: Store = {
    todo: todoInitialState,
    filter: filterInitialState,
};

export { rootReducer };
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export type AppDispatch = typeof store.dispatch;
export default store;