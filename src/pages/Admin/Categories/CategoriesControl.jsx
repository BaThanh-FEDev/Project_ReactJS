import { Button, Form, Input, message, Popconfirm, Select } from "antd";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createCategory,
  deleteMultipleCategories,
} from "../../../store/categorySlice";
import "./categories.css";

function CategoriesControl({
  selectedCateIds,
  setSelectedRowKeys,
  setSelectedCateIds,
  getParentOptions
}) {
  const dispatch = useDispatch();
  const [addForm] = Form.useForm();

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    parent: ""
  });

  const handleSubmit = (e) => {
    dispatch(createCategory(categoryData));
    addForm.resetFields();
    setCategoryData({
      name: "",
      slug: "",
      parent: ""
    });
  };
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      return updatedData;
    });
  }, []);

  const handleSelectChange = (value) => {
    setCategoryData((prevData) => ({ ...prevData, parent: value }));
  };
  const handledeleteCate = () => {
    if (selectedCateIds.length > 0) {
      dispatch(deleteMultipleCategories(selectedCateIds)).then(() => {
        setSelectedCateIds([]);
        setSelectedRowKeys([]);
        message.success("Đã xoá category thành công.");
      });
    } else {
      message.warning("Chưa có category nào được chọn.");
    }
  };
  return (
    <div className="categories-form-container">
      <Popconfirm
        title="Xóa các mục đã chọn?"
        onConfirm={(e) => handledeleteCate()}
        okText="Yes"
        cancelText="No"
      >
          <Button className="deleleCate" type="primary" danger>
          Delete selected category
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
            value={categoryData.name}
            onChange={handleInputChange}
            placeholder="Tạo category mới..."
          />
        </Form.Item>

        <Form.Item>
          <Input
            name="slug"
            value={categoryData.slug}
            onChange={handleInputChange}
            placeholder="Nhập slug bạn muốn..."
          />
        </Form.Item>

        <Form.Item name="parent">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Chọn parent nếu có..."
            optionFilterProp="label"
            onChange={handleSelectChange}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={getParentOptions}
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

export default CategoriesControl;
