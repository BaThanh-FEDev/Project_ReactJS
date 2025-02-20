import "./LoginPage/login.css";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography } from "antd";
import { useDispatch } from "react-redux";
import { userRegister } from "../store/userSlice";
import { alertSuccess } from "../helpers/toastify";
import { useAuthenticate } from "../hooks/useAuthenticate";
import { t } from "i18next";

function RegisterPage() {
  useAuthenticate();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await dispatch(userRegister(values)).then(() => {
        form.resetFields();
        alertSuccess("Đăng ký tài khoản thành công!");
        navigate("/login");
      });
    } catch (error) {
      message.error("Đăng ký thất bại. Vui lòng thử lại.");
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
              <Form
                form={form}
                name="register"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, message: 'Email phải là @gmail.com!' }
                  ]}
                >
                  <Input placeholder="Nhập Email" autoComplete="email"/>
                </Form.Item>

                <Form.Item
                  label="Nickname"
                  name="nickname"
                  rules={[{ required: true, message: 'Vui lòng nhập nickname!' }]}
                >
                  <Input placeholder="Nhập Nickname" />
                </Form.Item>

                <Form.Item
                  label={t("username")}
                  name="username"
                  rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                  <Input placeholder="Nhập tên đăng nhập" />
                </Form.Item>

                <Form.Item
                  label={t("password")}
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" autoComplete="password"/>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" shape="round" size="middle">
                  {t("register")}
                    </Button>
                    <Link to="/login">{t("login?")}</Link>
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

export default RegisterPage;