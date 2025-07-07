import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import cartReducer from "./slice/cartSlice";
import authReducer from "./slice/authSlice";
import storage from "redux-persist/lib/storage";

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, cartReducer);

// ✅ Add serializableCheck ignore config
const store = configureStore({
   

  reducer: {
    cart: persistedReducer,
    auth : authReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
        ],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
