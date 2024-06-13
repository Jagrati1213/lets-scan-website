import { Avatar, Card, Col, Row, Space } from "antd";
import Style from "../../style/_menulist.module.scss";
import Title from "antd/es/typography/Title";

export default function MenuList() {
  return (
    <div className={Style.menulist}>
      <Title level={5}>Menu Items</Title>
      <Row gutter={16} className={Style.row} justify={"center"}>
        <Col md={12} sm={24}>
          <Card
            className={Style.card}
            bordered={false}
            cover={
              <img
                alt="example"
                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
              />
            }
          >
            <Card.Meta
              title="Card title"
              description={
                <Space direction="vertical">
                  <p>Desc</p>
                  <Space>
                    <p>Price</p>
                    <p>Rate</p>
                  </Space>
                </Space>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
