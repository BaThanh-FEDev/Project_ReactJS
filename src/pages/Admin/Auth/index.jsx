import { Breadcrumb, Layout, notification, Spin } from "antd";
import Sidebar from "../Sidebar";
import { Content } from "antd/es/layout/layout";
import { useNotAuthenticate } from "../../../hooks/useNotAuthenticate";
import React, { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { t } from "i18next";
import "./auth.css"

function Dashboard() {
  useNotAuthenticate();

  const [loading, setLoading] = useState(true); // Dùng Spin
  const userInfor = useSelector((state) => state.USER.userInfor);
  const userAvatar = userInfor?.simple_local_avatar?.full || "";
  const userNickname = userInfor?.nickname || "";
  const [api, contextHolder] = notification.useNotification();

  // Tạo nội dung thông báo bằng useMemo
  const notificationContent = useMemo(() => ({
    message: `${t("loginSuccess")}`,
    description: `${t("hello")} ${userNickname}`,
    placement: "topRight",
  }), [userNickname]);

  // Kiểm tra dữ liệu user, nếu có thì thông báo và tắt loading
  useEffect(() => {
    if (userInfor && userNickname) {
      setTimeout(() => {
        setLoading(false);
        api.info(notificationContent);
      }, 1000); // Giả lập thời gian chờ ngắn
    }
  }, [userInfor, userNickname, api, notificationContent]);

  return (
    <Layout>
      {contextHolder}
      <Sidebar />
      <Content>
        {/* Hiện Spin nếu đang loading */}
        {loading ? (
           <div className="loading-container">
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        ) : (
          <>
            <div className="navDashboard">
              <Breadcrumb
                items={[
                  { title: "Admin" },
                  { title: "Dashboard" },
                ]}
              />
              <div className="infor">
                <img src={userAvatar} alt={userNickname} />
                {userNickname}
              </div>
            </div>
            <div className="content">Trang Dashboard</div>
          </>
        )}
      </Content>
    </Layout>
  );
}

export default Dashboard;
