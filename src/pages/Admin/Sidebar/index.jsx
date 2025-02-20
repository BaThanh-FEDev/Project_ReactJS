import {
  EditOutlined,
  LogoutOutlined,
  SelectOutlined,
  TagOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userLogout } from "../../../store/userSlice";
import "./sidebar.css";
import { t } from "i18next";

const { Sider } = Layout;

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const items = [
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: `${t("user")}`,
      children: [
        {
          key: "1",
          label: <Link to="/admin/profile">{t("infor")}</Link>,
        },
        {
          key: "2",
          label: <Link to="/admin/changepassword">{t("changepw")}</Link>,
        },
      ],
    },
    {
      key: "sub2",
      icon: <EditOutlined />,
      label: `${t("article")}`,
      children: [
        {
          key: "3",
          label: <Link to="/admin/articles">{t("list")}</Link>,
        },
        {
          key: "4",
          label: <Link to="/admin/articles/create">{t("add")}</Link>,
        },
      ],
    },
    {
      key: "5",
      icon: <TagOutlined />,
      label: <Link to="/admin/categories">{t("nameCate")}</Link>,
    },
    {
      key: "6",
      icon: <TagOutlined />,
      label: <Link to="/admin/tags">{t("nameTag")}</Link>,
    },
    {
      key: "7",
      icon: <LogoutOutlined />,
      label: <Link to="#" onClick={onClickLogOut}>{t("logout")}</Link>,
    },
  ];

  function onClickLogOut(event) {
    event.preventDefault();
    dispatch(userLogout());
    navigate("/");
  }

  const [collapsed, setCollapsed] = useState(false);

  // Determine the active key based on the current URL path
  const getActiveKey = () => {
    for (let item of items) {
      if (item.children) {
        for (let child of item.children) {
          if (location.pathname === child.label.props.to) {
            return child.key;
          }
        }
      } else if (item.label.props?.to && location.pathname === item.label.props.to) {
        return item.key;
      }
    }
    return "1"; // Default to the first menu item
  };

  const [selectedKey, setSelectedKey] = useState(getActiveKey());

  useEffect(() => {
    setSelectedKey(getActiveKey()); // Update selected key when location changes
  }, [location]);

  return (
    <>
      <Sider
        className="sidebar"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="tcl-col-12 block-center">
          <div className="sidebarLogo">
            <Link to="/">
              <img src="/assets/images/logo.png" alt="Go to homepage" />
            </Link>
          </div>
        </div>
        <Menu
          theme="light"
          selectedKeys={[selectedKey]} // Use state for the selected key
          mode="inline"
          inlineCollapsed={collapsed}
          items={items}
        />
      </Sider>
    </>
  );
}

export default Sidebar;
