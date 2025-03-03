import { Breadcrumb, Button, Form, Input, Layout, message, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { alertSuccess } from "../../../helpers/toastify";
import { useNotAuthenticate } from "../../../hooks/useNotAuthenticate";
import API, { token } from "../../../services/api";
import { userGetInfor, userUpdateInfor } from "../../../store/userSlice";
import ImageUpload from "../Media/ImageUpload";
import Sidebar from "../Sidebar";
import "./auth.css";
import authService from "../../../services/authService";

function ProfilePage() {
  useNotAuthenticate();
  const dispatch = useDispatch();
  const userInforCurrent = useSelector((state) => state.USER.userInfor);

  const [form] = Form.useForm();
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!userInforCurrent) {
      dispatch(userGetInfor(token));
    }
  }, [userInforCurrent, dispatch]);

  useEffect(() => {
    if (userInforCurrent) {
      form.setFieldsValue({
        first_name: userInforCurrent.firstName || "",
        last_name: userInforCurrent.lastName || "",
        nickname: userInforCurrent.nickName || "",
        description: userInforCurrent.description || "",
        simple_local_avatar: {
          media_id: userInforCurrent.avatarId || "",
        },
      });
    }
  }, [userInforCurrent, form]);

  function reviceImage(file) {
    setImage(file);
  }

  const handleSubmit = async (values) => {
    const formData = new FormData();
    if (image) {
      formData.append("file", image);
      try {
        const response = await authService.uploadMedia(formData)
        if (response.data) {
          values.simple_local_avatar = { media_id: response.data.id };
        }
      } catch (error) {
        message.error("Lỗi khi tải ảnh lên");
        return;
      }
    }

    dispatch(userUpdateInfor(values));
    alertSuccess("Cập nhật thông tin thành công");
  };

  return (
    <>
       <Breadcrumb
          items={[
            { title: "Admin" },
            { title: "Thông tin cá nhân" },
            { title: userInforCurrent?.nickName },
          ]}
        />
        <div className="content">
          <div className="tcl-row">
            <div className="tcl-col-12 tcl-col-sm-5 block-center">
              <Typography.Title  className=" text-center" level={3}>Thông tin cá nhân</Typography.Title>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
              >
                <Form.Item label="Ảnh đại diện">
                  <ImageUpload
                    reviceImage={reviceImage}
                    onImageChange={(newUrl) =>
                      form.setFieldsValue({ image: newUrl })
                    }
                    image={userInforCurrent?.avatar}
                  />
                </Form.Item>
                <Form.Item
                  label="Tên"
                  name="first_name"
                  rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                  <Input placeholder="Nhập Tên" />
                </Form.Item>
                <Form.Item
                  label="Họ"
                  name="last_name"
                  rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
                >
                  <Input placeholder="Nhập Họ" />
                </Form.Item>
                <Form.Item
                  label="Nickname"
                  name="nickname"
                  rules={[
                    { required: true, message: "Vui lòng nhập nickname!" },
                  ]}
                >
                  <Input placeholder="Nhập Nickname" />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                  <Input.TextArea placeholder="Nhập mô tả" rows={4} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="middle" shape="round">
                    Cập nhật thông tin
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
    </>
  );
}
export default ProfilePage;
