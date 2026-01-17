import { call, put, takeLatest } from "redux-saga/effects";
import {
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    SET_JWT_TOKEN,
    SET_USER_DATA,
} from "@store/constant";
import { authLogin } from "@services/authServices/authServices";
import { Alert } from "react-native";

function* loginSaga(action: any): any {
    try {
        const response = yield call(authLogin, action.payload);

        // Check if response is successful and has expected data
        if (response && (response.status === 200 || response.status === 201)) {
            // Assuming response.data contains { token, user } or similar structure
            // Adjust these paths based on actual API response structure!
            // Based on typical flows:
            const { token, user } = response.data;

            if (token) {
                yield put({ type: SET_JWT_TOKEN, payload: token });
            }
            if (user) {
                yield put({ type: SET_USER_DATA, payload: user });
            }

            yield put({ type: LOGIN_SUCCESS, payload: response.data });

            // Navigation could happen here or in the component listening to success
        } else {
            yield put({ type: LOGIN_FAILURE, payload: "Login Failed" });
            Alert.alert("Error", "Login failed. Please try again.");
        }

    } catch (error: any) {
        console.log("Login error:", error);
        yield put({ type: LOGIN_FAILURE, payload: error.message });
        Alert.alert("Error", error.message || "An unexpected error occurred.");
    }
}

export function* authSaga() {
    yield takeLatest(LOGIN_REQUEST, loginSaga);
}
