/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { formattedDate } from "../../../helpers/myDayjs";
import { fetchChildComments, getParentIdComment } from "../../../store/commentSlice";
import CommentReplay from "./CommentReplay";
import { useState } from "react";
import "./comment.css"
import CommentForm from "./CommentForm";

function CommentItem(props) {
  const dispatch = useDispatch();
  
  const postDetail = useSelector((state) => state.POST.postDetail);

  const { item } = props;
  const {id, content, authorData, date, commentReplyCount} = item;
  const { avatar, nickName } = authorData || {};
  
  const contentRendered = content.replace("<p>", "").replace("</p>", "");
  const dateFormatted = formattedDate(date);
  
  const commentReplayList = useSelector((state) => state.COMMENT.commentReplayList);
  const filterCommentReplayList = commentReplayList.filter((childItem) => childItem.parent === id);
  const filterCommentReplayListLength = filterCommentReplayList.length;
  const [isShowReplyForm, setIsShowReplyForm] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const newReplayComment = useSelector((state) => state.COMMENT.newReplayComment);

  const totalRepliesLoaded = commentReplayList.filter(childItem => childItem.parent === id).length;
  const isShowLoadMore = commentReplyCount > 0 && totalRepliesLoaded < commentReplyCount;

  
  
  

  function handleLoadReplayComments(e) {
    e.preventDefault();
    dispatch(
      fetchChildComments({
        idPost: postDetail.id,
        parent: id,
        perPage: commentReplyCount,
      })
    );
  }
  function handleReplayComment(e) {
    if (!isShowReplyForm) {
      dispatch(getParentIdComment(id)); 
      setIsFocus(true)
    } else {
      dispatch(getParentIdComment(null));
    }
    setIsShowReplyForm(!isShowReplyForm);
  }

  return (
    <li className="item">
      <div className="comments__section">
        <div className="comments__section--avatar">
          <a href="#" onClick={(e) => e.preventDefault()}>
            <img src={avatar} alt="" />
          </a>
        </div>
        <div className="comments__section--content">
          <a href="#" onClick={(e) => e.preventDefault()} className="comments__section--user">
            {nickName}
          </a>
          <p className="comments__section--time">
            {dateFormatted} - ID: {id}
          </p>
          <div className="comments__section--text">{contentRendered}</div>
          <a className="ion-reply comments__section--reply" onClick={handleReplayComment}></a>
        </div>
      </div>
      {isShowReplyForm && <CommentForm  isFocus={isFocus} onCloseForm={() => setIsShowReplyForm(false)} />}
      {filterCommentReplayListLength > 0 && (
        <ul className="comments">
          {item.parents === newReplayComment.id && <CommentReplay/>}
          {
            filterCommentReplayList.map((childItem, index) => (
              <CommentItem key={index} item={childItem} />
            ))
          }
        </ul>
      )}


      {isShowLoadMore && (
        <div className="comments__hidden">
          <a href="/" onClick={handleLoadReplayComments}>
            <i className="icons ion-ios-undo" />
            Xem thêm {commentReplyCount} câu trả lời
          </a>
        </div>
      )}
    </li>
  );
}

export default CommentItem;
