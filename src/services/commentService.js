import API from './api';

const commentService = {
  getComments(params = {}) {
    const { idPost, currentPage } = params;
    return API.call().get(`wp/v2/comments`, {
      params: {
        per_page: 5,
        parent: 0,
        order: 'asc',
        page: currentPage,
        post: idPost,
      },
    });
  },

  getChildComments(params = {}) {
    const { idPost, parent, perPage } = params;
    return API.call().get(`wp/v2/comments`, {
      params: {
        per_page: perPage,
        post: idPost,
        parent: parent,
      },
    });
  },
  postNewOrReplay(data) {
    return API.callWithToken().post(`wp/v2/comments`, data);
  },
};

export default commentService;
