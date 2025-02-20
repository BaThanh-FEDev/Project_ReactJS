import { useSelector } from "react-redux";
import { formattedDate } from "../../helpers/myDayjs";

function PostDetailHead() {
  const postDetail = useSelector((state) => state.POST.postDetail);
  if (!postDetail) return <></>;

  const title = postDetail.title.rendered;
  const author = postDetail.author_data.nickname;
  const date = formattedDate(postDetail.date);
  const viewCount = postDetail.view_count;
  const commentCount = postDetail.comment_count;

  return (
    <div className="post-detail__head">
      <div className="tcl-container">
        <h1 className="post-detail__title">{title}</h1>
        <ul className="post-detail__info">
          <li className="item author">
            By{" "}
            <a href="/">
              <strong>{author}</strong>
            </a>
          </li>
          <li className="item date">{date}</li>
          <li className="item views">
            {viewCount} <i className="icons ion-ios-eye" />
          </li>
          <li className="item comments">
            {commentCount} <i className="icons ion-ios-chatbubble" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default PostDetailHead;
