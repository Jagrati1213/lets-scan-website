import React, { useEffect, useMemo, useState } from "react";
import {
  PlusOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Col,
  Flex,
  List,
  Row,
  Space,
  Typography,
} from "antd";
import styles from "./styles.module.scss";
import { FcRating } from "react-icons/fc";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getMenuAction } from "../../../store/slice/menu";
import { decrement, increment } from "../../../store/slice/cart";

const { Title, Text, Paragraph } = Typography;
const MenuList: React.FC = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();
  const { menu, isOpen } = useAppSelector((state) => state.menu);
  const { order } = useAppSelector((state) => state.cart);

  const navigate = useNavigate();

  const updatedMenu = useMemo(() => {
    const extendMenu = menu.map((items) => {
      return { ...items, quantity: 0 };
    });
    order.forEach((item) => {
      const index = extendMenu.findIndex(
        (menuItem) => menuItem._id === item.menuId
      );
      if (index !== -1) {
        extendMenu[index].quantity = item.quantity;
      }
      return;
    });

    return extendMenu;
  }, [order, menu]);

  const totalQuantity = useMemo(
    () => order.reduce((acc, current) => acc + current.quantity, 0),
    [order]
  );
  const totalAmount = useMemo(() => {
    const extendMenu = menu.map((items) => {
      return { ...items, quantity: 0 };
    });
    order.forEach((item) => {
      const index = extendMenu.findIndex(
        (menuItem) => menuItem._id === item.menuId
      );
      if (index !== -1) {
        extendMenu[index].quantity = item.quantity;
      }
      return;
    });
    const newArray = extendMenu
      .filter((ele) => ele.quantity > 0)
      .reduce((acc, element) => acc + element.price! * element.quantity, 0);
    return newArray;
  }, [order, menu]);

  const handleAdd = ({
    menuId,
    price,
    quantity,
  }: {
    menuId: string;
    price: number;
    quantity: number;
  }) => {
    dispatch(
      increment({
        menuId,
        price,
        quantity,
      })
    );
  };
  const handleRemove = (id: string) => {
    dispatch(decrement(id));
  };

  const handleViewCart = () => {
    navigate(`checkout${search}`);
  };

  useEffect(() => {
    setLoading(false);
    if (params.vendorId && menu.length === 0) {
      setLoading(true);
      dispatch(getMenuAction(params.vendorId))
        .catch(() => {
          navigate("/menu");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, menu.length, navigate, params.vendorId]);

  return (
    <div className={styles.container}>
      {!isOpen && !loading && (
        <Alert
          type="error"
          message="This Restaurant is not open right now!!!!"
          banner
        />
      )}
      <List
        loading={loading}
        className={styles.menulist}
        itemLayout="vertical"
        size="large"
        pagination={false}
        dataSource={updatedMenu}
        renderItem={(item) => (
          <List.Item key={item._id} className={styles.listItem}>
            <Row gutter={5} justify={"space-between"}>
              <Col xs={13} sm={16} xl={16} md={16}>
                <Row justify={"space-between"}>
                  <Col span={24}>
                    <Title level={2}>
                      <div
                        className={styles.category}
                        style={{ borderColor: item.isVeg ? "green" : "red" }}
                      >
                        <span
                          style={{
                            backgroundColor: item.isVeg ? "green" : "red",
                          }}
                        ></span>
                      </div>
                      {"  "}
                      {item.name}
                    </Title>
                  </Col>

                  <Col span={24}>
                    <FcRating /> <Text>{item.rating}</Text> |{" "}
                    <Text>₹{item.price}</Text>
                  </Col>
                  <br />
                  <br />
                  <Col span={24}>
                    <Paragraph
                      ellipsis={{
                        rows: 3,
                        expandable: true,
                        symbol: <Text strong> More</Text>,
                      }}
                    >
                      {item.description}
                    </Paragraph>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Space
                  direction="vertical"
                  align="center"
                  className={styles.orderIconContainer}
                >
                  <Avatar
                    src={item.image}
                    shape="square"
                    size={80}
                    style={{ objectFit: "contain" }}
                  />
                  <Space size={"small"}>
                    {item.quantity !== 0 && (
                      <Button
                        type="link"
                        icon={<MinusSquareOutlined />}
                        disabled={!isOpen}
                        onClick={() => {
                          handleRemove(item._id!);
                        }}
                      />
                    )}
                    {item.quantity !== 0 && (
                      <Text strong>{item?.quantity}</Text>
                    )}
                    <Button
                      icon={
                        item.quantity !== 0 ? (
                          <PlusSquareOutlined />
                        ) : (
                          <PlusOutlined />
                        )
                      }
                      type={item.quantity !== 0 ? "link" : "default"}
                      disabled={!isOpen}
                      onClick={handleAdd.bind(null, {
                        menuId: item._id,
                        price: item.price,
                        quantity: item.quantity,
                      })}
                    >
                      {item?.quantity === 0 && "Add"}
                    </Button>
                  </Space>
                </Space>
              </Col>
            </Row>
          </List.Item>
        )}
      />
      {totalQuantity !== 0 && (
        <Flex
          className={styles.controls}
          justify={"space-between"}
          align={"middle"}
        >
          <Button
            className={styles.checkoutBtn}
            type="text"
            onClick={handleViewCart}
            disabled={!isOpen}
          >
            <Text>
              {totalQuantity} Item | ₹{totalAmount}
            </Text>

            <Text strong>View Cart</Text>
          </Button>
        </Flex>
      )}
    </div>
  );
};

export default MenuList;
