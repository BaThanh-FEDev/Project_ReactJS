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
  Space,
  Table,
} from "antd";
import { Content } from "antd/es/layout/layout";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotAuthenticate } from "../../../hooks/useNotAuthenticate";
import {
  deleteTag,
  fetchTagsAdminWithPaging,
  getTagById,
  updateTag,
} from "../../../store/tagsSlice";
import Sidebar from "../Sidebar";
import TagsControl from "./TagsControl";

function TagsIndexPage() {
  useNotAuthenticate();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const listTags = useSelector((state) => state.TAG.tagsData.listTags);
  const [loading, setLoading] = useState(false);
  const searchInput = useRef(null);
  const { page = 1, search = "" } = queryString.parse(location.search);
  const [pagination, setPagination] = useState({
    current: Number(page),
    pageSize: 5,
    total: 0,
  });

  const dataSource = listTags.map((item, index) => ({
    key: index,
    id: item.id,
    name: item.name,
    slug: item.slug,
  }));
  const [searchText, setSearchText] = useState(search);

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const tagEdit = useSelector((state) => state.TAG.tagEdit);

  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    setLoading(true);
    dispatch(
      fetchTagsAdminWithPaging({
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
    if (tagEdit && form.getFieldInstance("name")) {
      form.setFieldsValue({
        name: tagEdit.name,
        slug: tagEdit.slug,
      });
    }
  }, [form, tagEdit]);

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
          // ref={searchInput}
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
            style={{width: 90,}}
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
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
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
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (text, index) => (
        <Space size="middle">
          <a href="#" onClick={(e) => handleEdit(index.id, e)}>
            Edit
          </a>
          <Popconfirm
            title="Bạn muốn xóa tagname này?"
            onConfirm={(e) => handleDelete(index.id, e)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="deleteCateInTable">Delete</Button>
          </Popconfirm>
        </Space>
      ),
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
    dispatch(getTagById(id));
    setOpen(true);
  }
  const handleSubmitEdit = async (values) => {
    dispatch(updateTag({ values, tagId: tagEdit.id })).then(() => {
      setOpen(false);
      message.success("Chỉnh sửa tag thành công!");
    });
  };
  const handleDelete = async (id, event) => {
    event.preventDefault();
    setLoading(true);

    dispatch(deleteTag(id)).then(() => {
      dispatch(
        fetchTagsAdminWithPaging({
          page: pagination.current,
          per_page: pagination.pageSize,
          search: searchText || search,
        })
      ).then((res) => {
        setPagination({ ...pagination, total: res.payload?.total - 1 });
        setLoading(false);
        message.success("Xóa tag thành công!");
      });
    });
  };

  const handleSelectIdTag = (ids) => {
    setSelectedTagIds(ids);
    setSelectedRowKeys(ids);
  };

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    const selectedIds = selectedRows.map((row) => row.id);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedTagIds(selectedIds);
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
        <Breadcrumb items={[{ title: "Admin" }, { title: "Tags" }]} />
        <div className="content">
          <TagsControl
            selectedTagIds={selectedTagIds}
            setSelectedRowKeys={setSelectedRowKeys}
            setSelectedTagIds={setSelectedTagIds}
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
            title={`Chỉnh sửa tag ID: ${tagEdit.id}`}
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

export default TagsIndexPage;
