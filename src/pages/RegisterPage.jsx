import "./LoginPage/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Button, Typography, Input } from "antd";
import { userRegister } from "../store/userSlice";
import { alertSuccess } from "../helpers/toastify";
import { useAuthenticate } from "../hooks/useAuthenticate";
import { t } from "i18next";

function RegisterPage() {
  useAuthenticate();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const onSubmit = async (values) => {
    try {
      await dispatch(userRegister(values));
      reset();
      alertSuccess("Đăng ký tài khoản thành công!");
      navigate("/login");
    } catch (error) {
      console.error("Đăng ký thất bại: ", error);
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
                {t("register")}
              </Typography.Title>
              <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div className="form-group">
                  <label>Email</label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Vui lòng nhập email!",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                        message: "Email phải là @gmail.com!"
                      }
                    }}
                    render={({ field }) => <Input {...field} placeholder="...@gmail.com" autoComplete="email" />}
                  />
                  {errors.email && <p className="error-text">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                  <label>Nickname</label>
                  <Controller
                    name="nickname"
                    control={control}
                    rules={{ required: "Vui lòng nhập nickname!" }}
                    render={({ field }) => <Input {...field} placeholder="...nickname" />}
                  />
                  {errors.nickname && <p className="error-text">{errors.nickname.message}</p>}
                </div>

                <div className="form-group">
                  <label>{t("username")}</label>
                  <Controller
                    name="username"
                    control={control}
                    rules={{ required: "Vui lòng nhập tên đăng nhập!" }}
                    render={({ field }) => <Input {...field} placeholder="Tên đăng nhập" />}
                  />
                  {errors.username && <p className="error-text">{errors.username.message}</p>}
                </div>

                <div className="form-group">
                  <label>{t("password")}</label>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: "Vui lòng nhập mật khẩu!" }}
                    render={({ field }) => <Input.Password {...field} placeholder="Nhập mật khẩu" autoComplete="password" />}
                  />
                  {errors.password && <p className="error-text">{errors.password.message}</p>}
                </div>

                <div className="form-group button">
                  <Button type="primary" htmlType="submit" shape="round" size="middle">
                    {t("register")}
                  </Button>
                  <Link to="/login">{t("login?")}</Link>
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

export default RegisterPage;
