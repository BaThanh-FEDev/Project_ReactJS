import API from "./api";

const menuService = {
  getMenu(lang) {
    return API.call().get(`menus/v1/menus/main-menu-${lang}`);
  },
};

export default menuService;
