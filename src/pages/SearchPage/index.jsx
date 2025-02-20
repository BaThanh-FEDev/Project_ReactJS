import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import ArticleItem from "../../components/ArticleItem";
import MainTitle from "../../components/shared/MainTitle";
import { searchPostByKeyword } from "../../store/postSlice";
import { message } from "antd";
import "./search.css";
import { t } from "i18next";

function SearchPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const valueSearch = searchParams.get("keyword");
  const {
    searchList,
    currentPage: pageNumber,
    totalPage,
  } = useSelector((state) => state.POST.postSearch);

  useEffect(() => {
    if (valueSearch === "") {
      message.warning("Mời nhập từ khóa tìm kiếm");
    } else {
      dispatch(searchPostByKeyword({ valueSearch, pageNumber: 1 }));
    }
  }, [valueSearch, dispatch]);

  const hiddenPagination = searchList.length === 0 ? "hidden" : "";
  const paginationArray = useMemo(() => {
    return Array.from({ length: totalPage }, (_, index) => index + 1);
  }, [totalPage]);

  const handlePagination = (event) => {
    event.preventDefault();
    const currentPage = parseInt(event.target.innerText);
    dispatch(searchPostByKeyword({ valueSearch, pageNumber: currentPage }));
  };

  const handleButtonPrev = (event) => {
    event.preventDefault();
    if (pageNumber > 1) {
      dispatch(
        searchPostByKeyword({ valueSearch, pageNumber: pageNumber - 1 })
      );
    }
  };

  const handleButtonNext = (event) => {
    event.preventDefault();
    if (pageNumber < totalPage) {
      dispatch(
        searchPostByKeyword({ valueSearch, pageNumber: pageNumber + 1 })
      );
    }
  };

  const resultSearch =
    valueSearch === ""
      ? ""
      : `${searchList.length} ${t("resultSearch")} "${valueSearch}"`;

  const renderPagination = useMemo(() => {
    return paginationArray.map((item, index) => {
      const active = index + 1 === pageNumber ? "is-active" : "";
      return (
        <li key={index} className="page-item">
          <Link to="#" onClick={handlePagination} className={active}>
            {item}
          </Link>
        </li>
      );
    });
  }, [paginationArray, pageNumber]);

  const prevClass = pageNumber === 1 ? "disable" : "";
  const nextClass = pageNumber === totalPage ? "disable" : "";

  return (
    <div className="articles-list section">
      <div className="tcl-container">
        <MainTitle type="search">{resultSearch}</MainTitle>
        <div className="tcl-row tcl-jc-center">
          {searchList.map((item, index) => (
            <div key={index} className="tcl-col-12 tcl-col-md-8">
              <ArticleItem
                valueSearch={valueSearch}
                data={item}
                isStyleCard
                isShowCategoies={false}
                isShowDesc
              />
            </div>
          ))}
        </div>
        <div className="text-center">
          <ul className="s-pagination" id="pagination">
            <li className={`btn btn-prev ${hiddenPagination}`}>
              <Link to="#" className={prevClass} onClick={handleButtonPrev}>
                Prev
              </Link>
            </li>
            {renderPagination}
            <li className={`btn btn-next ${hiddenPagination}`}>
              <Link to="#" className={nextClass} onClick={handleButtonNext}>
                Next
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
