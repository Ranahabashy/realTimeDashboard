import React from "react";

import { Layout, Space } from "antd";
import { CurrentUser } from "./Current-User";


export const Header = () => {

  const headerStyles: React.CSSProperties = {
    backgroundColor: "#d9d9d9",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    position: "sticky",
    top: 0,
    zIndex: 999,
  };

  return (
    <Layout.Header style={headerStyles}>
      <Space align="center" size="middle">
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};