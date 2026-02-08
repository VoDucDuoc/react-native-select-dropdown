import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, KeyboardAvoidingView } from 'react-native';
import Animated, { FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';

interface DropdownWindowProps {
  dropDownStyle: StyleProp<ViewStyle>;
  children: React.ReactNode;
  dropdownPosition: string;
  dropdownPositionMode: 'default' | 'bottom';
  isKeyboardOpened: boolean;
  keyboardAdjustmentForBottomMode: StyleProp<ViewStyle>;
}

const DropdownWindow: React.FC<DropdownWindowProps> = ({ dropDownStyle, children, dropdownPosition, dropdownPositionMode, isKeyboardOpened, keyboardAdjustmentForBottomMode }) => {
  const _entering = dropdownPosition === 'above' ? FadeInDown : FadeInUp;

  if (dropdownPositionMode === 'bottom') {
    return (
      <Animated.View
        style={[
          styles.dropdownOverlayView, styles.shadow, dropDownStyle, keyboardAdjustmentForBottomMode]}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={_entering}
      layout={LinearTransition}
      style={[
        styles.dropdownOverlayView, styles.shadow,
        dropDownStyle,
      ]}>
      {children}
    </Animated.View>
  );
};

export default DropdownWindow;

const styles = StyleSheet.create({
  dropdownOverlayView: {
    backgroundColor: '#EFEFEF',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
});
