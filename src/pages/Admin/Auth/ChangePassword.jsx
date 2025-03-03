import { Breadcrumb, Button, Form, Input, Layout, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import { useDispatch } from "react-redux";
import { alertSuccess } from "../../../helpers/toastify";
import { useNotAuthenticate } from "../../../hooks/useNotAuthenticate";
import { userChangePassword } from "../../../store/userSlice";
import Sidebar from "../Sidebar";
import "./auth.css";

function ChangePassword() {
  useNotAuthenticate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    dispatch(userChangePassword(values)).then((res) => {
      const payload = res.payload;
      if (payload.status) {
        form.resetFields();
        alertSuccess("Thay đổi mật khẩu thành công");
      } else {
        alertSuccess("Thông tin không chính xác");
      }
    });
  };

  return (
    <>
      <Breadcrumb
          items={[
            { title: "Admin" },
            { title: "Đổi mật khẩu" },
          ]}
        />
        <div className="content">
          <div className="tcl-row">
            <div className="tcl-col-12 tcl-col-sm-5 block-center">
              <Typography.Title level={3} className="text-center">
                Đổi mật khẩu
              </Typography.Title>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item hidden>
                  <Input name="username" autoComplete="username" />
                </Form.Item>
                
                <Form.Item
                  label="Mật khẩu cũ"
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                >
                  <Input.Password placeholder="Nhập mật khẩu cũ ..." autoComplete="current-password"/>
                </Form.Item>

                <Form.Item
                  label="Mật khẩu mới"
                  name="new_password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                >
                  <Input.Password placeholder="Nhập mật khẩu mới ..." autoComplete="new-password" />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  name="confirm_new_password"
                  dependencies={['new_password']}
                  rules={[{
                    required: true,
                    message: 'Vui lòng xác nhận mật khẩu mới!'
                  }, ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('new_password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Mật khẩu xác nhận không khớp!');
                    },
                  })]}
                >
                  <Input.Password placeholder="Nhập lại mật khẩu mới ..." autoComplete="new-password"/>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" shape="round">
                    Xác nhận
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
    </>
  );
}
export default ChangePassword;
