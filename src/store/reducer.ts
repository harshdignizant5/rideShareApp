import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";
import appReducer from "./reducers/appReducer";

const rootReducer = combineReducers({
    authReducer: authReducer,
    appReducer: appReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
