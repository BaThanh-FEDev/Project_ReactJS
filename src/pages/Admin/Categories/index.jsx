import { SearchOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import { Content } from "antd/es/layout/layout";
import queryString from "query-string";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotAuthenticate } from "../../../hooks/useNotAuthenticate";
import {
  deleteCategory,
  deleteMultipleCategories,
  fetchCatesAdminWithPaging,
  getCategoryById,
  updateCategory,
} from "../../../store/categorySlice";
import Sidebar from "../Sidebar";
import CategoriesControl from "./CategoriesControl";
import "./categories.css";

function CategoriesIndexPage() {
  useNotAuthenticate();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const listCates = useSelector(
    (state) => state.CATEGORY.categoriesData.listCates
  );
  const [loading, setLoading] = useState(false);
  const searchInput = useRef(null);
  const { page = 1, search = "" } = queryString.parse(location.search);
  const [pagination, setPagination] = useState({
    current: Number(page),
    pageSize: 5,
    total: 0,
  });
  const dataSource = listCates.map((item, index) => ({
    key: index,
    id: item.id,
    name: item.name,
    slug: item.slug,
    parent: item.parent,
  }));
  const [searchText, setSearchText] = useState("");

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const categoryEdit = useSelector((state) => state.CATEGORY.categoryEdit);

  const [selectedCateIds, setSelectedCateIds] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    setLoading(true);
    dispatch(
      fetchCatesAdminWithPaging({
        page: pagination.current,
        per_page: pagination.pageSize,
        search: searchText,
      })
    ).then((res) => {
      setPagination({ ...pagination, total: res.payload?.total });
      setLoading(false);
    });
  }, [pagination.current, searchText]);

  useEffect(() => {
    if (categoryEdit && form.getFieldInstance("name")) {
      form.setFieldsValue({
        name: categoryEdit.name,
        slug: categoryEdit.slug,
        parent: categoryEdit.parent,
      });
    }
  }, [form, categoryEdit]);

  const updateURL = (params) => {
    const currentQuery = queryString.parse(location.search);
    delete currentQuery.per_page; // Xóa per_page khỏi URL
    const updatedQuery = queryString.stringify({
      ...currentQuery,
      ...params,
    });

    navigate(`?${updatedQuery}`, { replace: true });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          // defaultValue={searchText}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    filterDropdownProps: {
      onOpenChange: (open) => {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchText ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
      width: "10%",
      ...getColumnSearchProps("id"),
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    { key: "slug", title: "Slug", dataIndex: "slug", width: "30%" },
    { key: "parent", title: "Parent", dataIndex: "parent", width: "10%" },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (text, index) => {
        const hasChild = listCates.some((item) => item.parent === index.id);

        return (
          <Space size="middle">
            <a href="#" onClick={(e) => handleEdit(index.id, e)}>
              Edit
            </a>

            {hasChild ? (
              <Popconfirm
                title={`Id này có cấp con. Bạn có chắc muốn xóa tất cả không?`}
                okText="Yes"
                cancelText="No"
                onConfirm={(e) => handleDelete(index.id, e)}
              >
                <Button className="deleteCateInTable">Delete</Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="Bạn có muốn xóa category này không?"
                okText="Yes"
                cancelText="No"
                onConfirm={(e) => handleDelete(index.id, e)}
              >
                <Button className="deleteCateInTable">Delete</Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    updateURL({ search: selectedKeys[0], page: 1 });
  };

  function handleTableChange(newPagination) {
    setLoading(true);
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
    updateURL({
      page: newPagination.current,
      // per_page: newPagination.pageSize,
    });
  }

  const handleReset = (clearFilters) => {
    clearFilters({ confirm: true });
    setSearchText("");
    updateURL({ search: "" });
  };

  function handleEdit(id, event) {
    event.preventDefault();
    dispatch(getCategoryById(id));
    setOpen(true);
  }
  const handleSubmitEdit = async (values) => {
    dispatch(updateCategory({ values, categoryId: categoryEdit.id })).then(
      () => {
        setOpen(false);
        message.success("Chỉnh sửa category thành công!");
      }
    );
  };
  function handleDelete(id, event) {
    event.preventDefault();
    setLoading(true);

    const childCategories = listCates.filter((item) => item.parent === id);
    const ids = [id, ...childCategories.map((item) => item.id)];

    if (childCategories.length > 0) {
      dispatch(deleteMultipleCategories(ids)).then(() => {
        dispatch(
          fetchCatesAdminWithPaging({
            page: pagination.current,
            per_page: pagination.pageSize,
            search: searchText || search,
          })
        ).then((res) => {
          setPagination({ ...pagination, total: res.payload?.total - 1 });
          setLoading(false);
          message.success("Xóa categories thành công!");
        });
      });
    } else {
      // Nếu không có category con, xóa bình thường
      dispatch(deleteCategory(id)).then(() => {
        dispatch(
          fetchCatesAdminWithPaging({
            page: pagination.current,
            per_page: pagination.pageSize,
            search: searchText || search,
          })
        ).then((res) => {
          setPagination({ ...pagination, total: res.payload?.total - 1 });
          setLoading(false);
          message.success("Xóa categories thành công!");
        });
      });
    }
  }

  const getParentOptions = (list) =>
    list.map(({ id, name }) => ({ value: id, label: name }));

  const handleSelectIdCate = (ids) => {
    setSelectedCateIds(ids);
    setSelectedRowKeys(ids);
  };

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    const selectedIds = selectedRows.map((row) => row.id);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedCateIds(selectedIds);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.status === "DISABLED",
    }),
  };

  return (
    <Layout>
      <Sidebar />
      <Content>
        <Breadcrumb items={[{ title: "Admin" }, { title: "Categories" }]} />
        <div className="content">
          <CategoriesControl
            selectedCateIds={selectedCateIds}
            setSelectedRowKeys={setSelectedRowKeys}
            setSelectedCateIds={setSelectedCateIds}
            getParentOptions={getParentOptions(listCates)}
          />
          <div style={{ marginTop: 30 }}>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataSource}
              pagination={{
                ...pagination,
                disabled: loading,
              }}
              onChange={handleTableChange}
              loading={loading}
            />
          </div>
          <Modal
            title={`Chỉnh sửa category ID: ${categoryEdit.id}`}
            centered
            open={open}
            footer={null} // Xóa nút Cancel và OK của Modal
            onCancel={() => setOpen(false)}
            width={{
              xs: "80%",
              sm: "60%",
              md: "50%",
              lg: "40%",
              xl: "30%",
              xxl: "25%",
            }}
          >
            <Form form={form} onFinish={handleSubmitEdit} layout="vertical">
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Tên không được bỏ trống!" },
                ]}
              >
                <Input placeholder="Enter name" />
              </Form.Item>
              <Form.Item label="Slug" name="slug">
                <Input placeholder="Enter slug" />
              </Form.Item>
              <Form.Item label="Parent" name="parent">
                <Select
                  showSearch
                  placeholder="Chọn parent nếu có"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={getParentOptions(listCates)}
                />
              </Form.Item>
              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  style={{ marginRight: 8 }}
                  onClick={() => setOpen(false)}
                  type="primary"
                  danger
                >
                  Hủy bỏ
                </Button>
                <Button type="primary" htmlType="submit">
                  Sửa
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
    </Layout>
  );
}

export default CategoriesIndexPage;
