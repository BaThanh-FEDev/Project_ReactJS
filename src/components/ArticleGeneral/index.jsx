import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneralPost } from "../../store/postSlice";
import ArticleItem from "../ArticleItem";
import Button from "../shared/Button";
import MainTitle from "../shared/MainTitle";
import { t } from "i18next";

function ArticleGeneral() {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.CONFIG.lang);
  const postsGeneral = useSelector(
    (state) => state.POST.postsGeneral.postsList
  );
  const pageNumber = useSelector(
    (state) => state.POST.postsGeneral.currentPage
  );
  const totalPage = parseInt(
    useSelector((state) => state.POST.postsGeneral.totalPage)
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchGeneralPost({ pageNumber, lang }));
  }, [lang]);

  function handleLoadMore() {
    setLoading(true);
    dispatch(fetchGeneralPost({ pageNumber: pageNumber + 1, lang })).then(
      () => {
        setLoading(false);
      }
    );
  }
  const buttonLoadMore = pageNumber !== totalPage && (
    <Button
      onClick={handleLoadMore}
      type="primary"
      size="large"
      loading={loading}
      disabled={loading}
    >
      {t("viewMore")}
    </Button>
  );

  return (
    <div className="articles-list section">
      <div className="tcl-container">
        <MainTitle>{t("generalArticles")}</MainTitle>
        <div className="tcl-row">
          {postsGeneral.map((item, index) => {
            return (
              <div key={index} className="tcl-col-12 tcl-col-md-6">
                <ArticleItem isStyleCard isShowAvatar={false} data={item} />
              </div>
            );
          })}
        </div>
        <div className="text-center">{buttonLoadMore}</div>
      </div>
    </div>
  );
}

export default ArticleGeneral;
