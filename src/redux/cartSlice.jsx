import { createSlice } from '@reduxjs/toolkit'

const initialState = JSON.parse(localStorage.getItem('cart')) || [];
console.log(initialState)


export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const existingItem = state.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                state.push({ ...action.payload, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },
        deleteFromCart(state, action) {
            const newState = state.filter(item => item.id !== action.payload.id);
            localStorage.setItem('cart', JSON.stringify(newState));
            return newState;
        },
        updateQuantity(state, action) {
            const { id, quantity } = action.payload;
            const item = state.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
                localStorage.setItem('cart', JSON.stringify(state));
            }
        },
        incrementQuantity: (state, action) => {
            const newState = state.map(item => {
                if (item.id === action.payload) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(newState));
            return newState;
        },
        decrementQuantity: (state, action) => {
            const newState = state.map(item => {
                if (item.id === action.payload && item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(newState));
            return newState;
        },
    },
})

// Action creators are generated for each case reducer function
export const { addToCart, deleteFromCart, updateQuantity, incrementQuantity, decrementQuantity } = cartSlice.actions

export default cartSlice.reducer