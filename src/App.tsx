import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import Style from "./style/_app.module.scss";
import Title from "antd/es/typography/Title";
import "./style/global.scss";

function App() {
  return (
    <div className={Style.app}>
      <Layout className={Style.app_layout}>
        <Header className={Style.app_header}>
          <Title level={4}>
            Menu <span style={{ color: "#94618e" }}>Muse</span>
          </Title>

          <Title level={5}>Restaurant</Title>
        </Header>
        <Content className="content">
          <Outlet />
        </Content>
        <Footer className="footer">Footer</Footer>
      </Layout>
    </div>
  );
}

export default App;
