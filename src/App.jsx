import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProfilePage from "./pages/Admin/Auth/Profile";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import PostDetailPage from "./pages/PostDetailPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import TagsPage from "./pages/TagsPage";
import ArticlesPage from "./pages/Admin/Articles";
import { fetchCategory } from "./store/categorySlice";
import { userGetInfor } from "./store/userSlice";
import ChangePassword from "./pages/Admin/Auth/ChangePassword";
import ArticleCreatePage from "./pages/Admin/Articles/ArticleCreatePage";
import CategoriesIndexPage from "./pages/Admin/Categories";
import TagsIndexPage from "./pages/Admin/Tags";
import ArticleEditPage from "./pages/Admin/Articles/ArticlesEditPage";
import Dashboard from "./pages/Admin/Auth";
import { fetchTagsName } from "./store/tagsSlice";
import { Spin } from "antd";
import "./assets/css/main.css"

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const lang = useSelector((state) => state.CONFIG.lang);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(userGetInfor());
    dispatch(fetchCategory());
    dispatch(fetchTagsName())
  }, [dispatch, lang]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     await Promise.all([
  //       dispatch(userGetInfor()),
  //       dispatch(fetchCategory()),
  //       dispatch(fetchTagsName()),
  //     ]);
  //     setIsLoading(false);
  //   };
  //   fetchData();
  // }, [dispatch, lang]);

  const routes = [
    { path: "/", element: () => <HomePage /> },
    { path: "login", element: () => <LoginPage /> },
    { path: "register", element: () => <RegisterPage /> },
    { path: "search", element: () => <SearchPage /> },
    { path: "post/:slug", element: () => <PostDetailPage /> },
    { path: "category/:slug", element: () => <CategoryPage /> },
    { path: "tag/:slug", element: () => <TagsPage /> },
    { path: "abc", element: () => <NotFoundPage /> },
    { path: "admin/dashboard", element: () => <Dashboard/> },
    { path: "admin/profile", element: () => <ProfilePage /> },
    { path: "admin/changepassword", element: () => <ChangePassword /> },
    { path: "admin/articles", element: () => <ArticlesPage /> },
    { path: "admin/articles/create", element: () => <ArticleCreatePage /> },
    { path: "admin/articles/:id/edit", element: () => <ArticleEditPage /> },
    { path: "admin/categories", element: () => <CategoriesIndexPage /> },
    { path: "admin/tags", element: () => <TagsIndexPage /> },
    { path: "*", element: () => <NotFoundPage /> },
  ];
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isNotFoundRoute = !routes.some(route => route.path === location.pathname);

  return (
    <div className="wrapper-content">
      {!isAdminRoute && <Header />}
      {/* {isLoading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      )} */}
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element()} />
        ))}
      </Routes>
      {!isAdminRoute && <Footer />}
      <div className="spacing" />
    </div>
  );
}

export default App;
