import API from "./api";

const imageService = {
  uploadImage(formData) {
    return API.callWithToken().post("wp/v2/media/", formData);
  },
  
};

export default imageService;
