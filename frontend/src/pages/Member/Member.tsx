import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Select, Card, Form, Input } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  GetMembers,
  DeleteMemberByID,
  CreateMember,
  CheckAdminPassword,
} from "../../services/https";
import { MembersInterface } from "../../interfaces/IMember";
import { useNavigate } from "react-router-dom";
import "../Showtime/Showtime.css"; // Import CSS

const { Option } = Select;

function Member() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<MembersInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false); // สำหรับ modal delete
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>();
  const [deleteId, setDeleteId] = useState<number>();
  const [deleteRole, setDeleteRole] = useState<string>(""); // เก็บ Role ของคนที่จะลบ

  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // สำหรับ modal add
  const [addForm] = Form.useForm();
  const [adminPasswordModalOpen, setAdminPasswordModalOpen] = useState(false); // สำหรับ modal ใส่รหัสผ่าน admin
  const [adminPassword, setAdminPassword] = useState<string>(""); // เก็บรหัสผ่านของ admin

  const [selectedEmail, setSelectedEmail] = useState<string | undefined>(
    undefined
  ); // สำหรับการเลือกอีเมล
  const [emailOptions, setEmailOptions] = useState<string[]>([]); // สำหรับเก็บรายการอีเมล
  const [selectedUsername, setSelectedUsername] = useState<string | undefined>(
    undefined
  ); // สำหรับการเลือก username
  const [usernameOptions, setUsernameOptions] = useState<string[]>([]); // สำหรับเก็บรายการ username

  // เพิ่มคอลัมน์ Username
  const columns: ColumnsType<MembersInterface> = [
    {
      title: "No",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "Username", // คอลัมน์ Username
      dataIndex: "UserName",
      key: "username",
    },
    {
      title: "First Name",
      dataIndex: "FirstName",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "LastName",
      key: "lastname",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
    },
    {
      title: "Total Points",
      dataIndex: "TotalPoint",
      key: "totalpoint",
    },
    {
      title: "Role",
      dataIndex: "Role",
      key: "role",
    },
    {
      title: "Manage",
      dataIndex: "Manage",
      key: "manage",
      render: (text, record) => (
        <>
          <Button
            onClick={() => showModal(record)}
            className="delete-button"
            shape="circle"
            icon={<DeleteOutlined />}
            size={"large"}
            danger
          />
        </>
      ),
    },
  ];

  const getMembers = async () => {
    setLoading(true);
    try {
      let res = await GetMembers();
      if (res) {
        setMembers(res);
        setEmailOptions(res.map((member: MembersInterface) => member.Email)); // เก็บอีเมลสำหรับการค้นหา
        setUsernameOptions(
          res.map((member: MembersInterface) => member.UserName)
        ); // เก็บ username สำหรับการค้นหา
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error fetching members",
      });
    }
    setLoading(false);
  };

  const showModal = (val: MembersInterface) => {
    setDeleteId(val.ID);
    setDeleteRole(val.Role); // เก็บ role ของคนที่จะลบ
    setModalText(
      `Are you sure you want to delete user "${val.FirstName} ${val.LastName}"?`
    );
    if (val.Role === "admin") {
      // ถ้าเป็น admin แสดง modal ใส่รหัสผ่าน
      setAdminPasswordModalOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      let res = await DeleteMemberByID(deleteId);
      if (res) {
        setOpen(false);
        messageApi.open({
          type: "success",
          content: "Member deleted successfully",
        });
        getMembers();
      } else {
        setOpen(false);
        messageApi.open({
          type: "error",
          content: "Error deleting member!",
        });
      }
    } catch (error) {
      setOpen(false);
      messageApi.open({
        type: "error",
        content: "Error deleting member!",
      });
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddOk = async () => {
    try {
      const values = await addForm.validateFields();
      // เรียกฟังก์ชัน CreateMember เมื่อเพิ่มสมาชิก
      let res = await CreateMember(values);
      if (res.status) {
        messageApi.open({
          type: "success",
          content: "Member added successfully",
        });
        setIsAddModalOpen(false); // ปิด Modal
        getMembers(); // ดึงข้อมูลใหม่
        addForm.resetFields(); // ล้างฟอร์ม
      } else {
        messageApi.open({
          type: "error",
          content: res.message || "Error adding member!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error adding member!",
      });
    }
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

  // สำหรับลบ admin เมื่อใส่รหัสผ่านถูกต้อง
  const handleAdminPasswordOk = async () => {
    setConfirmLoading(true);
    try {
      const adminToCheck = members.find((member) => member.ID === deleteId);
      if (!adminToCheck) {
        messageApi.open({
          type: "error",
          content: "Admin not found!",
        });
        setConfirmLoading(false);
        return;
      }

      const adminCheckRes = await CheckAdminPassword(
        adminToCheck.ID,
        adminPassword
      );
      if (adminCheckRes.status) {
        let res = await DeleteMemberByID(
          deleteId,
          adminToCheck.ID,
          adminPassword
        ); // ส่งรหัสผ่านและ ID ไปลบ admin
        if (res) {
          messageApi.open({
            type: "success",
            content: "Admin deleted successfully",
          });
          setAdminPasswordModalOpen(false);
          getMembers();
        } else {
          messageApi.open({
            type: "error",
            content: "Error deleting admin!",
          });
        }
      } else {
        messageApi.open({
          type: "error",
          content: "Invalid admin password!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error verifying admin password!",
      });
    }
    setAdminPassword("");
    setConfirmLoading(false);
  };

  const handleAdminPasswordCancel = () => {
    setAdminPasswordModalOpen(false);
  };

  // กรองข้อมูลสมาชิกตาม Username หรือ Email
  const filteredMembers = members.filter((member) => {
    return (
      (!selectedEmail || member.Email === selectedEmail) &&
      (!selectedUsername || member.UserName === selectedUsername)
    );
  });

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <div className="showtime">
      <div className="app">
        <Card style={{ margin: "20px" }}>
          {contextHolder}

          {/* Header Section */}
          <div className="header">
            {/* Search Username */}
            <div className="header-item search-username-container">
              <label>Username</label>
              <Select
                value={selectedUsername}
                showSearch
                className="username-select"
                allowClear
                placeholder="Select a Username"
                style={{ width: 200 }}
                optionFilterProp="children"
                onChange={(value) => setSelectedUsername(value as string)}
                filterOption={(input, option) =>
                  option?.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {usernameOptions.map((username) => (
                  <Option key={username} value={username}>
                    {username}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Search Email */}
            <div className="header-item search-email-container">
              <label>Email</label>
              <Select
                value={selectedEmail}
                showSearch
                className="email-select"
                allowClear
                placeholder="Select an Email"
                style={{ width: 200 }}
                optionFilterProp="children"
                onChange={(value) => setSelectedEmail(value as string)}
                filterOption={(input, option) =>
                  option?.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {emailOptions.map((email) => (
                  <Option key={email} value={email}>
                    {email}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Add Member Button */}
            <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
              Add Member
            </Button>
          </div>

          {/* Table Section */}
          <div className="member-table-container">
            <Table
              rowKey="ID"
              columns={columns}
              dataSource={filteredMembers}
              loading={loading}
            />
          </div>

          {/* Modal Section for Delete */}
          <Modal
            title="Delete Member?"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <p>{modalText}</p>
          </Modal>

          {/* Modal Section for Add */}
          <Modal
            title="Add Member"
            open={isAddModalOpen}
            onOk={handleAddOk}
            onCancel={handleAddCancel}
            okText="Submit"
            cancelText="Cancel"
          >
            <Form form={addForm} layout="vertical">
              <Form.Item
                label="Username"
                name="UserName"
                rules={[{ required: true, message: "Please enter username!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="First Name"
                name="FirstName"
                rules={[
                  { required: true, message: "Please enter first name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="LastName"
                rules={[{ required: true, message: "Please enter last name!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="Email"
                rules={[{ required: true, message: "Please enter email!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="Password"
                rules={[{ required: true, message: "Please enter password!" }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Role"
                name="Role"
                rules={[{ required: true, message: "Please select role!" }]}
              >
                <Select>
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>

          {/* Modal for Admin Password */}
          <Modal
            title="Enter Admin Password"
            open={adminPasswordModalOpen}
            onOk={handleAdminPasswordOk}
            onCancel={handleAdminPasswordCancel}
            okText="Submit"
            cancelText="Cancel"
          >
            <Input.Password
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Admin Password"
            />
          </Modal>
        </Card>
      </div>
    </div>
  );
}

export default Member;
