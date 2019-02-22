import * as actionCreators from './action-creators.js'
import createStore from './store.js';

function genRandomId() {
     return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

// Todo Action types
const ADD_TODO = 'ADD_TODO',
    REMOVE_TODO = 'REMOVE_TODO',
    TOGGLE_TODO = 'TOGGLE_TODO';

// GOAL Action types
const ADD_GOAL = 'ADD_GOAL',
    REMOVE_GOAL = 'REMOVE_GOAL';

let store =  new createStore(reducers);

/** Reducers for the example store
 * @param {object} state Original state
 * @param {object} action The action that will update the state
 * */
function reducers(state = {}, action) {
    return {
        todo: todoList(state.todo, action),
        goals: goalList(state.goals, action)
    }
}

/** Reducer for the todo list
 * @param {object} state Original state
 * @param {object} action The action that will update the state
 * */
function todoList(state = [], action) {
    switch(action.type) {
        case ADD_TODO:
            return [...state, action.todo];

        case REMOVE_TODO:
            return state.filter(item => item.id !== action.id);

        case TOGGLE_TODO:
            return state.map(todo => todo.id !== action.id ? todo : {...todo, complete: !todo.complete})

        default:
            return state
    }
}

/** Reducer for the goal list
 * @param {object} state Original state
 * @param {object} action The action that will update the state
 * */
function goalList(state = [], action) {
    switch(action.type) {
        case ADD_GOAL:
            return [...state, action.goal];

        case REMOVE_GOAL:
            return state.filter(item => item.id !== action.id);

        default:
            return state
    }
}

// Event Listeners for add button
document.getElementById('add-todo').addEventListener('click', addTodo);
document.getElementById('add-goal').addEventListener('click', addGoal);

// event actions
/** Event handler for add todo button
 *
 * */
function addTodo() {
    const input = document.getElementById('todo'),
        value = input.value;

    input.value = '';
    store.dispatch(actionCreators.addTodo({id: genRandomId(), name: value, complete: false}))
}

/** Event handler for add goal button
 *
 * */
function addGoal() {
    const input = document.getElementById('goal'),
        value = input.value;

    input.value = '';
    store.dispatch(actionCreators.addGoal({id: genRandomId(), name: value, complete: false}))
}

store.listenFor(() => {
   const todoList = document.getElementById('todo-list'),
       goalList = document.getElementById('goal-list'),
       {goals, todo} = store.getState();

   todoList.innerHTML = '';
   goalList.innerHTML = '';

   goals.forEach(goal => addItemToDOM(goal, 'goal'));
   todo.forEach(todoItem => addItemToDOM(todoItem, 'todo'))
});

/** Creates remove button for each item
 * @param {function} onClick - eventHandler for button
 * @returns {object} Returns the button HTML/object
 * */
function createRemoveButton(onClick) {
    const button = document.createElement('button');
    button.innerHTML = 'X';

    button.addEventListener('click', onClick);

    return button
}

/** Adds an item to the DOM
 * @param {object} item - item that is being added
 * @param {string} type - Todo item or Goal item
 * */
function addItemToDOM(item, type) {
    const node = document.createElement('li'),
        text = document.createTextNode(item.name);

    node.appendChild(text);

    if (type === 'todo') {
        node.appendChild(createRemoveButton(() => store.dispatch(actionCreators.removeTodo(item.id))));
    } else {
        node.appendChild(createRemoveButton(() => store.dispatch(actionCreators.removeGoal(item.id))));
    }

    node.style.textDecoration = item.complete ? 'line-through' : 'none';

    if (type === 'todo') {
        node.addEventListener('click', () => {
            store.dispatch(actionCreators.toggleTodo(item.id))
        });
    }

    document.getElementById(`${type}-list`).append(node)
}
