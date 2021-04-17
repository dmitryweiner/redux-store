import { createSelector } from 'reselect';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from "redux";
import api from "./api";

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

export enum REQUEST_STATUS {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR
}

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

export interface Element {
    id: string;
    title: string;
    isChecked: boolean;
}

export const ITEM_STATE_FILTER = {
    ALL: 'все',
    DONE: 'выполненные',
    NOT_DONE: 'невыполненные',
} as const;

export type ITEM_STATE_FILTER_TYPE =
    typeof ITEM_STATE_FILTER.ALL |
    typeof ITEM_STATE_FILTER.DONE |
    typeof ITEM_STATE_FILTER.NOT_DONE;

export type Store = {
    list: Element[];
    filter: {
        substring: string;
        itemState: ITEM_STATE_FILTER_TYPE;
    };
    requestStatus: REQUEST_STATUS,
    error: string
}

export const initialState: Store = {
    list: [],
    filter: {
        substring: '',
        itemState: ITEM_STATE_FILTER.ALL
    },
    requestStatus: REQUEST_STATUS.IDLE,
    error: ''
};

/**
 * @param {type: string, payload: any} action
 * @param state
 */
export function reducer(state = initialState, action: Action): Store {
    switch (action.type) {
        case ACTION_TYPES.ADD: {
            return {
                ...state,
                list: [...state.list, action.payload]
            };
        }
        case ACTION_TYPES.ADD_ALL: {
            return {
                ...state,
                list: [...action.payload]
            };
        }
        case ACTION_TYPES.DELETE: {
            return {
                ...state,
                list: [...state.list.filter(item => item.id !== action.payload)]
            };
        }
        case ACTION_TYPES.EDIT: {
            return {
                ...state,
                list: [...state.list.map(function(item) {
                if (item.id === action.payload.id) {
                    return {...item, title: action.payload.title};
                }
                return item;
            })]
            };
        }
        case ACTION_TYPES.CHECKED: {
            return {
                ...state,
                list: [...state.list.map(function(item) {
                if (item.id === action.payload) {
                    return {...item, isChecked: !item.isChecked};
                }
                return item;
            })]
            };
        }
        case ACTION_TYPES.FILTER_ITEM_STATE: {
            return {
                ...state,
                filter: {...state.filter, itemState: action.payload}
            }
        }
        case ACTION_TYPES.FILTER_SUBSTRING: {
            return {
                ...state,
                filter: {...state.filter, substring: action.payload}
            }
        }
        case ACTION_TYPES.SET_REQUEST_STATUS: {
            return {
                ...state,
                requestStatus: action.payload
            }
        }
        case ACTION_TYPES.SET_ERROR: {
            return {
                ...state,
                error: action.payload
            }
        }
        default: return state;
    }
}

export function selectListByItemState(list: Element[], itemState: ITEM_STATE_FILTER_TYPE): Element[] {
    if (itemState === ITEM_STATE_FILTER.DONE) {
        return list.filter(item => item.isChecked);
    }
    if (itemState === ITEM_STATE_FILTER.NOT_DONE) {
        return list.filter(item => !item.isChecked);
    }
    return list;
}

export function selectListBySubstring(list: Element[], substring: string): Element[] {
    if (substring.length) {
        return list.filter(item => item.title.toLowerCase().includes(substring.toLowerCase()));
    }
    return list;
}

export function selectFilteredList(state: Store): Element[] {
    return selectListByItemState(
        selectListBySubstring(state.list, state.filter.substring),
        state.filter.itemState
    );
}

export const selectItemsCount = createSelector(
    (state: Store) => state.list,
    list => ({
        [ITEM_STATE_FILTER.ALL]: list.length,
        [ITEM_STATE_FILTER.DONE]: selectListByItemState(list, ITEM_STATE_FILTER.DONE).length,
        [ITEM_STATE_FILTER.NOT_DONE]: selectListByItemState(list, ITEM_STATE_FILTER.NOT_DONE).length
    })
);

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

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
type AppDispatch = typeof store.dispatch;
export default store;
