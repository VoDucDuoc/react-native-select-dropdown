import { useState, useMemo, useCallback, useEffect } from 'react';
import { I18nManager, Dimensions, StyleProp, ViewStyle, Platform, StatusBar } from 'react-native';
import { getDropdownHeight } from '../helpers/getDropdownHeight';
import { getCachedKeyboardHeight, useKeyboardHeight } from './useKeyboardHeight';
import { getWidth } from '../helpers/getWidth';
import { getRight } from '../helpers/getRight';
import { getLeft } from '../helpers/getLeft';
import { useAnimatedKeyboard, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { height: screenHeight } = Dimensions.get('window');
const DROPDOWN_MAX_HEIGHT = screenHeight * 0.4;

interface ButtonLayout {
  w: number;
  h: number;
  px: number;
  py: number;
}

export const useLayoutDropdown = (
  data: any[],
  dropdownStyle: StyleProp<ViewStyle> | undefined,
  dropdownPositionMode: 'default' | 'bottom' = 'default',
  keyboardHeightDefault?: number,
) => {
  const { keyboardHeight: keyboardHeightHook, isKeyboardVisible } = useKeyboardHeight();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [buttonLayout, setButtonLayout] = useState<ButtonLayout | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<string>('');
  const [isFocusedSearchInput, setIsFocusedSearchInput] = useState(false);
  const [defaultModeStyle, setDefaultModeStyle] = useState<Partial<ViewStyle> | null>(null);

  const translateYKeyboard = useSharedValue(0);

  const isKeyboardOpened = useMemo(() => {
    const isIos = Platform.OS === 'ios';
    const isAndroid = Platform.OS === 'android';
    return (isIos && isFocusedSearchInput) || (isAndroid && isKeyboardVisible);
  }, [isFocusedSearchInput, isKeyboardVisible]);

  const handleTranslateYKeyboard = useCallback((value: number) => {
    if (dropdownPositionMode !== 'bottom') {
      return;
    }
    translateYKeyboard.value = withTiming(value);
  }, [dropdownPositionMode, translateYKeyboard]);

  const keyboardHeight = useMemo(() => {
    if (!isKeyboardOpened) {
      handleTranslateYKeyboard(0);
      return 0;
    }

    const calculatorKeyboardHeight = (keyboardHeightDefault || getCachedKeyboardHeight() || keyboardHeightHook) + Platform.select({
      ios: 0,
      android: StatusBar.currentHeight ?? 0,
      default: 0,
    }) as number;
    handleTranslateYKeyboard(-calculatorKeyboardHeight);
    return calculatorKeyboardHeight;
  }, [keyboardHeightHook, keyboardHeightDefault, getCachedKeyboardHeight, isKeyboardOpened]);

  const dropdownHeight = useMemo<number>(
    () => getDropdownHeight(dropdownStyle, DROPDOWN_MAX_HEIGHT),
    [dropdownStyle]
  );



  const calculateDefaultModeStyle = (
    w: number,
    h: number,
    px: number,
    py: number,
    dropdownHeight: number,
    dropdownStyle: StyleProp<ViewStyle> | undefined,
  ): { style: Partial<ViewStyle>; position: 'above' | 'below' } => {
    const width =
      getWidth(dropdownStyle) || w;

    const right =
      getRight(dropdownStyle) || px;
    const left =
      getLeft(dropdownStyle) || px;

    const horizontalPosition = I18nManager.isRTL ? { right } : { left };

    const fitsBelow = py + h + dropdownHeight <= screenHeight;

    if (fitsBelow) {
      return {
        position: 'below',
        style: {
          top: py + h,
          width,
          ...horizontalPosition,
        },
      };
    }

    return {
      position: 'above',
      style: {
        top: py - dropdownHeight,
        width,
        ...horizontalPosition,
      },
    };
  }

  const bottomModeStyle = useMemo(() => (dropdownStyle: StyleProp<ViewStyle> | undefined): Partial<ViewStyle> => {
    const width =
      getWidth(dropdownStyle) || '100%';

    return {
      bottom: 0,
      left: 0,
      right: 0,
      width,
    };
  }, []);

  const onDropdownButtonLayout = (w: number, h: number, px: number, py: number) => {
    setButtonLayout({ w, h, px, py });

    if (dropdownPositionMode === 'bottom') {
      setDropdownPosition('above');
      return;
    }

    if (dropdownPositionMode === 'default') {
      const { position, style } = calculateDefaultModeStyle(
        w,
        h,
        px,
        py,
        dropdownHeight,
        dropdownStyle,
      );
      setDropdownPosition(position);
      setDefaultModeStyle(style);
      return
    }
  };

  const keyboardAdjustmentForBottomMode = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateYKeyboard.value }],
    };
  })

  const keyboardAdjustmentForDefaultMode = useMemo(() => {
    if (!isKeyboardOpened || dropdownPositionMode !== 'default') {
      return {};
    }

    const newTop = screenHeight - (keyboardHeight + dropdownHeight);

    // Check if dropdown with keyboard overlaps screen when positioned by top
    if (
      defaultModeStyle?.top &&
      typeof defaultModeStyle.top === 'number' &&
      defaultModeStyle.top + keyboardHeight + dropdownHeight > screenHeight
    ) {
      return { top: undefined, height: dropdownHeight, bottom: keyboardHeight };
    }

    // Check if dropdown with keyboard overlaps screen when positioned by bottom
    const convertFromBottomToTop =
      defaultModeStyle?.bottom && typeof defaultModeStyle.bottom === 'number'
        ? screenHeight - (defaultModeStyle.bottom + dropdownHeight)
        : 0;

    if (convertFromBottomToTop !== 0 && convertFromBottomToTop + keyboardHeight + dropdownHeight > screenHeight) {
      return { top: newTop, bottom: undefined, height: dropdownHeight };
    }

    return {};
  }, [keyboardHeight, dropdownPositionMode, dropdownHeight, isKeyboardOpened, buttonLayout, dropdownStyle, defaultModeStyle]);


  const dropDownStyleByMode = useMemo<StyleProp<ViewStyle>>(() => {
    const baseStyle = {
      ...(dropdownStyle && typeof dropdownStyle === 'object' ? dropdownStyle : {}),
      overflow: 'hidden',
      height: dropdownHeight,
      position: 'absolute',
    };

    return {
      ...baseStyle,
      ...bottomModeStyle(dropdownStyle),
      ...defaultModeStyle,
      ...keyboardAdjustmentForDefaultMode
    } as ViewStyle;
  }, [
    dropdownStyle,
    dropdownHeight,
    bottomModeStyle,
    defaultModeStyle,
    keyboardAdjustmentForDefaultMode
  ]);

  const onRequestClose = () => {
    setIsVisible(false);
    setIsFocusedSearchInput(false);
  };

  return {
    isVisible,
    setIsVisible,
    buttonLayout,
    onDropdownButtonLayout,
    dropDownStyleByMode,
    onRequestClose,
    dropdownPosition,

    isKeyboardOpened,
    setIsFocusedSearchInput,

    keyboardAdjustmentForBottomMode
  };
};
