import api from "../api";
import {
    AppDispatch
} from "./index";
import {ITEM_STATE_FILTER_TYPE} from "./reducers/filterSlice";
import { REQUEST_STATUS, Element } from "./reducers/todoSlice";

export const ACTION_TYPES = {
    ADD: 'add',
    ADD_ALL: 'addAll',
    DELETE: 'delete',
    EDIT: 'edit',
    CHECKED: 'checked',
    FILTER_ITEM_STATE: 'filterItemState',
    FILTER_SUBSTRING: 'filterSubstring',
    SET_REQUEST_STATUS: 'setRequestStatus',
    SET_ERROR: 'setError'
} as const;

export interface ActionAdd {
    type: typeof ACTION_TYPES.ADD;
    payload: Element;
}

export interface ActionAddAll {
    type: typeof ACTION_TYPES.ADD_ALL;
    payload: Element[];
}

export interface ActionDelete {
    type: typeof ACTION_TYPES.DELETE;
    payload: string;
}

export interface ActionChecked {
    type: typeof ACTION_TYPES.CHECKED;
    payload: string;
}

export interface ActionEdit {
    type: typeof ACTION_TYPES.EDIT;
    payload: { id: string; title: string; };
}

export interface ActionFilterItemState {
    type: typeof ACTION_TYPES.FILTER_ITEM_STATE;
    payload: ITEM_STATE_FILTER_TYPE;
}

export interface ActionFilterSubstring {
    type: typeof ACTION_TYPES.FILTER_SUBSTRING;
    payload: string;
}

export interface ActionSetRequestStatus {
    type: typeof ACTION_TYPES.SET_REQUEST_STATUS;
    payload: REQUEST_STATUS;
}

export interface ActionSetError {
    type: typeof ACTION_TYPES.SET_ERROR;
    payload: string;
}

export type Action =
    ActionAdd |
    ActionAddAll |
    ActionChecked |
    ActionEdit |
    ActionDelete |
    ActionFilterItemState |
    ActionFilterSubstring |
    ActionSetRequestStatus |
    ActionSetError;

const setRequestStatus = (requestStatus: REQUEST_STATUS) => ({
    type: ACTION_TYPES.SET_REQUEST_STATUS,
    payload: requestStatus
});

const setError = (error: string) => ({
    type: ACTION_TYPES.SET_ERROR,
    payload: error
});

export const addElement = (title: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setRequestStatus(REQUEST_STATUS.LOADING));
        const data = await api.todos.add({title});
        dispatch({type: ACTION_TYPES.ADD, payload: data});
        dispatch(setRequestStatus(REQUEST_STATUS.SUCCESS));
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setRequestStatus(REQUEST_STATUS.ERROR));
    }
}

export const getElements = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(setRequestStatus(REQUEST_STATUS.LOADING));
        const data = await api.todos.list();
        dispatch({type: ACTION_TYPES.ADD_ALL, payload: data});
        dispatch(setRequestStatus(REQUEST_STATUS.SUCCESS));
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setRequestStatus(REQUEST_STATUS.ERROR));
    }
}

export const deleteElement = (id: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setRequestStatus(REQUEST_STATUS.LOADING));
        const data = await api.todos.delete(id);
        dispatch({type: ACTION_TYPES.DELETE, payload: id});
        dispatch(setRequestStatus(REQUEST_STATUS.SUCCESS));
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setRequestStatus(REQUEST_STATUS.ERROR));
    }
}
