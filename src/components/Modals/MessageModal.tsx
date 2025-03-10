import React from 'react';

import modalStyle from '@/styles/Modal/MessageModal.module.scss'
import btnStyle from '@/styles/btn.module.scss'

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className={modalStyle.modalOverlay}>
      <div className={modalStyle.modalContent}>
        <h3 className={modalStyle.modalTitle}>{title}</h3>
        <p className={modalStyle.modalMessage}>{message}</p>
        
        <div className={modalStyle.modalActions}>
          <button
            onClick={onClose}
            className={`${btnStyle.btn} ${btnStyle.btnDanger}`}
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className={`${btnStyle.btn} ${btnStyle.btnPrimary}`}
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;