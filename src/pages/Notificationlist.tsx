import React, { useState } from "react";
import { useNavigation } from "@refinedev/core";
import { Card, Badge, Avatar, Space, Typography, Tag, Row, Col, Divider } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../styles/NotificationList.css"

const { Text, Title } = Typography;

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  sender?: string;
  avatar?: string;
  priority?: "high" | "medium" | "low";
}

// Data dummy untuk contoh
const dummyNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Order Completed",
    message: "Your order #12345 has been successfully completed and delivered.",
    timestamp: "2 minutes ago",
    isRead: false,
    sender: "E-Commerce System",
    priority: "high",
  },
  {
    id: "2",
    type: "warning",
    title: "Payment Pending",
    message: "Your payment for invoice #INV-2024-001 is pending. Please complete the payment.",
    timestamp: "15 minutes ago",
    isRead: false,
    sender: "Payment Gateway",
    priority: "high",
  },
  {
    id: "3",
    type: "info",
    title: "New Feature Available",
    message: "Check out our new dashboard analytics feature with real-time data visualization.",
    timestamp: "1 hour ago",
    isRead: true,
    sender: "Product Team",
    priority: "low",
  },
  {
    id: "4",
    type: "error",
    title: "System Error",
    message: "Failed to sync data with cloud storage. Please try again later.",
    timestamp: "2 hours ago",
    isRead: false,
    sender: "System Administrator",
    priority: "high",
  },
  {
    id: "5",
    type: "success",
    title: "Profile Updated",
    message: "Your profile information has been successfully updated.",
    timestamp: "3 hours ago",
    isRead: true,
    sender: "Account Manager",
    priority: "medium",
  },
  {
    id: "6",
    type: "info",
    title: "Weekly Report Ready",
    message: "Your weekly performance report is now available for download.",
    timestamp: "5 hours ago",
    isRead: true,
    sender: "Analytics System",
    priority: "medium",
  },
  {
    id: "7",
    type: "warning",
    title: "Storage Almost Full",
    message: "Your storage is 85% full. Consider upgrading your plan or cleaning up unused files.",
    timestamp: "1 day ago",
    isRead: false,
    sender: "Storage Manager",
    priority: "medium",
  },
  {
    id: "8",
    type: "success",
    title: "Backup Completed",
    message: "Automatic backup of your data has been completed successfully.",
    timestamp: "2 days ago",
    isRead: true,
    sender: "Backup Service",
    priority: "low",
  },
];

const NotificationList: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />;
      case "error":
        return <CloseCircleOutlined style={{ fontSize: 24, color: "#ff4d4f" }} />;
      case "warning":
        return <ExclamationCircleOutlined style={{ fontSize: 24, color: "#faad14" }} />;
      case "info":
        return <InfoCircleOutlined style={{ fontSize: 24, color: "#1890ff" }} />;
      default:
        return <BellOutlined style={{ fontSize: 24 }} />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "blue";
      default:
        return "default";
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );
    
    // Navigate to detail page
    navigate(`/notifications/show/${notification.id}`);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notification-container">
      <div className="notification-header">
        <Space align="center">
          <BellOutlined style={{ fontSize: 28, color: "#1890ff" }} />
          <Title level={2} style={{ margin: 0 }}>
            Notifications
          </Title>
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ backgroundColor: "#ff4d4f" }} />
          )}
        </Space>
        <Text type="secondary">{notifications.length} total notifications</Text>
      </div>

      <Divider />

      <Row gutter={[16, 16]}>
        {notifications.map((notification) => (
          <Col xs={24} key={notification.id}>
            <Card
              className={`notification-card ${!notification.isRead ? "unread" : ""}`}
              hoverable
              onClick={() => handleNotificationClick(notification)}
              bordered={false}
            >
              <div className="notification-content">
                <div className="notification-icon">{getIcon(notification.type)}</div>
                
                <div className="notification-body">
                  <div className="notification-top">
                    <Space direction="vertical" size={4} style={{ width: "100%" }}>
                      <Space style={{ justifyContent: "space-between", width: "100%" }}>
                        <Space>
                          <Text strong style={{ fontSize: 16 }}>
                            {notification.title}
                          </Text>
                          {!notification.isRead && (
                            <Badge status="processing" />
                          )}
                        </Space>
                        {notification.priority && (
                          <Tag color={getPriorityColor(notification.priority)}>
                            {notification.priority.toUpperCase()}
                          </Tag>
                        )}
                      </Space>
                      
                      <Text type="secondary" className="notification-message">
                        {notification.message}
                      </Text>
                    </Space>
                  </div>

                  <div className="notification-footer">
                    <Space size="large">
                      {notification.sender && (
                        <Space size={4}>
                          <Avatar size="small" icon={<UserOutlined />} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {notification.sender}
                          </Text>
                        </Space>
                      )}
                      <Space size={4}>
                        <ClockCircleOutlined style={{ fontSize: 12, color: "#8c8c8c" }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {notification.timestamp}
                        </Text>
                      </Space>
                    </Space>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default NotificationList;