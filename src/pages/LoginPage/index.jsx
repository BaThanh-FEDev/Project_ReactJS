import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography } from "antd";
import { useAuthenticate } from "../../hooks/useAuthenticate";
import { getUserLogin } from "../../store/userSlice";
import "./login.css";
import { alertSuccess } from "../../helpers/toastify";
import { t } from "i18next";

function LoginPage() {
  useAuthenticate();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    try {
      const res = await dispatch(getUserLogin(values));
      const payload = res.payload;
      if (payload.status) {
        navigate("/admin/dashboard");
      } else {
        setError(payload.error);
        // message.error(payload.error);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
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
              <Form
                name="login"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label={t("username")}
                  name="username"
                  rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                  <Input placeholder="Nhập tên đăng nhập ..." autoComplete="username"/>
                </Form.Item>

                <Form.Item
                  label={t("password")}
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                  <Input.Password placeholder="Nhập mật khẩu của bạn ..." autoComplete="current-password" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="middle" shape="round">
                    {t("login")}
                  </Button>
                  <Link to="/register">{t("register?")}</Link>
                </Form.Item>
              </Form>
            </div>
            
          </div>
        </div>
      </div>
      <div className="spacing" />
    </main>
  );
}

export default LoginPage;
