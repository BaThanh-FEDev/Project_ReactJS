import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getParentIdComment, postNewOrReplayComment } from "../../../store/commentSlice";
import { message } from "antd";

function CommentForm({onCloseForm, isFocus}) {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const userInfor = useSelector((state) => state.USER.userInfor);
  const postDetail = useSelector((state) => state.POST.postDetail);
  const parentId = useSelector((state) => state.COMMENT.parentId);
  const textareaRef = useRef(null);
  
  if (!userInfor) return <></>;

  const [dataComment, setDataComment] = useState({
    post: postDetail.id,
    author: userInfor.id,
    content: "",
    parent: 0,
  });

  useEffect(() => {
    setDataComment((prev) => ({
      ...prev,
      parent: parentId || 0,
    }));
  }, [parentId]);

  useEffect(() => {
    if (isFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isFocus]);


  function handleChange(e) {
    setValue(e.target.value);
  }
  
  function handleSubmit() {
    if (!value.trim()) {
      message.warning("Nội dung bình luận không được để trống!");
      return;
    }
    const newComment = { ...dataComment, content: value };
    dispatch(postNewOrReplayComment(newComment)).then(() => {
      setValue("");
      if (parentId) {
        dispatch(getParentIdComment(null));
        onCloseForm(false);
      }
    });
  }


  function handleCancel() {
    onCloseForm(false);
  }
  

  return (
    <div className="comments__form">
      <div className="comments__form--control">
        <div className="comments__section--avatar">
          <a href="#" onClick={(e) => e.preventDefault()}>
            <img src={userInfor?.simple_local_avatar.full} alt={userInfor.nickname} />
          </a>
        </div>
        <textarea ref={textareaRef} onChange={handleChange} value={value} id="formComment" />
      </div>
      <div className="text-right handleButtonForm">
        {parentId && <button className="btn btn-default" onClick={handleCancel}>
            Cancel
          </button>}
        <button className="btn btn-default" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default CommentForm;
