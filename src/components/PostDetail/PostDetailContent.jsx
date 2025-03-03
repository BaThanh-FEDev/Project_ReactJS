import { useSelector } from "react-redux";
import "./post-detail.css";
import PostDetailComments from "./PostDetailComments";
import PostDetailRichText from "./PostDetailRichText";
import PostDetailTags from "./PostDetailTags";
import { formattedDate } from "../../helpers/myDayjs";

function PostDetailContent() {
  const postDetail = useSelector((state) => state.POST.postDetail);
  if (!postDetail) return <></>;

  const image = postDetail.image;
  const content = postDetail.content;
  const tags = postDetail.tagsIds;
  const avatar = postDetail.authorData.avatar;
  const excerpt = postDetail.description;
  const modifiedTime = formattedDate(postDetail.publishDate);
  const commentCount = postDetail.commentCount;
  const commentName = postDetail.authorData.nickname;

  return (
    <div className="post-detail__content">
      <div className="thumbnail">
        <img src={image} alt="blog-title" />
      </div>

      <div className="content-padding">
        <PostDetailRichText content={content} />
        <PostDetailTags tags={tags} />
        <PostDetailComments
          avatar={avatar}
          commentCount={commentCount}
          excerpt={excerpt}
          modifiedTime={modifiedTime}
          commentName={commentName}
        />
      </div>
    </div>
  );
}

export default PostDetailContent;
