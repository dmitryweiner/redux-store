import {Action, ACTION_TYPES} from "../actions";

export enum REQUEST_STATUS {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR
}

export interface Element {
    id: string;
    title: string;
    isChecked: boolean;
}

export type TodoSlice = {
    list: Element[]
    requestStatus: REQUEST_STATUS,
    error: string
};

export const todoInitialState: TodoSlice = {
    list: [],
    requestStatus: REQUEST_STATUS.IDLE,
    error: ''
};

export default function todoReducer(state = todoInitialState, action: Action): TodoSlice {
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
                list: [...state.list.map(function (item) {
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
                list: [...state.list.map(function (item) {
                    if (item.id === action.payload) {
                        return {...item, isChecked: !item.isChecked};
                    }
                    return item;
                })]
            };
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
        default:
            return state;
    }
}
