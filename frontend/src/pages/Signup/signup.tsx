import { Button, Card, Form, Input, message, Flex, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { CreateMember } from '../../services/https/index'; 
import { MembersInterface } from '../../interfaces/IMember';
import './signup.css';

function Signup() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: MembersInterface) => {
    try {
      const res = await CreateMember(values);
      console.log('Response:', res);  // แสดงผล response ทั้งหมด
      console.log('Response Status:', res.status);  // แสดงผล status
  
      if (res && res.status === true) {
        messageApi.open({
          type: "success",
          // ใช้ข้อมูล message ที่ได้จาก response
          content: 'Member created successfully. ID: ' + res.message.ID,
        });
        navigate('/login');
      } else {
        messageApi.open({
          type: "error",
          content: res.message?.error || 'Email already exists',
        });
      }
    } catch (error: any) {
      // จัดการกรณีที่มีข้อผิดพลาดในการเชื่อมต่อ API
      messageApi.open({
        type: "error",
        content: error.message || 'An error occurred while creating the member.',
      });
    }
  };
  

  return (
    <div className="signup">
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
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your firstname!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="Lastname"
                      name="lastName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your lastname!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="Username"
                      name="userName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your Username!",
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
                          message: "Please enter a valid email!",
                        },
                        {
                          required: true,
                          message: "Please enter your email!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password!",
                        },
                      ]}
                    >
                      <Input.Password />
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
                      <a onClick={() => navigate('/login')}>Signin now!</a>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </Flex>
    </div>
  );
}
export default Signup;
