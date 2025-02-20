import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOKEN } from "../services/api";
import authService from "../services/authService";

const initialState = {
  nickName: "Tài khoản",
  alertErrLogin: "",
  userInfor: null,
  token: localStorage.getItem(TOKEN),
};
const name = "user";

export const getUserLogin = createAsyncThunk(
  `${name}/getUserLogin`,
  async (inforLogin, thunkAPI) => {
    try {
      const response = await authService.postLogin(inforLogin);
      const token = response.data.token;
      const { dispatch } = thunkAPI;
      dispatch(userGetInfor(token));
      return {
        status: true,
        token,
      };
    } catch (err) {
      return {
        status: false,
        error: "Thông tin đăng nhập chưa đúng",
      };
    }
  }
);

export const userChangePassword = createAsyncThunk(
  `${name}/userChangePassword`,
  async (password) => {
    try {
      await authService.changePassword(password);
      return {
        status: true,
      };
    } catch (err) {
      return {
        status: false,
        err: " Thông tin chưa chính xác",
      };
    }
  }
);

export const userRegister = createAsyncThunk(
  `${name}/userRegister`,
  async (data, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      await authService.postRegister(data);
      // const inforLogin = { username: data.username, password: data.password };

      // await dispatch(getUserLogin(inforLogin));

      return {
        status: true,
      };
    } catch (err) {
      return {
        status: false,
        error: "Thông tin không hợp lệ",
      };
    }
  }
);

export const userUpdateInfor = createAsyncThunk(
  `${name}/userUpdateInfor`,
  async (dataUpdate) => {
    try {
      const response = await authService.updateInfor(dataUpdate);
      return {
        status: true,
        data: response.data,
      };
    } catch (err) {
      return {
        status: false,
      };
    }
  }
);

export const userGetInfor = createAsyncThunk(
  `${name}/userGetInfor`,
  async (token) => {
    try {
      const response = await authService.getInfor(token);
      return response.data;
    } catch (err) {
      localStorage.removeItem(TOKEN);
    }
  }
);

export const userUpdateAvatar = createAsyncThunk(
  `${name}/userUpdateAvatar`,
  async (mediaId) => {
    try {
      const response = await authService.uploadMedia(mediaId);
      // return response
    } catch (err) {
      console.log("err", err);
    }
  }
);

const userSlice = createSlice({
  name,
  initialState,
  reducers: {
    userLogout(state, action) {
      state.userInfor = null;
      state.token = null;
      localStorage.removeItem(TOKEN);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserLogin.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.token = action.payload.token;
          localStorage.setItem(TOKEN, action.payload.token);
        }
      })
      .addCase(userGetInfor.fulfilled, (state, action) => {
        state.userInfor = action.payload;
      })
      .addCase(userUpdateInfor.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.userInfor = action.payload.data;
        }
      });
  },
});

const { reducer, actions } = userSlice;
export const { userLogout } = actions;

export default reducer;
