import React from "react";
import { useNavigation, useBack } from "@refinedev/core";
import { useParams } from "react-router-dom";
import {
  Card,
  Avatar,
  Space,
  Typography,
  Tag,
  Button,
  Divider,
  Row,
  Col,
  Timeline,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TagOutlined,
} from "@ant-design/icons";
import "../styles/Noticationdetail.css";
import { useNavigate } from "react-router-dom";



const { Text, Title, Paragraph } = Typography;

interface NotificationDetail {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  sender: string;
  avatar?: string;
  priority: "high" | "medium" | "low";
  category: string;
  email?: string;
  phone?: string;
  location?: string;
  details: string;
  relatedActions?: string[];
  timeline?: Array<{
    time: string;
    status: string;
    description: string;
  }>;
}

// Data dummy untuk detail notifikasi
const dummyNotificationDetails: Record<string, NotificationDetail> = {
  "1": {
    id: "1",
    type: "success",
    title: "Order Completed",
    message: "Your order #12345 has been successfully completed and delivered.",
    timestamp: "2024-12-15 14:30:00",
    sender: "E-Commerce System",
    priority: "high",
    category: "Orders",
    email: "orders@ecommerce.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    details:
      "Your order containing 3 items has been successfully processed, shipped, and delivered to your registered address. The total order value was $299.99. Thank you for your purchase!",
    relatedActions: ["View Order Details", "Download Invoice", "Leave Review"],
    timeline: [
      {
        time: "14:30",
        status: "Delivered",
        description: "Package delivered successfully",
      },
      {
        time: "10:15",
        status: "Out for Delivery",
        description: "Package is out for delivery",
      },
      {
        time: "08:00",
        status: "In Transit",
        description: "Package is in transit to your location",
      },
      {
        time: "Dec 14, 16:00",
        status: "Shipped",
        description: "Order has been shipped",
      },
      {
        time: "Dec 14, 10:00",
        status: "Processing",
        description: "Order is being processed",
      },
    ],
  },
  "2": {
    id: "2",
    type: "warning",
    title: "Payment Pending",
    message: "Your payment for invoice #INV-2024-001 is pending.",
    timestamp: "2024-12-15 14:15:00",
    sender: "Payment Gateway",
    priority: "high",
    category: "Finance",
    email: "billing@payment.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, USA",
    details:
      "We noticed that your payment for invoice #INV-2024-001 worth $499.00 is still pending. Please complete the payment within 48 hours to avoid service interruption. Multiple payment methods are available including credit card, bank transfer, and digital wallets.",
    relatedActions: ["Complete Payment", "View Invoice", "Contact Support"],
    timeline: [
      {
        time: "14:15",
        status: "Payment Pending",
        description: "Awaiting payment completion",
      },
      {
        time: "10:00",
        status: "Invoice Generated",
        description: "Invoice has been generated and sent",
      },
    ],
  },
  "3": {
    id: "3",
    type: "info",
    title: "New Feature Available",
    message: "Check out our new dashboard analytics feature.",
    timestamp: "2024-12-15 13:30:00",
    sender: "Product Team",
    priority: "low",
    category: "Updates",
    email: "product@company.com",
    details:
      "We're excited to announce our new dashboard analytics feature with real-time data visualization, advanced filtering options, and customizable reports. This feature will help you better understand your data and make informed decisions. Access it now from the main dashboard!",
    relatedActions: ["Explore Feature", "Watch Tutorial", "Give Feedback"],
  },
  "4": {
    id: "4",
    type: "error",
    title: "System Error",
    message: "Failed to sync data with cloud storage.",
    timestamp: "2024-12-15 12:30:00",
    sender: "System Administrator",
    priority: "high",
    category: "Technical",
    email: "admin@system.com",
    phone: "+1 (555) 456-7890",
    details:
      "An error occurred while attempting to sync your data with cloud storage. This may be due to connectivity issues or service downtime. Your local data is safe. Please try again later or contact support if the issue persists.",
    relatedActions: ["Retry Sync", "Check Status", "Contact IT Support"],
    timeline: [
      {
        time: "12:30",
        status: "Error",
        description: "Sync failed - connection timeout",
      },
      {
        time: "12:15",
        status: "Syncing",
        description: "Started data synchronization",
      },
    ],
  },
};

const NotificationDetail: React.FC = () => {
  const { notificationId } = useParams<{ notificationId: string }>();

const notification = notificationId
  ? dummyNotificationDetails[notificationId]
  : null;
const navigate = useNavigate();

const handleBack = () => {
  navigate("/notifications");
};


  if (!notification) {
    return (
      <div className="notification-detail-container">
        <Card>
          <Alert
            message="Notification Not Found"
            description="The notification you're looking for doesn't exist or has been deleted."
            type="error"
            showIcon
          />
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{ marginTop: 16 }}
          >
            Back to Notifications
          </Button>
        </Card>
      </div>
    );
  }

  const getIcon = (type: string) => {
    const iconStyle = { fontSize: 48 };
    switch (type) {
      case "success":
        return <CheckCircleOutlined style={{ ...iconStyle, color: "#52c41a" }} />;
      case "error":
        return <CloseCircleOutlined style={{ ...iconStyle, color: "#ff4d4f" }} />;
      case "warning":
        return <ExclamationCircleOutlined style={{ ...iconStyle, color: "#faad14" }} />;
      case "info":
        return <InfoCircleOutlined style={{ ...iconStyle, color: "#1890ff" }} />;
      default:
        return <InfoCircleOutlined style={iconStyle} />;
    }
  };

  const getPriorityColor = (priority: string) => {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
        return "processing";
      default:
        return "default";
    }
  };

  return (
    <div className="notification-detail-container">
      <Button
        icon={<ArrowLeftOutlined />}
       onClick={handleBack}
        className="back-button"
        size="large"
      >
        Back to Notifications
      </Button>

      <Card className="detail-card" bordered={false}>
        <div className="detail-header">
          <div className="detail-icon">{getIcon(notification.type)}</div>
          
          <div className="detail-header-content">
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Space>
                <Tag color={getTypeColor(notification.type)}>
                  {notification.type.toUpperCase()}
                </Tag>
                <Tag color={getPriorityColor(notification.priority)}>
                  {notification.priority.toUpperCase()} PRIORITY
                </Tag>
                <Tag icon={<TagOutlined />}>{notification.category}</Tag>
              </Space>
              
              <Title level={2} style={{ margin: 0 }}>
                {notification.title}
              </Title>
              
              <Text type="secondary" style={{ fontSize: 16 }}>
                {notification.message}
              </Text>
            </Space>
          </div>
        </div>

        <Divider />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              <div>
                <Title level={4}>Details</Title>
                <Paragraph style={{ fontSize: 15, lineHeight: 1.8 }}>
                  {notification.details}
                </Paragraph>
              </div>
            </Space>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="info-card" title="Sender Information">
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div className="info-item">
                  <Avatar size={64} icon={<UserOutlined />} />
                  <Title level={5} style={{ marginTop: 8 }}>
                    {notification.sender}
                  </Title>
                </div>

                <Divider style={{ margin: "8px 0" }} />

                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  {notification.email && (
                    <div className="contact-item">
                      <MailOutlined className="contact-icon" />
                      <Text>{notification.email}</Text>
                    </div>
                  )}

                  {notification.phone && (
                    <div className="contact-item">
                      <PhoneOutlined className="contact-icon" />
                      <Text>{notification.phone}</Text>
                    </div>
                  )}

                  {notification.location && (
                    <div className="contact-item">
                      <EnvironmentOutlined className="contact-icon" />
                      <Text>{notification.location}</Text>
                    </div>
                  )}

                  <div className="contact-item">
                    <ClockCircleOutlined className="contact-icon" />
                    <Text type="secondary">{notification.timestamp}</Text>
                  </div>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default NotificationDetail;