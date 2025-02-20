/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { formattedDate } from "../../../helpers/myDayjs";
import { fetchChildComments, getParentId, isFocusForm, resetFocus } from "../../../store/commentSlice";
import CommentReplay from "./CommentReplay";
import { useState } from "react";

function CommentItem(props) {
  const dispatch = useDispatch();
  const postDetail = useSelector((state) => state.POST.postDetail);
  const commentReplayList = useSelector(
    (state) => state.COMMENT.commentReplayList
  );
  const { item } = props;
  const {
    id,
    content,
    author_data: authorData,
    date,
    comment_reply_count: commentReplyCount,
  } = item;
  const { avatar, nick_name: nickName } = authorData;
  const contentRendered = content.rendered
    .replace("<p>", "")
    .replace("</p>", "");
  const dateFormatted = formattedDate(date);

  const filterCommentReplayList = commentReplayList.filter(
    (childItem) => childItem.parent === id
  );
  
  const filterCommentReplayListLength = filterCommentReplayList.length;
  const xhtmlChildComments = filterCommentReplayList.map((childItem, index) => (
    <CommentItem key={index} item={childItem} />
  ));
  const isShowLoadMore =
    commentReplyCount > 0 && filterCommentReplayListLength != commentReplyCount;
  const newReplayComment = useSelector(
      (state) => state.COMMENT.newReplayComment
    );

  function handleLoadReplayComments(e) {
    e.preventDefault();

    dispatch(resetFocus());  
    dispatch(
      fetchChildComments({
        idPost: postDetail.id,
        parent: id,
        perPage: commentReplyCount,
      })
    );
  }
  function handleReplayComment(e) {
    const parentId = id;
    dispatch(getParentId(parentId));
    dispatch(isFocusForm("click"))
  }

  return (
    <li className="item">
      <div className="comments__section">
        <div className="comments__section--avatar">
          <a href="/">
            <img src={avatar} alt="" />
          </a>
        </div>
        <div className="comments__section--content">
          <a href="/" className="comments__section--user">
            {nickName}
          </a>
          <p className="comments__section--time">
            {dateFormatted} - ID: {id}
          </p>
          <div className="comments__section--text">{contentRendered}</div>
          <i className="ion-reply comments__section--reply" onClick={handleReplayComment}></i>
        </div>
      </div>
      <ul className="comments">
          {item.parents === newReplayComment.id && <CommentReplay/>}
      </ul>
      {filterCommentReplayListLength > 0 && (
        <ul className="comments">
          {/* {item.parents === newReplayComment.id && <CommentReplay/>} */}
          {xhtmlChildComments}
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
