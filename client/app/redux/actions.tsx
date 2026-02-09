import type { Dispatch } from "redux";
import axios from "axios";

const CURRENT_USER = "CURRENT_USER";
const LOGOUT = "LOGOUT";
const USER_LOADING = "USER_LOADING";
export const UPDATE_USER = "UPDATE_USER";

export const getUser =
  (userId: string): any =>
    async (dispatch: Dispatch) => {
      try {
        dispatch({ type: USER_LOADING, payload: true });
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/user/${userId}`
        );

        if (response && response.data && response.data.user) {
          dispatch({ type: CURRENT_USER, payload: response.data.user });
        }
      } catch (error) {
        console.log(error);
        dispatch({ type: CURRENT_USER, payload: null });
      } finally {
        dispatch({ type: USER_LOADING, payload: false });
      }
    };

export const logout = (): any => async (dispatch: Dispatch) => {
  try {
    localStorage.removeItem("userId");
    localStorage.removeItem("ileana_chat_history");
    dispatch({ type: LOGOUT });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const updateUser = (updatedUserData: any) => (dispatch: Dispatch) => {
  dispatch({ type: UPDATE_USER, payload: updatedUserData });
};


