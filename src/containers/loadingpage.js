import React from "react";
import { Layout, Menu, Spin } from "antd";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { CalendarFilled, FileOutlined } from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class BlankLayout extends React.Component {
  render() {
    return (
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: "#fff",
          }}
        >
          <div className="logo" />
        </Header>
        <Layout className="site-layout">
          <Sider
            // trigger={null}
            collapsible
            collapsed={false}
            // onCollapse={(value) => setCollapsed(value)}
            className={"SiderLayout"}
          >
            <Menu theme="dark" mode="inline">
              <SubMenu
                key="sub1"
                icon={<CalendarFilled />}
                title="Quản lý hồ sơ"
              >
                <SubMenu
                  key="luu_tru"
                  icon={<CalendarFilled />}
                  title="Lưu trữ"
                >
                  <Menu.Item key="2" icon={<FileOutlined />}>
                    <Link to="/">Tài liệu</Link>
                  </Menu.Item>
                </SubMenu>
              </SubMenu>
            </Menu>
          </Sider>
          <div className="ContentUser">
            <Content
              style={{
                margin: "16px 16px 0px 16px ",
              }}
            >
              {/* <div className="main-content">
                <div className="page-content">
                  <div className="container-fluid" style={{ maxWidth: "100%" }}>
                    <div id="layout-wrapper" style={{ minHeight: "100vh" }}>
                      {/*<Sidebar />*/}
              {/* <div className="main-content">
                        <div className="page-content">
                          <div className="container-fluid" style={{ maxWidth: "100%" }}> */}
              <div
                style={{
                  margin: "20px 0",
                  marginBottom: "20px",
                  padding: "30px 50px",
                  textAlign: "center",
                  background: "rgba(0, 0, 0, 0.05)",
                  borderRadius: "4px",
                }}
              >
                <Spin />
              </div>
              {/* </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </Content>

            <Footer
              style={{
                textAlign: "center",
                height: "20px",
              }}
            >
              VBPO ©{new Date().getFullYear()} Made by DRI Team
            </Footer>
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(connect()(BlankLayout));
