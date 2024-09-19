import {
  Button,
  Card,
  Form,
  Input,
  message,
  Flex,
  Row,
  Col,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { CreateMember } from '../../services/https/index'; 
import { MembersInterface } from '../../interfaces/IMember';
import './signup.css';

function Signup() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values: MembersInterface ) => {
    let res = await CreateMember(values);
    if (res.status == 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(function () {
        navigate("/");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };
  return (
    <div className="signup">
    <>
      {contextHolder}
      <Flex justify="center" align="center" className="login">
        <Card className="card-login" style={{ width: 600 }}>
          <Row align={"middle"} justify={"center"}>
            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
              <center><img alt="logo.PNG" src="logo.PNG" className="images-logo" /></center>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <h2 className="header">Sign Up</h2>
              <Form
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Row gutter={[16, 0]} align={"middle"}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="Firstname"
                      name="first_name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your firstname !",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="Lastname"
                      name="last_name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your lastname !",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          type: "email",
                          message: "Please enter your email !",
                        },
                        {
                          required: true,
                          message: "Please enter your email !",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password !",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label="Gender"
                      name="gender_id"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your gender !",
                        },
                      ]}
                    >
                      <Select
                        defaultValue=""
                        style={{ width: "100%" }}
                        options={[
                          { value: "", label: "Please enter your gender !", disabled: true },
                          { value: 1, label: "Male" },
                          { value: 2, label: "Female" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        style={{ marginBottom: 20 }}
                      >
                        Sign up
                      </Button>
                      Or <a onClick={() => navigate("/")}>signin now !</a>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </Flex>
    </>
    </div>
  );
}
export default Signup;