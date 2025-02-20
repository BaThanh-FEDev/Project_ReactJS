import API from "./api";


const authService = {
    postLogin(params = {}) {
      return API.call().post('jwt-auth/v1/token', params); // xong
    },
    postRegister(params = {}) {
      return API.call().post('wp/v2/users/register', params); // xong
    },
    postAuth(token) {
      return API.callWithToken(token).post('wp/v2/users/me');
    },
    getInfor(token) {
      return API.callWithToken(token).get('wp/v2/users/me'); // xong
    },
    updateInfor(data) {
      return API.callWithToken().put('wp/v2/users/me', data); // xong
    },
    changePassword(data) {
      return API.callWithToken().put('wp/v2/users/password', data); // xong
    },
    uploadMedia(data) {
      return API.callWithToken().post('wp/v2/media', data); // xong
    },
  };
  
  export default authService;
  