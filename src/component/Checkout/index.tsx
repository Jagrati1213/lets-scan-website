import { useCallback, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Spin,
  Typography,
  message,
} from "antd";
import {
  MinusSquareOutlined,
  PlusSquareOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../store";
import { clearCart, decrement, increment } from "../../store/slice/cart";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CartItemsI, paymentIntegrationT } from "../../types";
import checkoutOrder from "../../api/razorpay/checkoutOrder";
import verifyPayment from "../../api/razorpay/verifyPayment";
import placeOrder from "../../api/razorpay/placeOrder";

const { Title, Text } = Typography;
const { TextArea } = Input;

type FieldType = {
  name: string;
  email: string;
  note?: string;
};

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { menu } = useAppSelector((state) => state.menu);
  const { order } = useAppSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<FieldType>();
  const { search } = useLocation();
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

  // REMOVE MENU ITEMS
  const handleRemove = (id: string) => {
    dispatch(decrement(id));
  };

  // VIEW MENU ITEMS
  const handleViewMenu = useCallback(() => {
    navigate(`/menu/${params.vendorId}`);
  }, [navigate, params.vendorId]);

  const paymentSuccessHandler = async (
    response: {
      razorpay_order_id: any;
      razorpay_payment_id: any;
      razorpay_signature: string;
    },
    vendorId: string,
    orderList: CartItemsI[],
    name: string,
    email: string,
    note?: string,
    tableNumber?: number
  ) => {
    try {
      // GET RAZOR PAY SUCCESS DATA

      const body = { ...response, vendorId };

      // CHECK PAYMENT SUCCESS
      const validateResponse = await verifyPayment(body);
      setIsLoading(true);
      const { success, data } = validateResponse;

      // SEND ORDER DETAILS IN BACKEND
      if (success) {
        const orderResponse = await placeOrder({
          email,
          name,
          note,
          orderList,
          paymentId: data.paymentId,
          tableNumber,
          vendorId,
          totalAmount: totalAmount,
        });
        message.success("Payment Successful!!!");
        navigate(`/order-status/${orderResponse?._id}`);
        dispatch(clearCart());
      }
    } catch (error) {
      message.error("Payment failed!!!!!");
    } finally {
      setIsLoading(false);
    }
  };

  const paymentIntegrationHandler = async ({
    vendorId,
    orderList,
    totalAmount,
    name,
    email,
    note,
    tableNumber,
  }: paymentIntegrationT) => {
    try {
      // GET RAZOR KEY

      const { order } = await checkoutOrder({ totalAmount, vendorId });

      if (!order) {
        console.error("INVALID ORDER DETAILS!");
        return;
      }
      //   GENERATE RAZOR PAY OPTIONS

      const options = {
        key: process.env.RAZOR_API_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Let's Scan",
        description: "Pay & Enjoy Your Food!",
        image: "https://example.com/your_logo",
        order_id: order.id,
        handler: async function (response: {
          razorpay_order_id: any;
          razorpay_payment_id: any;
          razorpay_signature: string;
        }) {
          await paymentSuccessHandler(
            response,
            vendorId,
            orderList,
            name,
            email,
            note,
            tableNumber
          );
        },
        prefill: {
          name,
          email,
          contact: false,
        },
        notes: {
          address: "Let's scan",
        },
        theme: {
          color: "#49274a",
        },
        modal: {
          onDismiss: () => {
            message.error("Payment failed Try again!!!!");
          },
        },
      };
      //   RAZOR PAY POPUP
      var paymentObject = new window.Razorpay(options);
      paymentObject.open();
      paymentObject.on(
        "payment.failed",
        function (response: {
          error: {
            code: any;
            description: any;
            source: any;
            step: any;
            reason: any;
            metadata: { order_id: any; payment_id: any };
          };
        }) {
          message.error(`Payment Failed: ${response.error.description}`);
        }
      );
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  };

  // PAYMENT
  const handlePaymentProceed = async () => {
    setIsLoading(true);
    setOpen(false);

    const { email, name, note } = form.getFieldsValue();
    const query = new URLSearchParams(search);
    const tableNumber = query.get("tableNumber");
    try {
      if (totalAmount < 1) {
        message.warning("Amount can't be less than 1");
        return;
      }

      if (params.vendorId && email && email) {
        await paymentIntegrationHandler({
          vendorId: params.vendorId,
          orderList: order,
          totalAmount,
          email,
          name,
          note,
          tableNumber: tableNumber ? Number(tableNumber) : undefined,
        });
      }
    } catch (error) {
      message.error("Payment failed!!!!!");
    } finally {
      setIsLoading(false);
      form.resetFields();
    }
  };

  const handleSubmit = () => {
    handlePaymentProceed();
  };

  return (
    <div className={styles.container}>
      <Spin spinning={isLoading}>
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
                  disabled={isLoading}
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
                    disabled={isLoading || updatedMenu.length < 1}
                  />
                  <Text strong>{item.quantity}</Text>
                  <Button
                    type="link"
                    icon={<PlusSquareOutlined />}
                    onClick={handleAdd.bind(null, {
                      menuId: item._id!,
                      price: item.price!,
                      quantity: item.quantity,
                    })}
                    disabled={isLoading || updatedMenu.length < 1}
                  />
                </Col>
                <Col span={6}>
                  <Text className={styles.price}>
                    {item.quantity} × ₹{item.price}
                  </Text>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Spin>

      {updatedMenu.length > 0 && (
        <Button
          className={styles.payBtn}
          type="default"
          icon={<LogoutOutlined />}
          onClick={() => {
            setOpen(true);
          }}
          loading={isLoading}
          disabled={isLoading || updatedMenu.length < 1}
        >
          Proceed to Pay
        </Button>
      )}
      <Modal
        title="User Details"
        open={open}
        onOk={() => {
          form.submit();
        }}
        className={styles.modal}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        okText={
          <Text strong className={styles.text}>
            Proceed To Pay
          </Text>
        }
        okButtonProps={{ disabled: updatedMenu.length < 1 }}
      >
        <Form
          form={form}
          layout="vertical"
          name="payment"
          className={styles.form}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={handleSubmit}
        >
          <Form.Item<FieldType>
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Please Enter your name!!" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                required: true,
              },
            ]}
          >
            <Input placeholder="Please Enter your email!!" />
          </Form.Item>

          <Form.Item<FieldType> label="Note" name="note">
            <TextArea
              rows={2}
              maxLength={150}
              placeholder="Add cooking note!!"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Checkout;
