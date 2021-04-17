import {
    ACTION_TYPES, addElement, deleteElement, getElements,
    initialState,
    ITEM_STATE_FILTER,
    reducer, REQUEST_STATUS,
    selectFilteredList,
    selectItemsCount
} from './store';
import { makeTestStore } from "./setupTests";
import fetchMock from 'fetch-mock';

const title = 'title';
const state = {
    list: [
        {
            id: '1',
            title: 'test123',
            isChecked: true
        },
        {
            id: '2',
            title: 'test123456',
            isChecked: false
        },
        {
            id: '3',
            title: 'test123345',
            isChecked: true
        },
        {
            id: '4',
            title: 'тест',
            isChecked: true
        },
    ],
    filter: {
        itemState: ITEM_STATE_FILTER.DONE,
        substring: 'test'
    }
};

afterEach(() => fetchMock.reset());

test('action.type = add добавлен новый элемент.', () => {
    const element = {
        id: '123',
        title: 'test',
        isChecked: false
    }
    const action = {
        type: ACTION_TYPES.ADD,
        payload: element
    };

    const newState = reducer(initialState, action);
    expect(newState.list.length).toEqual(1);
    expect(newState.list[0]).toHaveProperty('id');
    expect(newState.list[0].title).toEqual(element.title);
});

test('action.type = delete удален элемент.', () => {
    const addAction = {
        type: ACTION_TYPES.ADD,
        payload: title
    };
    let state = reducer(initialState, addAction);
    const deleteAction = {
        type: ACTION_TYPES.DELETE,
        payload: state.list[0].id
    };
    state = reducer(state, deleteAction);
    expect(state.list.length).toEqual(0);
});

test('action.type = checked элемент c галочкой', () => {
    const addAction = {
        type: ACTION_TYPES.ADD,
        payload: title
    };
    let state = reducer(initialState, addAction);
    const checkedAction = {
        type: ACTION_TYPES.CHECKED,
        payload: state.list[0].id
    };
    state = reducer(state, checkedAction);
    expect(state.list[0].isChecked).toBeTruthy();
});

test('action.type = edit отредактирован элемент', () => {
    const newTitle = 'new title';
    const addAction = {
        type: ACTION_TYPES.ADD,
        payload: title
    };
    let state = reducer(initialState, addAction);
    const editAction = {
        type: ACTION_TYPES.EDIT,
        payload: { id: state.list[0].id, title: newTitle }
    };
    state = reducer(state, editAction);
    expect(state.list[0].title).toEqual(newTitle);
});

test('ACTION_TYPES.FILTER_ITEM_STATE', () => {
    const action = {
        type: ACTION_TYPES.FILTER_ITEM_STATE,
        payload: ITEM_STATE_FILTER.DONE
    };
    const state = reducer(initialState, action);
    expect(state.filter.itemState).toBe(ITEM_STATE_FILTER.DONE);
});

test('ACTION_TYPES.FILTER_SUBSTRING', () => {
    const action = {
        type: ACTION_TYPES.FILTER_SUBSTRING,
        payload: 'test'
    };
    const state = reducer(initialState, action);
    expect(state.filter.substring).toBe(action.payload);
});

test('фильтрация списка', () => {
    const filteredList = selectFilteredList(state);
    expect(filteredList.length).toEqual(2);
    expect(filteredList[0].id).toEqual(state.list[0].id);
    expect(filteredList[1].id).toEqual(state.list[2].id);
});

test('селектор числа элементов', () => {
    const itemsCount = selectItemsCount(state); // {}
    expect(itemsCount[ITEM_STATE_FILTER.ALL]).toBe(4);
    expect(itemsCount[ITEM_STATE_FILTER.DONE]).toBe(3);
    expect(itemsCount[ITEM_STATE_FILTER.NOT_DONE]).toBe(1);
});

test('тестирование асинхронного экшена addElement', async () => {
    const title = 'test';

    const element = {
        id: '123',
        title,
        isChecked: false
    }

    fetchMock.mock(
        'express:/todos',
        {
            status: 200,
            body: element
        }, {
            method: 'POST'
        }
    );

    const store = makeTestStore({ useMockStore: true });
    await store.dispatch(addElement(title));
    expect(store.getActions()).toEqual([
        {type: ACTION_TYPES.SET_REQUEST_STATUS, payload: REQUEST_STATUS.LOADING},
        {type: ACTION_TYPES.ADD, payload: element},
        {type: ACTION_TYPES.SET_REQUEST_STATUS, payload: REQUEST_STATUS.SUCCESS}
    ])
});

test('тестирование асинхронного экшена addElement с ошибкой', async () => {
    const title = 'test';

    const errorObject = {
        error: 'Error message'
    };

    fetchMock.mock(
        'express:/todos',
        {
            status: 500,
            body: errorObject
        }, {
            method: 'POST'
        }
    );

    const store = makeTestStore({ useMockStore: true });
    await store.dispatch(addElement(title));
    expect(store.getActions()).toEqual([
        {type: ACTION_TYPES.SET_REQUEST_STATUS, payload: REQUEST_STATUS.LOADING},
        {type: ACTION_TYPES.SET_ERROR, payload: errorObject.error},
        {type: ACTION_TYPES.SET_REQUEST_STATUS, payload: REQUEST_STATUS.ERROR}
    ])
});

test('тестирование асинхронного экшена getElements', async () => {
    fetchMock.mock(
        'express:/todos',
        {
            status: 200,
            body: state.list
        }, {
            method: 'GET'
        }
    );

    const store = makeTestStore({ useMockStore: true });
    await store.dispatch(getElements());
    expect(store.getActions()).toEqual([
        {type: ACTION_TYPES.SET_REQUEST_STATUS, payload: REQUEST_STATUS.LOADING},
        {type: ACTION_TYPES.ADD_ALL, payload: state.list},
        {type: ACTION_TYPES.SET_REQUEST_STATUS, payload: REQUEST_STATUS.SUCCESS}
    ])
});

test('тестирование асинхронного экшена getElements с ошибкой', async () => {
    const title = 'test';

    const errorObject = {
        error: 'Error message'
    };

    fetchMock.mock(
        'express:/todos',
        {
            status: 500,
            body: errorObject
        }, {
            method: 'GET'
        }
    );

    const store = makeTestStore({ useMockStore: true });
    await store.dispatch(getElements());
    expect(store.getActions()).toEqual([
        {type: ACTION_TYPES.SET_REQUEST_STATUS, payload: REQUEST_STATUS.LOADING},
        {type: ACTION_TYPES.SET_ERROR, payload: errorObject.error},
        {type: ACTION_TYPES.SET_REQUEST_STATUS, payload: REQUEST_STATUS.ERROR}
    ])
});


test('тестирование асинхронного экшена deleteElement', async () => {
    fetchMock.mock(
        'express:/todos/:id',
        {
            status: 200,
            body: {}
        }, {
            method: 'DELETE'
        }
    );

    const store = makeTestStore({ initialState: state, useMockStore: true });
    await store.dispatch(deleteElement(state.list[0].id));
    expect(store.getActions()).toEqual([
        {type: ACTION_TYPES.SET_REQUEST_STATUS, payload: REQUEST_STATUS.LOADING},
        {type: ACTION_TYPES.DELETE, payload: state.list[0].id},
        {type: ACTION_TYPES.SET_REQUEST_STATUS, payload: REQUEST_STATUS.SUCCESS}
    ])
});

test('тестирование асинхронного экшена deleteElement с ошибкой', async () => {
    const errorObject = {
        error: 'Error message'
    };

    fetchMock.mock(
        'express:/todos/:id',
        {
            status: 500,
            body: errorObject
        }, {
            method: 'DELETE'
        }
    );

    const store = makeTestStore({ useMockStore: true });
    await store.dispatch(deleteElement('123'));
    expect(store.getActions()).toEqual([
        {type: ACTION_TYPES.SET_REQUEST_STATUS, payload: REQUEST_STATUS.LOADING},
        {type: ACTION_TYPES.SET_ERROR, payload: errorObject.error},
        {type: ACTION_TYPES.SET_REQUEST_STATUS, payload: REQUEST_STATUS.ERROR}
    ])
});

