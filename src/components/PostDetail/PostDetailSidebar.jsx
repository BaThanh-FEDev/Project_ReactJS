import { useSelector } from "react-redux";
import PostDetailAuthor from "./PostDetailAuthor"
import PostDetailRelatedPosts from "./PostDetailRelatedPosts"

function PostDetailSidebar() {
  const postDetail = useSelector((state) => state.POST.postDetail)
  if(!postDetail ) return <></>;
  
  const author = postDetail.author_data.nickname;
  const avatar = postDetail.author_data.avatar;
  const desc = postDetail.excerpt.rendered;
  
  return (
    <div className="post-detail__side">
      <PostDetailAuthor
        author={author}
        avatar={avatar}
        desc={desc}
      />
      <div className="spacing" />
      <PostDetailRelatedPosts />
    </div>
  )
}

export default PostDetailSidebar