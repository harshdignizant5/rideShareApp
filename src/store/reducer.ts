import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";

const rootReducer = combineReducers({
    authReducer: authReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
