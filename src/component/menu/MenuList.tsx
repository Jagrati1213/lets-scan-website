import { Button, Card, Col, Flex, Image, Row, Space } from "antd";
import Style from "../../style/_menulist.module.scss";
import Title from "antd/es/typography/Title";
import Meta from "antd/es/card/Meta";

export default function MenuList() {
  return (
    <div className={Style.menulist}>
      <Title level={5}>Menu Items</Title>
      <Row gutter={[16, 16]} wrap={true}>
        {Array(6)
          .fill(null)
          .map((item, index) => {
            return (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card
                  className="card"
                  bordered={false}
                  cover={
                    <Image
                      height={150}
                      preview={false}
                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />
                  }
                >
                  <Meta title="Europe Street beat" description={<CardDesc />} />
                </Card>
              </Col>
            );
          })}
      </Row>
    </div>
  );
}

const CardDesc = () => {
  return (
    <Space direction="vertical" className="card_desc">
      <p>Descriptions</p>
      <Flex align="center" justify="space-between">
        <p>Price | Rate</p>
        <Button type="link">Add</Button>
      </Flex>
    </Space>
  );
};
