import React from 'react';
import { Modal } from 'react-native';
interface DropdownModalProps {
  visible: boolean;
  statusBarTranslucent?: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

const DropdownModal: React.FC<DropdownModalProps> = ({ visible, statusBarTranslucent, onRequestClose, children }) => {
  const defaults = {
    statusBarTranslucent: statusBarTranslucent || true,
  };
  return (
    <Modal
      onRequestClose={onRequestClose}
      supportedOrientations={['portrait', 'landscape']}
      transparent={true}
      statusBarTranslucent={defaults.statusBarTranslucent}
      visible={visible}
      animationType='fade'
    >
      {children}
    </Modal>
  );
};

export default DropdownModal;

