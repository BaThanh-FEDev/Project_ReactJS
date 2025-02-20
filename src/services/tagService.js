import API from "./api";

const tagService = {
  getAll(inputParams = {}) {
    return API.call().get("wp/v2/tags", {
      params: {
        per_page: 100,
        page: 1,
        lang: localStorage.getItem("LANG") || "vi",
        ...inputParams,
      },
    });
  },

  // xong
  getAllTag() {
    return this.getAll();
  },

  getAllTagInAdmin(params = {}) {
    return this.getAll({
      per_page: params.per_page,
      page: params.page,
      search: params.search,
    });
  },

  // xong
  getByIdPost(postId) {
    return this.getAll({ post: postId });
  },

  // xong
  getTagById(tagId) {
    return API.call().get(`wp/v2/tags/${tagId}`);
  },

  // xong
  getTagBySlug(params = {}) {
    return API.call().get(`wp/v2/tags?slug=${params.slug}`);
  },

  // xong
  createTag({ tagData }) {
    return API.callWithToken().post("wp/v2/tags", tagData, {
      params: {
        lang: "vi",
      },
    });
  },

  //xong
  updateTag({ tagId, values }) {
    return API.callWithToken().put(`wp/v2/tags/${tagId}`, values);
  },

  // xong
  deleteTag(tagId) {
    return API.callWithToken().delete(`wp/v2/tags/${tagId}`, {
      params: { force: true },
    });
  },
};

export default tagService;
