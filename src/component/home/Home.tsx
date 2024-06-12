import React from "react";
import Style from "../../style/_home.module.scss";
import { Select, Space } from "antd";
import Title from "antd/es/typography/Title";

export default function Home() {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <div className={Style.home}>
      <div className={Style.drop_down_box}>
        <Space direction="vertical" align="center">
          <Title level={3} className={Style.title}>
            Welcome to Menu Muse
          </Title>
          <p>
            Explore our delicious menu and conveniently order your favorite
            dishes by scan QR!
          </p>
          <Select
            className={Style.select}
            defaultValue="lucy"
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
        </Space>
      </div>
    </div>
  );
}
