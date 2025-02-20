import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PostDetailContent from "../components/PostDetail/PostDetailContent";
import PostDetailHead from "../components/PostDetail/PostDetailHead";
import PostDetailSidebar from "../components/PostDetail/PostDetailSidebar";
import { getPostDetail, fetchRelatedPosts } from "../store/postSlice";
import { getTagsByIdPost } from "../store/tagsSlice";

function PostDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const postDetail = useSelector((state) => state.POST.postDetail);

  useEffect(() => {
    dispatch(getPostDetail(slug));
  }, [slug, dispatch]);

  useEffect(() => {
    if (postDetail) {
      dispatch(fetchRelatedPosts({ author: postDetail.author, id: postDetail.id }));
      dispatch(getTagsByIdPost(postDetail.id));
    }
  }, [postDetail, dispatch]);

  return (
    <main className="post-detail">
      <div className="spacing" />
      <PostDetailHead />
      <div className="spacing" />
      <div className="post-detail__fluid">
        <div className="tcl-container">
          <div className="post-detail__wrapper">
            <PostDetailContent />
            <PostDetailSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}

export default PostDetailPage;
