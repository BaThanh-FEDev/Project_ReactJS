import { useDispatch, useSelector } from "react-redux";
import "./comments.css";
import CommentForm from "./comments/CommentForm";
import CommentItem from "./comments/CommentItem";
import CommentItemNew from "./comments/CommentItemNew";
import { useState } from "react";
import { fetchComments, resetFocus } from "../../store/commentSlice";

function PostDetailComments() {
  const commentList = useSelector((state) => state.COMMENT.commentList);
  const totalComment = useSelector((state) => state.COMMENT.totalComment);
  const currentPageComment = useSelector((state) => state.COMMENT.currentPageComment);
  const restCommentCount = totalComment - commentList.length;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const postDetail = useSelector((state) => state.POST.postDetail);
  // const newComment = useSelector((state) => state.COMMENT.newComment);

  const isFocus = useSelector((state) => state.COMMENT.isFocus);
  
  
  const xhtmlComments = commentList.map((item, index) => {
    return <CommentItem item={item} key={index} />;
  });

  function handleLoadMore(e) {
    e.preventDefault();
    setLoading(true);
    dispatch(resetFocus());
    dispatch(
      fetchComments({
        idPost: postDetail.id,
        currentPage: currentPageComment + 1,
      })
    ).then((res) => {
      setLoading(false);
    });
  }

  // const xhtmlNewComment = newComment.map((item, index) => {
  //   return <CommentItemNew key={index} item={item} />
  // })

  return (
    <div className="post-detail__comments">
      <CommentForm />
      <p>{totalComment} Comments</p>
      <ul className="comments">
        {/* {xhtmlNewComment} */}
        <CommentItemNew/>
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
