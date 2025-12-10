import React from "react";
import { Modal, Button } from "antd";

interface DynamicModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    isLoading?: boolean;
    width?: number | string;
    mode?: "view" | "edit" | "create";
    children: React.ReactNode;
}

export const DynamicModal: React.FC<DynamicModalProps> = ({
    title,
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    width = 800,
    mode = "view",
    children,
}) => {
    // Tombol Footer Dinamis
    const footerButtons = [
        <Button key="back" onClick={onClose} style={{ borderRadius: '6px' }}>
            {mode === "view" ? "Tutup" : "Batal"}
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
            >
                Simpan Data
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
            destroyOnClose
            styles={{ mask: { backdropFilter: 'blur(4px)' } }} // Efek blur modern
        >
            <div style={{ paddingTop: '16px' }}>
                {children}
            </div>
        </Modal>
    );
};