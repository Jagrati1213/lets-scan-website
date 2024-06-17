import { useCallback, useEffect, useMemo } from "react";
import styles from "./styles.module.scss";
import { Alert, Button, Col, List, Row, Typography } from "antd";
import {
  MinusSquareOutlined,
  PlusSquareOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../store";
import { decrement, increment } from "../../store/slice/cart";
import { useNavigate, useParams } from "react-router-dom";
import { paymentIntegrationHandler } from "../../api/checkout/paymentIntegration";
import { MenuItemT } from "../../types";

const { Title, Text } = Typography;
const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { menu } = useAppSelector((state) => state.menu);
  const { order } = useAppSelector((state) => state.cart);

  const updatedMenu = useMemo(() => {
    const extendMenu = menu.map((items) => {
      return { ...items, quantity: 0 };
    });
    order.forEach((item) => {
      const index = extendMenu.findIndex(
        (menuItem) => menuItem._id === item.id
      );
      if (index !== -1) {
        extendMenu[index].quantity = item.quantity;
      }
      return;
    });
    const newArray = extendMenu.filter((ele) => ele.quantity > 0);
    return newArray;
  }, [order, menu]);

  const totalAmount = useMemo(() => {
    return updatedMenu.reduce(
      (acc: number, element: any) => acc + element.price! * element.quantity,
      0
    );
  }, [updatedMenu]);

  // ADD MENU ITEMS
  const handleAdd = (value: string) => {
    dispatch(increment(value));
  };

  // REMOVE MENU ITEMS
  const handleRemove = (id: string) => {
    dispatch(decrement(id));
  };

  // VIEW MENU ITEMS
  const handleViewMenu = useCallback(() => {
    navigate(`/menu/${params.userId}`);
  }, [navigate, params.userId]);

  // PAYMENT
  const handlePaymentProceed = async () => {
    if (params.userId)
      await paymentIntegrationHandler({
        userId: params.userId,
        orderList: order,
        totalAmount,
      });
  };

  // RETURN THE UPDATED MENU
  useEffect(() => {
    if (updatedMenu.length === 0) {
      handleViewMenu();
    }
  }, [handleViewMenu, updatedMenu]);
  return (
    <div className={styles.container}>
      <Alert banner message={"This bill is GST  inclusive"} />

      <br />

      <List
        header={<Title level={2}>Cart details</Title>}
        footer={
          <Row justify={"space-between"}>
            <Col>
              <Text strong>Total</Text>
            </Col>
            <Col>
              <Text strong>
                ₹
                {updatedMenu.reduce(
                  (acc: number, element: any) =>
                    acc + element.price! * element.quantity,
                  0
                )}
              </Text>
            </Col>
            <Col span={24}>
              <Button
                className={styles.addMoreBtn}
                type="link"
                onClick={handleViewMenu}
              >
                <Row justify={"space-between"}>
                  <Col>Add more Item</Col>
                  <Col>
                    <PlusSquareOutlined />
                  </Col>
                </Row>
              </Button>
            </Col>
          </Row>
        }
        className={styles.listFooter}
        bordered
        dataSource={updatedMenu}
        renderItem={(item) => (
          <List.Item>
            <Row className={styles.list} align={"middle"}>
              <Col span={10}>
                <Text>{item.name}</Text>
              </Col>
              <Col span={8}>
                <Button
                  type="link"
                  icon={<MinusSquareOutlined />}
                  onClick={() => {
                    handleRemove(item._id!);
                  }}
                />
                <Text strong>{item.quantity}</Text>
                <Button
                  type="link"
                  icon={<PlusSquareOutlined />}
                  onClick={() => {
                    handleAdd(item._id!);
                  }}
                />
              </Col>
              <Col span={6}>
                <Text className={styles.price}>
                  ₹{item.price! * item.quantity}
                </Text>
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <Button
        className={styles.payBtn}
        type="default"
        icon={<LogoutOutlined />}
        onClick={handlePaymentProceed}
      >
        Proceed to Pay
      </Button>
    </div>
  );
};

export default Checkout;
