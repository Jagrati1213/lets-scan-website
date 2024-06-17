import { Button, Space } from "antd";
import Style from "../../style/_error.module.scss";
import Title from "antd/es/typography/Title";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  return (
    <div className={Style.error}>
      <div className={Style.content}>
        <Title level={2} className={Style.title}>
          We'll be back shortly
        </Title>
        <p className={Style.title}>
          That page is not exits, Sorry for the inconvenience.
        </p>
        <Button type="primary" onClick={() => navigate("/")}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
