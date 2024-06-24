import { useCallback, useEffect, useState } from "react";

import styles from "./styles.module.scss";
import {
  Alert,
  Button,
  Col,
  Divider,
  Flex,
  Input,
  List,
  QRCode,
  Row,
  Skeleton,
  Spin,
  Steps,
  Tag,
  Typography,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import getOrder, { GetOrderResponse } from "../../api/order/getOrder";

const { Text } = Typography;
const OrderStatus = () => {
  const navigate = useNavigate();

  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<
    GetOrderResponse["data"] | null
  >();

  const handleReorder = () => {
    navigate(`/menu/${params?.vendorId}`);
  };

  const getOrderStatus = useCallback(async () => {
    if (!params.orderId) {
      message.error("Order Id not found!!!!");
      return;
    }
    setLoading(true);
    try {
      const data = await getOrder(params.orderId);
      if (data) {
        setOrderDetails(data);
      }
    } catch (error) {
      message.error("Order not found!!!!");
    } finally {
      setLoading(false);
    }
  }, [params.orderId]);

  useEffect(() => {
    getOrderStatus();
  }, [getOrderStatus]);

  return (
    <div className={styles.container}>
      <Spin spinning={loading}>
        {!orderDetails ? (
          <Skeleton active={loading} />
        ) : (
          <div>
            <Row justify={"space-between"} align={"middle"}>
              <Col>
                <Text strong>ORDER#{orderDetails?.orderDetails._id}</Text>
              </Col>

              <Col>
                Token:- {orderDetails?.orderDetails.orderToken.toUpperCase()}
              </Col>
            </Row>
            <br />
            <br />

            <Steps
              current={1}
              direction="horizontal"
              items={[
                {
                  title: (
                    <Text strong>
                      {" "}
                      {orderDetails?.restaurant[0].toUpperCase()}
                      {orderDetails?.restaurant.slice(1)}
                    </Text>
                  ),

                  status:
                    orderDetails?.orderDetails.orderStatus === "Complete"
                      ? "finish"
                      : "process",
                },
                {
                  title: "Order completed",
                  status:
                    orderDetails?.orderDetails.orderStatus === "Complete"
                      ? "finish"
                      : "wait",
                },
              ]}
            />
            <br />
            <br />
            <Divider className={styles.divider} />
            <Row justify={"space-between"} align={"middle"} gutter={10}>
              <Col>
                <Text strong>
                  PAYMENT#{orderDetails?.orderDetails.paymentId}{" "}
                </Text>
                <br />
                <Text>
                  Ordered by {orderDetails?.orderDetails.customer.name}
                </Text>
              </Col>
              {orderDetails?.orderDetails.tableNumber && (
                <Col>
                  <Tag> Table no. {orderDetails?.orderDetails.tableNumber}</Tag>
                </Col>
              )}
            </Row>
            <Divider className={styles.divider} />

            {orderDetails?.orderDetails.note && (
              <>
                <Text> Order Note</Text>
                <Input
                  value={orderDetails?.orderDetails.note}
                  contentEditable={false}
                  disabled
                />
                <br />
                <br />
              </>
            )}

            <List
              loading={loading}
              className={styles.list}
              footer={
                <Row justify={"space-between"}>
                  <Col span={24}>
                    <Divider dashed className={styles.divider} />
                  </Col>
                  <Col>Total</Col>
                  <Col>₹ {orderDetails.orderDetails.totalAmount}</Col>
                </Row>
              }
            >
              {orderDetails.orderDetails.orderList.map((item) => {
                return (
                  <Row justify={"space-between"} key={item._id}>
                    <Col span={16}>{item.menuId}</Col>
                    <Col>
                      {item.quantity}× ₹ {item.price}
                    </Col>
                  </Row>
                );
              })}
            </List>
            {orderDetails &&
            orderDetails?.orderDetails.orderStatus !== "Complete" ? (
              <Flex
                justify="center"
                align="center"
                vertical={true}
                className={styles.code}
              >
                <Text strong>
                  OTP - {orderDetails?.orderDetails.verifyCode}
                </Text>
                <QRCode value={String(orderDetails?.orderDetails.verifyCode)} />
              </Flex>
            ) : (
              <Alert
                message="Order Delivered"
                description="Visit Again"
                type="success"
              />
            )}
          </div>
        )}
      </Spin>
      <Button
        className={styles.stickyBtn}
        onClick={handleReorder}
        loading={loading}
      >
        Reorder
      </Button>
    </div>
  );
};

export default OrderStatus;
