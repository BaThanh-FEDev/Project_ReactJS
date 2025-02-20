import { Button, Form, Input, message, Popconfirm } from "antd";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { createTag, deleteMultipleTags } from "../../../store/tagsSlice";
import "./tags.css";

function TagsControl({
  selectedTagIds,
  setSelectedRowKeys,
  setSelectedTagIds,
}) {
  const dispatch = useDispatch();
  const [addForm] = Form.useForm();

  const [tagData, setTagData] = useState({
    name: "",
    slug: "",
  });

  const handleSubmit = (e) => {
    dispatch(createTag(tagData));
    addForm.resetFields();
    setTagData({
      name: "",
      slug: "",
    });
  };
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setTagData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      return updatedData;
    });
  }, []);
  const handledeleteTag = () => {
    if (selectedTagIds.length > 0) {
      dispatch(deleteMultipleTags(selectedTagIds)).then(() => {
        setSelectedTagIds([]);
        setSelectedRowKeys([]);
        message.success("Đã xoá tag thành công.");
      });
    } else {
      message.warning("Chưa có tag nào được chọn.");
    }
  };
  return (
    <div className="tags-form-container">
      <Popconfirm
        title="Xóa các mục đã chọn?"
        onConfirm={(e) => handledeleteTag()}
        okText="Yes"
        cancelText="No"
      >
        <Button className="deleleTag" type="primary" danger>
          Delete selected tag
        </Button>
      </Popconfirm>

      <Form
        form={addForm}
        onFinish={handleSubmit}
        layout="inline"
        className="categories-form"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Tên category là bắt buộc!" }]}
        >
          <Input
            name="name"
            value={tagData.name}
            onChange={handleInputChange}
            placeholder="Tạo tagname mới..."
          />
        </Form.Item>

        <Form.Item>
          <Input
            name="slug"
            value={tagData.slug}
            onChange={handleInputChange}
            placeholder="Nhập slug bạn muốn..."
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default TagsControl;
