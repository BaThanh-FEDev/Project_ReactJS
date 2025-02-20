import axios from "axios";
const API = {
  call() {
    return axios.create({
      baseURL: "https://wp-api.codethanhthuongthua.asia/wp-json/",
    });
  },
  callWithToken(token) {
    if (!token) token = localStorage.getItem(TOKEN);
    return axios.create({
      baseURL: "https://wp-api.codethanhthuongthua.asia/wp-json/",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export const TOKEN = "TOKEN";
export const token = localStorage.getItem(TOKEN);

export function lockLogin() {
  API.callWithToken()
    .get("wp/v2/users/me")
    .then((res) => {
      if (res.data.nickname !== undefined) {
        window.location.href = "/";
      }
    });
}

export function lockChangeInfo() {
  API.callWithToken()
    .get("wp/v2/users/me")
    .then((res) => {
      if (res.data.nickname === undefined) {
        window.location.href = "/login";
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
}

export default API;
