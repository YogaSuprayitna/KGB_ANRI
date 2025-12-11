import React from "react";
import { Modal, Button, ButtonProps } from "antd";

interface DynamicModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    isLoading?: boolean;
    width?: number | string;
    mode?: "view" | "edit" | "create";
    children: React.ReactNode;
    okText?: string;
    cancelText?: string;
    okButtonProps?: ButtonProps;
    cancelButtonProps?: ButtonProps;
}

export const DynamicModal: React.FC<DynamicModalProps> = ({
    title,
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    width = 800,
    mode = "view",
    children,
    okText = "Simpan Data",
    cancelText,
    okButtonProps,
    cancelButtonProps,
}) => {
    // Tombol Footer Dinamis
    const footerButtons: React.ReactNode[] = [
        <Button 
            key="back" 
            onClick={onClose} 
            style={{ borderRadius: '6px' }}
            {...cancelButtonProps}
        >
            {cancelText || (mode === "view" ? "Tutup" : "Batal")}
        </Button>,
    ];

    // Tambahkan tombol Simpan jika bukan mode View
    if (mode !== "view" && onSubmit) {
        footerButtons.push(
            <Button 
                key="submit" 
                type="primary" 
                loading={isLoading} 
                onClick={onSubmit}
                style={{ borderRadius: '6px' }}
                {...okButtonProps}
            >
                {okText}
            </Button>
        );
    }

    return (
        <Modal
            title={<div style={{ fontSize: '18px', fontWeight: 600 }}>{title}</div>}
            open={isOpen}
            onCancel={onClose}
            footer={footerButtons}
            width={width}
            centered
            styles={{ mask: { backdropFilter: 'blur(4px)' } }}
        >
            <div style={{ paddingTop: '16px' }}>
                {children}
            </div>
        </Modal>
    );
};