import {Action, ACTION_TYPES} from "../actions";

export const ITEM_STATE_FILTER = {
    ALL: 'все',
    DONE: 'выполненные',
    NOT_DONE: 'невыполненные',
} as const;

export type ITEM_STATE_FILTER_TYPE =
    typeof ITEM_STATE_FILTER.ALL |
    typeof ITEM_STATE_FILTER.DONE |
    typeof ITEM_STATE_FILTER.NOT_DONE;

export type FilterSlice = {
    substring: string;
    itemState: ITEM_STATE_FILTER_TYPE;
};
export const filterInitialState: FilterSlice = {
    substring: '',
    itemState: ITEM_STATE_FILTER.ALL
};

export default function filterReducer(state = filterInitialState, action: Action): FilterSlice {
    switch (action.type) {
        case ACTION_TYPES.FILTER_ITEM_STATE: {
            return {
                ...state,
                itemState: action.payload
            }
        }
        case ACTION_TYPES.FILTER_SUBSTRING: {
            return {
                ...state,
                substring: action.payload
            }
        }
        default:
            return state;
    }
}
