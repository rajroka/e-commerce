import { createSlice } from "@reduxjs/toolkit";



interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

const todoSlice = createSlice({
name : "todo",
initialState : [] as Todo[],
reducers :{
    addTodo : (state, action) => {
        state.push(action.payload)
    },
    removeTodo : (state, action) => {
        return state.filter((todo) => todo.id !== action.payload.id)
    },
    toggleComplete : (state, action) => {
        const todo = state.find((todo) => todo.id === action.payload.id)
        if (todo) {
            todo.completed = !todo.completed
    }
}

}
})