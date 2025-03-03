import { Outlet } from "react-router";
import { useNotAuthenticate } from "../../hooks/useNotAuthenticate";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import { Content } from "antd/es/layout/layout";

export default function AdminRoute() {
  useNotAuthenticate();

  return (
    <Layout>
      <Sidebar />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}
