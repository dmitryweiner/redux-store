import { createSelector } from "reselect";
import { Store } from "./index";
import {ITEM_STATE_FILTER, ITEM_STATE_FILTER_TYPE} from "./reducers/filterSlice";
import { Element } from './reducers/todoSlice';

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
        selectListBySubstring(state.todo.list, state.filter.substring),
        state.filter.itemState
    );
}

export const selectItemsCount = createSelector(
    (state: Store) => state.todo.list,
    list => ({
        [ITEM_STATE_FILTER.ALL]: list.length,
        [ITEM_STATE_FILTER.DONE]: selectListByItemState(list, ITEM_STATE_FILTER.DONE).length,
        [ITEM_STATE_FILTER.NOT_DONE]: selectListByItemState(list, ITEM_STATE_FILTER.NOT_DONE).length
    })
);
