import {
  Breadcrumb,
  Button,
  Form,
  Input,
  message,
  Radio,
  Select,
  Typography
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNotAuthenticate } from "../../../hooks/useNotAuthenticate";
import imageService from "../../../services/mediaService";
import { createArticle } from "../../../store/postSlice";
import "../admin.css";
import ImageUpload from "../Media/ImageUpload";
import "./articles.css";

function ArticleCreatePage() {
  useNotAuthenticate();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.CONFIG.lang);
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);
  const [isClearImage, setIsClearImage] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    categories: [],
    tags: [],
    status: "",
    featured_media: null,
  });

  useEffect(() => {
    form.setFieldsValue({
      title: "",
      content: "",
      categories: [],
      tags: [],
      status: "",
      featured_media: null,
    });
  }, [form]);

  const getOptions = (list) =>
    list.map(({ id, name }) => ({ value: id, label: name }));

  const categoryList = useSelector((state) => state.CATEGORY.categoryList);
  const tagsList = useSelector((state) => state.TAG.tagsListAll);

  const updateArticleState = debounce(
    (values) => setNewPost((prev) => ({ ...prev, ...values })),
    200
  );

  const handleSubmit = async (values) => {
    try {
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        const { data } = await imageService.uploadImage(formData)
        values.featured_media = data.id;
      }

      dispatch(
        createArticle({
          values: {
            ...values,
            categories: Array.isArray(values.categories)
              ? values.categories
              : [],
            tags: Array.isArray(values.tags) ? values.tags : [],
          },
          lang,
        })
      ).then(() => {
        form.setFieldsValue({
          title: "",
          content: "",
          categories: [],
          tags: [],
          status: "",
          featured_media: null,
        });
        setIsClearImage(true);
        message.success("Thêm mới bài viết thành công");
        navigate("/admin/articles");
      });
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
    }
  };
  const handleImageChange = (newUrl) => form.setFieldsValue({ image: newUrl });

  return (
    <>
    <Breadcrumb
          items={[{ title: "Admin" }, { title: "Thêm mới bài viết" }]}
        />
        <div className="content">
          <div className="tcl-row">
            <div className="tcl-col-12 tcl-col-sm-8 block-center">
              <Typography.Title level={3}>Thêm bài viết mới</Typography.Title>
              <Form
                form={form}
                layout="vertical"
                initialValues={newPost}
                onValuesChange={(_, values) => updateArticleState(values)}
                onFinish={handleSubmit}
              >
                <Form.Item
                  label="Tiêu đề"
                  name="title"
                  rules={[{ required: true, message: "Mời nhập tiêu đề!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Mô tả"
                  name="content"
                  rules={[{ required: true, message: "Mời nhập mô tả!" }]}
                >
                  <TextArea rows={5} />
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
                    { required: true, message: "Mời chọn ít nhất một tag!" },
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

                <Form.Item label="Hình ảnh" name="featured_media">
                  <ImageUpload
                    value={image}
                    reviceImage={setImage}
                    onImageChange={handleImageChange}
                    clearImage={isClearImage}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Tạo bài viết
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
    </>
  );
}

export default ArticleCreatePage;
