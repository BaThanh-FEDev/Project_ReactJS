import { t } from "i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPopularPost } from "../../store/postSlice";
import ArticleItem from "../ArticleItem";
import MainTitle from "../shared/MainTitle";
import "./popular-news-list.css";

function ArticlePopular() {
  const disaptch = useDispatch();
  const postsPopular = useSelector((state) => state.POST.postsPopular);
  const lang = useSelector((state) => state.CONFIG.lang);

  useEffect(() => {
    disaptch(fetchPopularPost());
  }, [lang]);

  return (
    <div className="popular-news section bg-white-blue">
      <div className="tcl-container">
        {/* Main Title */}
        <div className="main-title spacing d-flex tcl-jc-between tcl-ais-center">
        <MainTitle>{t("popularArticles")}</MainTitle>
          <Link to="/" className="btn btn-default">
           {t("viewMore")}
          </Link>
        </div>
        {/* End Main Title */}
        <div className="popular-news__list spacing">
          <div className="popular-news__list--left">
          <div className="popular-news__list--row">
            {postsPopular.slice(0, 2).map((post, index) => (
              <div key={index} className="popular-news__list--card">
                <ArticleItem
                  isStyleCard
                  isShowCategoies
                  isShowDesc
                  data={post}
                />
              </div>
            ))}
          </div>
          </div>
          <div className="popular-news__list--right">
            <div className="popular-news__list--row">
              <div className="popular-news__list--card">
                <ArticleItem
                  isStyleCard
                  isStyleRow
                  isShowDesc
                  data={postsPopular[2]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlePopular;
