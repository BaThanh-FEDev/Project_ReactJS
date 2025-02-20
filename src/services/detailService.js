import API from './api';

const detailService = {
  getDetail(slug) {
    return API.call().get(`wp/v2/posts?slug=${slug}`);
  },
};

export default detailService;
