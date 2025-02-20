import { SearchOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Input,
  Layout,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../../components/shared/Pagination";
import { useNotAuthenticate } from "../../../hooks/useNotAuthenticate";
import { deleteArticle, fetchAllPosts } from "../../../store/postSlice";
import Sidebar from "../Sidebar";
import "./articles.css";
import ArticlesControl from "./ArticlesControl";

function ArticlesPage() {
  useNotAuthenticate();

  const dispatch = useDispatch();
  const allPostsList = useSelector((state) => state.POST.postAll.allPostsList);
  const currentPage = useSelector((state) => state.POST.postAll.currentPage);
  const categoryList = useSelector((state) => state.CATEGORY.categoryList);
  const tagsList = useSelector((state) => state.TAG.tagsListAll);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [tableKey, setTableKey] = useState(Date.now());
  // const lang = useSelector((state) => state.CONFIG.lang)

  useEffect(() => {
    setFilteredPosts(allPostsList);
  }, [allPostsList]);

  useEffect(() => {
    dispatch(fetchAllPosts({ pageNumber: 1}));
  }, [dispatch]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    const filteredData = allPostsList.filter((post) =>
      post[dataIndex].toLowerCase().includes(selectedKeys[0].toLowerCase())
    );
    setFilteredPosts(filteredData);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
    setFilteredPosts(allPostsList);
    setTableKey(Date.now());
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
            onClick={() => confirm({ closeDropdown: false })}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={close}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) setTimeout(() => searchInput.current?.select(), 100);
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const renderTagsOrCategories = (items) =>
    items?.map((item) => (
      <Tag
        color={
          item.length > 5
            ? "yellow"
            : item.toLowerCase() === "fe"
            ? "red"
            : "green"
        }
        key={item}
      >
        {item.toUpperCase()}
      </Tag>
    ));

  const columns = [
    { key: "id", title: "ID", dataIndex: "id", width: "5%", ...getColumnSearchProps("id"), },
    {
      key: "image",
      title: "Image",
      dataIndex: "image",
      width: "15%",
      render: (image) => (
        <img
          src={typeof image === 'string' && image.trim() ? image : undefined}
          alt="featured"
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
      ),
    },
    {
      key: "title",
      title: "Title",
      dataIndex: "title",
      ...getColumnSearchProps("title"),
    },
    {
      key: "categories",
      title: "Categories",
      dataIndex: "categories",
      width: "15%",
      render: renderTagsOrCategories,
    },
    {
      key: "tags",
      title: "Tags",
      dataIndex: "tags",
      width: "15%",
      render: renderTagsOrCategories,
    },
    { key: "status", title: "Status", dataIndex: "status", width: "10%" },
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
            title="Bạn muốn xóa bài viết này?"
            onConfirm={(e) => handleDelete(index.id, e)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource = filteredPosts.map((item, index) => ({
    key: index,
    id: item.id,
    image: item.featured_media_url,
    title: item.title.rendered,
    categories: categoryList
      .filter((cat) => item.categories.includes(cat.id))
      .map((cat) => cat.name),
    tags: tagsList
      .filter((tag) => item.tags.includes(tag.id))
      .map((tag) => tag.name),
    status: item.status.toUpperCase(),
  }));

  const [selectedArticleIds, setSelectedArticleIds] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const handleSelectIdArticles = (ids) => {
    setSelectedArticleIds(ids);
    setSelectedRowKeys(ids);
  };

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    const selectedIds = selectedRows.map((row) => row.id);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedArticleIds(selectedIds);
  };

  const rowSelection = {
    selectedRowKeys, 
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.status === 'DISABLED',
    }),
  };
  
  const navigate = useNavigate();
  function handleEdit(id, event) {
    event.preventDefault();
    navigate(`/admin/articles/${id}/edit`);
  }

  function handleDelete(id, event) {
    event.preventDefault();
    dispatch(deleteArticle(id))
      .then(() => {
        message.success("Xóa bài viết thành công!");
        dispatch(fetchAllPosts({ pageNumber: currentPage}));
      })
      .catch(() => {
        message.error("Xóa bài viết thất bại!");
      });
  }

  return (
    <Layout>
      <Sidebar />
      <Content>
        <div className="navArticle">
          <Breadcrumb
            items={[{ title: "Admin" }, { title: "Danh sách bài viết" }]}
          />
          <div className="createButtonWrapper">
          <Link to="/admin/articles/create" className="createButton">
            Create New Article
          </Link>
        </div>
        </div>
        
        <div className="content">
          <ArticlesControl 
            selectedArticleIds={selectedArticleIds}
            setSelectedRowKeys={setSelectedRowKeys} 
            setSelectedArticleIds={setSelectedArticleIds}
           />
          <Table
            key={tableKey}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
          {allPostsList.length > 0 && <Pagination />}
        </div>
      </Content>
    </Layout>
  );
}

export default ArticlesPage;
