import { TouchableOpacity } from 'react-native';
import React from 'react';

interface DropdownOverlayProps {
  onPress: () => void;
  backgroundColor?: string;
}

const DropdownOverlay: React.FC<DropdownOverlayProps> = ({ onPress, backgroundColor }) => {
  const defaults = {
    backgroundColor: backgroundColor || 'rgba(0,0,0,0.4)',
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: defaults.backgroundColor,
      }}
    />
  );
};

export default DropdownOverlay;


