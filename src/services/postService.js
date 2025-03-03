import API from "./api";

const postService = {
  getAll(inputParams = {}) {
    return API.call().get("wp/v2/posts", {
      params: {
        per_page: 3,
        page: 1,
        lang: localStorage.getItem("LANG") || "vi",
        ...inputParams,
      },
    });
  },

  // xong
  // getAllPosts(params = {}) {
  //   console.log(params);
    
  //   return this.getAll({ page: params.pageNumber });
  // },
  getAllPosts(params = {}) {
    return API.callWithToken().get(`/wp/v2/posts?`, {
      params: {
        per_page: 3,
        page: params.pageNumber || 1,
        lang: localStorage.getItem("LANG") || "vi",
        status: ['publish','pending','draft']
      }
    });
  },

  // xong
  getGeneral({ page, lang }) {
    return this.getAll({ per_page: 2, page: page || 1, lang });
  },

  // xong
  getLatest(params = {}) {
    return this.getAll({ ...params });
  },

  // xong
  getPopular(params = {}) {
    return this.getAll({ orderby: "post_views", ...params });
  },

  //xong, truyền luôn object r lên đây mới gọi ra, khác với cái general bên trên
  getRelated(params = {}) {
    return this.getAll({ author: params.author, exclude: params.id });
  },

  // xong
  getById(postId) {
    return API.call().get(`/wp/v2/posts/${postId}`);
  },

  // lấy bài viết qua id category
  getByCategory({page, id}) {
    return this.getAll({
      page,
      categories: id, 
    });
  },

  // lấy bài viết qua id tag
  getByTag({page, id}) {
    return this.getAll({
      page,
      tags: id, 
    });
  },

  // xong
  getBySearch(params = {}) {
    return this.getAll({
      per_page: 1,
      page: params.pageNumber,
      search: params.valueSearch,
      lang: params.lang
    });
  },

  // xong
  getByCateOrTag(params = {}) {
    return this.getAll({
      categories: params.categories,
      tags: params.tags
    });
  },

  // xong
  createPost({values, lang}) {
    // sao chỗ này lại là ...values
    return API.callWithToken().post("wp/v2/posts", { ...values, lang: lang });
  },

  // xong
  updatePost({ postId, values }) {
    return API.callWithToken().put(`wp/v2/posts/${postId}`, values);
  },

  // xong
  deletePost(postId) {
    return API.callWithToken().delete(`wp/v2/posts/${postId}`, {
      params: { force: true },
    });
  },
  
};

export default postService;
