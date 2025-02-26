import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Button, Typography, Input } from "antd";
import { useAuthenticate } from "../../hooks/useAuthenticate";
import { getUserLogin } from "../../store/userSlice";
import "./login.css";
import { t } from "i18next";

function LoginPage() {
  useAuthenticate();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const onSubmit = async (values) => {
    try {
      const res = await dispatch(getUserLogin(values));
      const payload = res.payload;
      if (payload && payload.status) {
        navigate("/admin/dashboard");
      } else {
        setError(payload?.error || "Đăng nhập thất bại.");
      }
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <main className="login">
      <div className="spacing" />
      <div className="tcl-container">
        <div className="tcl-row">
          <div className="tcl-col-12 tcl-col-sm-5 block-center">
            <div className="boxLogin">
              <Typography.Title level={2} className="text-center">
                {t("login")}
              </Typography.Title>
              {error && <div className="errorMessage">{error}</div>}
              <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div className="form-group">
                  <label>{t("username")}</label>
                  <Controller
                    name="username"
                    control={control}
                    rules={{ required: "Vui lòng nhập tên đăng nhập!" }}
                    render={({ field }) => <Input {...field} placeholder="Nhập tên đăng nhập ..." autoComplete="username" />}
                  />
                  {errors.username && <p className="error-text">{errors.username.message}</p>}
                </div>

                <div className="form-group">
                  <label>{t("password")}</label>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: "Vui lòng nhập mật khẩu!" }}
                    render={({ field }) => <Input.Password {...field} placeholder="Nhập mật khẩu của bạn ..." autoComplete="current-password" />}
                  />
                  {errors.password && <p className="error-text">{errors.password.message}</p>}
                </div>

                <div className="form-group button">
                  <Button type="primary" htmlType="submit" size="middle" shape="round">
                    {t("login")}
                  </Button>
                  <Link to="/register">{t("register?")}</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="spacing" />
    </main>
  );
}

export default LoginPage;
