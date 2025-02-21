import { useDispatch, useSelector } from "react-redux";
import "./comments.css";
import CommentForm from "./comments/CommentForm";
import CommentItem from "./comments/CommentItem";
import { useState } from "react";
import { fetchComments } from "../../store/commentSlice";

function PostDetailComments() {
  const commentList = useSelector((state) => state.COMMENT.commentData.commentList);
  const totalComment = useSelector((state) => state.COMMENT.commentData.totalComment);
  const currentPage = useSelector((state) => state.COMMENT.commentData.currentPage);
  const restCommentCount = totalComment - commentList.length;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const postDetail = useSelector((state) => state.POST.postDetail);

  
  
  const xhtmlComments = commentList.map((item, index) => {
    return <CommentItem item={item} key={index} />;
  });

  function handleLoadMore(e) {
    e.preventDefault();
    setLoading(true);
    dispatch(
      fetchComments({
        idPost: postDetail.id,
        currentPage: currentPage + 1,
      })
    ).then((res) => {
      setLoading(false);
    });
  }

  return (
    <div className="post-detail__comments">
      <CommentForm />
      <p>{totalComment} Comments</p>
      <ul className="comments">
        {xhtmlComments}
      </ul>
      {restCommentCount > 0 && (
        <div className="comments__hidden parent">
          <a href="/" onClick={handleLoadMore} >
            <i className="icons ion-ios-undo" />
            Xem thêm {restCommentCount} bình luận
          </a>
        </div>
      )}
    </div>
  );
}

export default PostDetailComments;
