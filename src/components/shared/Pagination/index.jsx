import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllPosts } from "../../../store/postSlice";
import "./pagination.css";

function Pagination() {
  const dispatch = useDispatch();
  const pageNumber = useSelector((state) => state.POST.postAll.currentPage);
  const totalPage = useSelector(
    (state) => state.POST.postAll.totalPage
  );

  const paginationArray = [...Array(totalPage)].map((_, i) => i + 1);

  const handlePaginationChange = (event, direction) => {
    event.preventDefault();
    const newPageNumber =
      direction === "prev" ? pageNumber - 1 : pageNumber + 1;

    if (
      (direction === "prev" && pageNumber > 1) ||
      (direction === "next" && pageNumber < totalPage)
    ) {
      dispatch(fetchAllPosts({ pageNumber: newPageNumber }));
    }
  };

  const handlePagination = (event) => {
    event.preventDefault();
    const currentPage = parseInt(event.target.innerText);
    dispatch(fetchAllPosts({ pageNumber: currentPage }));
    // history.push(`/admin/articles?page=${currentPage}`);
  };

  return (
    <ul className="custom-pagination" id="pagination">
      <li className="btn-prev">
        <Link
          to="#"
          className={pageNumber === 1 ? "disabled-link cursor-text" : ""}
          onClick={
            pageNumber === 1
              ? (e) => e.preventDefault()
              : (e) => handlePaginationChange(e, "prev")
          }
        >
          Previous
        </Link>
      </li>
      {paginationArray.map((item, index) => (
        <li key={index} className="page-item">
          <Link
            to="#"
            onClick={handlePagination}
            className={index + 1 === pageNumber ? "is-active" : ""}
          >
            {item}
          </Link>
        </li>
      ))}
      <li className="btn-next">
        <Link
          to="#"
          className={
            pageNumber === totalPage ? "disabled-link cursor-text" : ""
          }
          onClick={
            pageNumber === totalPage
              ? (e) => e.preventDefault()
              : (e) => handlePaginationChange(e, "next")
          }
        >
          Next
        </Link>
      </li>
    </ul>
  );
}

export default Pagination;
