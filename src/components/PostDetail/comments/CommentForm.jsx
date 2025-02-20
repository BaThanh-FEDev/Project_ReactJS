import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postNewOrReplayComment, resetFocus } from "../../../store/commentSlice";

function CommentForm() {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const userInfor = useSelector((state) => state.USER.userInfor);
  const postDetail = useSelector((state) => state.POST.postDetail);
  const parentId = useSelector((state) => state.COMMENT.parentId);
  const isFocus = useSelector((state) => state.COMMENT.isFocus);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isFocus === "click" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isFocus]);
  
  if(!userInfor) return <></>

  const dataComment = {
    post: postDetail.id,
    author: userInfor.id,
    content: value,
    parent: 0
  }
  const dataReplayComment = {
    post: postDetail.id,
    author: userInfor.id,
    content: value,
    parent: parentId
  }
  if (isFocus !== "") {
    textareaRef.current?.focus();
  }
  

  function handleChange(e) {
    const target = e.target;
    setValue(target.value);
  }

  function handleSubmit() {
    if(parentId) {
      dispatch(postNewOrReplayComment(dataReplayComment)).then((res) => {
        setValue("")
        dispatch(resetFocus()); 
      })
    }
    else {
      dispatch(postNewOrReplayComment(dataComment)).then((res) => {
        setValue("")
        dispatch(resetFocus()); 
      });
    }
    
  }

  return (
    <div className="comments__form">
      <div className="comments__form--control">
        <div className="comments__section--avatar">
          <a href="/">
            <img src="/assets/images/avatar1.jpg" alt="" />
          </a>
        </div>
        <textarea ref={textareaRef} onChange={handleChange} value={value} id="formComment" />

      </div>
      <div className="text-right">
        <button className="btn btn-default" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default CommentForm;
