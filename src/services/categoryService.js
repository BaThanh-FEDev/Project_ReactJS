import API from "./api";

const categoryService = {
  getAll(inputParams = {}) {
    return API.call().get("wp/v2/categories", {
      params: {
        per_page: 100,
        page: 1,
        // lang: inputParams.lang,
        lang: localStorage.getItem("LANG") || "vi",
        ...inputParams,
      },
    });
  },

  // xong
  getCategoryBySlug(params = {}) {
    return API.call().get(
      `wp/v2/categories?slug=${params.slug}`, {
        params: {
          lang: params.lang
        }
      }
    );
  },

  // xong
  getAllCategories() {
    return this.getAll()
  },

  //xong
  getCategoryById(categoryId) {
    return API.call().get(`wp/v2/categories/${categoryId}`);
  },

  getAllCateInAdmin(params = {}) {
    return this.getAll({
      per_page: params.per_page,
      page: params.page,
      search: params.search,
    });
  },

  //xong
  createCategory(categoryData) {
    return API.callWithToken().post("wp/v2/categories", categoryData, {
      params: {
        lang: "vi",
      },
    });
  },

  //xong
  updateCategory({ categoryId, values }) {
    return API.callWithToken().put(`wp/v2/categories/${categoryId}`, values);
  },

  // xong
  deleteCategory(categoryId) {
    return API.callWithToken().delete(`wp/v2/categories/${categoryId}`, {
      params: { force: true },
    });
  },

};

export default categoryService;
