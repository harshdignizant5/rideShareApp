import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";
import homeReducer from "./reducers/homeReducer";

const rootReducer = combineReducers({
    authReducer: authReducer,
    homeReducer: homeReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
