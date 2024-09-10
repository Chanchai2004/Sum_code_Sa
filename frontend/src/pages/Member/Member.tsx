import React, { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, Modal, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetMembers, DeleteMemberByID } from "../../services/https";
import { MembersInterface } from "../../interfaces/IMember";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./Member.css"; // Import CSS

function Member() {
  const columns: ColumnsType<MembersInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "ชื่อ",
      dataIndex: "FirstName",
      key: "firstname",
    },
    {
      title: "นามสกุล",
      dataIndex: "LastName",
      key: "lastname",
    },
    {
      title: "เพศ",
      dataIndex: "Gender",
      key: "gender",
      render: (item) => item.Name, // ปรับปรุงการแสดงผล
    },
    {
      title: "อีเมล",
      dataIndex: "Email",
      key: "email",
    },
    {
      title: "แต้มแลกรางวัล",
      dataIndex: "TotalPoint",
      key: "totalpoint",
      
    },
    {
      title: "จัดการ",
      dataIndex: "Manage",
      key: "manage",
      render: (text, record, index) => (
        <>
          <Button
            onClick={() => navigate(`/customer/edit/${record.ID}`)}
            shape="circle"
            icon={<EditOutlined />}
            size={"large"}
          />
          <Button
            onClick={() => showModal(record)}
            className="delete-button" // ใช้คลาสในการจัดการ
            shape="circle"
            icon={<DeleteOutlined />}
            size={"large"}
            danger
          />
        </>
      ),
    },
  ];

  const navigate = useNavigate();

  const [members, setMembers] = useState<MembersInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Modal state
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>();
  const [deleteId, setDeleteId] = useState<number>();

  const getMembers = async () => { // แก้ชื่อฟังก์ชัน
    setLoading(true);
    try {
      let res = await GetMembers();
      if (res) {
        setMembers(res);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูล",
      });
    }
    setLoading(false);
  };

  const showModal = (val: MembersInterface) => {
    setModalText(
      `คุณต้องการลบข้อมูลผู้ใช้ "${val.FirstName} ${val.LastName}" หรือไม่ ?`
    );
    setDeleteId(val.ID);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      let res = await DeleteMemberByID(deleteId);
      if (res) {
        setOpen(false);
        messageApi.open({
          type: "success",
          content: "ลบข้อมูลสำเร็จ",
        });
        getMembers();
      } else {
        setOpen(false);
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาด !",
        });
      }
    } catch (error) {
      setOpen(false);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการลบข้อมูล!",
      });
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <>
      {contextHolder}
      <Row className="member-header">
        <Col span={12}>
          <h2>จัดการข้อมูลสมาชิก</h2>
        </Col>
        <Col span={12} className="member-actions">
          <Space>
            <Link to="/customer/create">
              <Button type="primary" icon={<PlusOutlined />}>
                สร้างข้อมูล
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div className="member-table-container">
        <Table rowKey="ID" columns={columns} dataSource={members} loading={loading} />
      </div>
      <Modal
        title="ลบข้อมูล ?"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}

export default Member;
