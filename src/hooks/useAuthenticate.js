import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function useAuthenticate() {
  const navigate = useNavigate();
  // chống vào trang đăng nhập, đăng ký khi đã đăng nhập rồi
  const token = useSelector((state) => state.USER.token);
  

  useEffect(() => {
    if (token) navigate('/');
  }, [token])
}
