import React, { useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import '../styles/notification.css'; // Pastikan path css sesuai

interface NotificationProps {
  show: boolean;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  onClose: () => void;
}

const CustomNotification = ({ show, type, title, message, onClose }: NotificationProps) => {
  // Auto close setelah 4 detik
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />;
      case 'error': return <XCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      default: return <Shield size={20} />;
    }
  };

  return (
    <div className={`custom-notification ${type} ${show ? 'active' : ''}`}>
      <div className="notif-icon-wrapper">
        <div className="icon-bg">
          {getIcon()}
        </div>
      </div>

      <div className="notif-content">
        <span className="notif-title">{title}</span>
        <p className="notif-message">{message}</p>
      </div>

      <button className="close-btn" onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  );
};

export default CustomNotification;