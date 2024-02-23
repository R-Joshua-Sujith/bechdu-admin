import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const loginReducer = (state = { user: null, email: "", token: "" }, action) => {
    if (action.type === 'login') {
        return {
            user: true,
            email: action.email,
            token: action.token
        }
    }
    else if (action.type === 'logout') {
        return {
            user: null,
            email: "",
            token: ""
        }
    } else {
        return state;
    }
}

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, loginReducer);


const dataStore = createStore(persistedReducer);

const persistor = persistStore(dataStore);

export { dataStore, persistor }