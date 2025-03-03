import { t } from "i18next";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/shared/Button";
import { fetchPagingPost } from "../store/postSlice";

export function usePostsPaging() {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.CONFIG.lang);
  const [loading, setLoading] = useState(false);

  const posts = useSelector(
    (state) => state.POST.postsPaging.list
  );
  const pageNumber = useSelector(
    (state) => state.POST.postsPaging.currentPage
  );
  const totalPage = parseInt(
    useSelector((state) => state.POST.postsPaging.totalPage)
  );

  function handleLoadMore() {
    setLoading(true);
    dispatch(fetchPagingPost({ pageNumber: pageNumber + 1, lang })).then(
      () => {
        setLoading(false);
      }
    );
  }

  function showButtonLoadMore() {
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

    return buttonLoadMore;
  }

  return {
    posts,
    lang,
    showButtonLoadMore,
  };
}
