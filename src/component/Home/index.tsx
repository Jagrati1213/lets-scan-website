import Style from "../../style/_home.module.scss";
import { Select, Space, Spin } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import getVendors from "../../api/vendors/getVendors";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { getMenuAction } from "../../store/slice/menu";
import { clearCart } from "../../store/slice/cart";

export default function Home() {
  const [vendors, setVendors] = useState<
    {
      value: string;
      label: string;
      key: string;
    }[]
  >([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleChange = (value: string) => {
    dispatch(clearCart());
    setLoading(true);
    dispatch(getMenuAction(value)).then(() => {
      navigate(`menu/${value}`);
    });
  };

  const getData = async () => {
    setLoading(true);
    try {
      const data = await getVendors();
      const vendorData = data.map((item) => {
        return {
          value: item._id,
          label: item.restaurant,
          key: item._id,
        };
      });
      setVendors(vendorData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className={Style.home}>
      <Spin spinning={loading}>
        <div className={Style.drop_down_box}>
          <Space direction="vertical" align="center">
            <Title level={4} className={Style.title}>
              Welcome to Lets scan
            </Title>
            <p>
              Explore our delicious menu and conveniently order your favorite
              dishes by scan QR and Choose your restaurant!
            </p>
            <Select
              loading={loading}
              className={Style.select}
              placeholder={"please select Resurgent"}
              onChange={handleChange}
              options={vendors}
            />
          </Space>
        </div>
      </Spin>
    </div>
  );
}
