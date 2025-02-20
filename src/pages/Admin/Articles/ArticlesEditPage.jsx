import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Layout,
  message,
  Radio,
  Select,
  Spin,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useNotAuthenticate } from "../../../hooks/useNotAuthenticate";
import API from "../../../services/api";
import { getArticleById, updateArticle } from "../../../store/postSlice";
import "../admin.css";
import ImageUpload from "../Media/ImageUpload";
import Sidebar from "../Sidebar";
import "./articles.css";
import imageService from "../../../services/mediaService";

const ArticleEditPage = () => {
  useNotAuthenticate();

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getArticleById(params.id));
  }, [params, dispatch]);

  const { Title } = Typography;
  const postDetailEdit = useSelector((state) => state.POST.postDetailEdit);

  const tagsList = useSelector((state) => state.TAG.tagsListAll);
  const categoryList = useSelector((state) => state.CATEGORY.categoryList);
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);
  
  useEffect(() => {
    if (postDetailEdit) {
      form.setFieldsValue({
        id: postDetailEdit.id,
        title: postDetailEdit.title?.rendered,
        content: postDetailEdit.content?.rendered,
        categories: postDetailEdit.categories || [],
        tags: postDetailEdit.tags || [],
        status: postDetailEdit.status || "",
        image: postDetailEdit.featured_media_url || "",
      });
    }
  }, [form, postDetailEdit]);

  // Kiểm tra nếu postDetailEdit chưa có dữ liệu, hiển thị loading hoặc form rỗng
  if (!postDetailEdit) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  const handleImageUpload = async () => {
    if (!image) return null;
    try {
      const formData = new FormData();
      formData.append("file", image);
      const response = await imageService.uploadImage(formData)
      return response.data?.id;
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      return null;
    }
  };

  const handleSubmit = async (values) => {
    values.featured_media =
      (await handleImageUpload()) || postDetailEdit.featured_media;
    dispatch(updateArticle({ values, postId: postDetailEdit.id })).then(() => {
      message.success("Chỉnh sửa bài viết thành công!");
      form.setFieldsValue({
        title: "",
        content: "",
        categories: [],
        tags: [],
        status: "",
        image: "",
      });
      navigate("/admin/articles");
    });
  };

  const getOptions = (list) =>
    list.map(({ id, name }) => ({ value: id, label: name }));

  const handleImageChange = (newUrl) => {
    form.setFieldsValue({ image: newUrl });
  };

  return (
    <Layout>
      <Sidebar />
      <Content>
        <Breadcrumb items={[{ title: "Admin" }, { title: "Sửa bài viết" }]} />
        <div className="content">
          <div className="tcl-row">
            <div className="tcl-col-12 tcl-col-sm-6 block-center">
              <Title level={3}>
                Chỉnh sửa bài viết ID: {postDetailEdit.id}
              </Title>
              <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[
                    { required: true, message: "Tiêu đề không được bỏ trống!" },
                  ]}
                >
                  <Input placeholder="Enter title" />
                </Form.Item>

                <Form.Item
                  label="Content"
                  name="content"
                  rules={[
                    {
                      required: true,
                      message: "Nội dung không được bỏ trống!",
                    },
                  ]}
                >
                  <Input.TextArea placeholder="Enter content" rows={5} />
                </Form.Item>

                <Form.Item
                  label="Categories"
                  name="categories"
                  rules={[
                    {
                      required: true,
                      message: "Mời chọn ít nhất một danh mục!",
                    },
                  ]}
                >
                  <Select mode="multiple" options={getOptions(categoryList)} />
                </Form.Item>

                <Form.Item
                  label="Tags"
                  name="tags"
                  rules={[
                    {
                      required: true,
                      message: "Mời chọn ít nhất một tags name!",
                    },
                  ]}
                >
                  <Select mode="multiple" options={getOptions(tagsList)} />
                </Form.Item>

                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: "Mời chọn trạng thái!" }]}
                >
                  <Radio.Group>
                    <Radio value="publish">Publish</Radio>
                    <Radio value="pending">Pending</Radio>
                    <Radio value="draft">Draft</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="Upload Image" name="image">
                  <ImageUpload
                    image={postDetailEdit.featured_media_url}
                    onImageChange={handleImageChange}
                    reviceImage={setImage}
                  />
                </Form.Item>

                <Form.Item style={{ textAlign: "right" }}>
                  <Button
                    type="primary" danger
                    style={{ marginRight: "30px" }}
                    onClick={() => navigate("/admin/articles")}
                  >
                    Quay lại danh sách
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Sửa bài viết
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ArticleEditPage;
