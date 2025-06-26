import {useEffect, useState, useMemo} from 'react';
import {I18nManager, Dimensions} from 'react-native';
import {getDropdownHeight} from '../helpers/getDropdownHeight';
import {useKeyboardHeight} from './useKeyboardHeight';
const {height} = Dimensions.get('window');
const DROPDOWN_MAX_HEIGHT = height * 0.4;

export const useLayoutDropdown = (data, dropdownStyle, isShowFullHeight = false) => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState(null);
  const [dropdownCalculatedStyle, setDropdownCalculatedStyle] = useState({});

  const [dropdownHEIGHT, setDropdownHEIGHT] = useState(() => {
    return getDropdownHeight(dropdownStyle, DROPDOWN_MAX_HEIGHT);
  });

  const {keyboardHeight} = useKeyboardHeight();

  useEffect(() => {
    setDropdownHEIGHT(getDropdownHeight(dropdownStyle, DROPDOWN_MAX_HEIGHT));
  }, [JSON.stringify(dropdownStyle), JSON.stringify(data)]);

  const onDropdownButtonLayout = (w, h, px, py) => {
    setButtonLayout({w, h, px, py});

    const dropdownHeight = getDropdownHeight(dropdownStyle, DROPDOWN_MAX_HEIGHT);
    if (py + h + dropdownHeight > height) {
      return setDropdownCalculatedStyle({
        bottom: height - (py + h) + h,
        width: dropdownStyle?.width || w,
        ...(I18nManager.isRTL ? {right: dropdownStyle?.right || px} : {left: dropdownStyle?.left || px}),
      });
    }
    return setDropdownCalculatedStyle({
      top: py + h,
      width: dropdownStyle?.width || w,
      ...(I18nManager.isRTL ? {right: dropdownStyle?.right || px} : {left: dropdownStyle?.left || px}),
    });
  };

  const dropdownWindowStyle = useMemo(() => {
    const getPositionIfKeyboardIsOpened = () => {
      const dropHeight = isShowFullHeight ? dropdownHEIGHT : 200;
      if (isVisible && keyboardHeight) {
        const newTop = height - (keyboardHeight + dropHeight + 20);
        if (dropdownCalculatedStyle.top && dropdownCalculatedStyle.top + keyboardHeight + dropHeight > height) {
          return {top: newTop, minHeight: dropHeight};
        }
        const convertFromBottomToTop = dropdownCalculatedStyle.bottom ? height - (dropdownCalculatedStyle.bottom + dropHeight) : 0;
        if (convertFromBottomToTop !== 0 && convertFromBottomToTop + keyboardHeight + dropHeight > height) {

          return {top: newTop, bottom: undefined, minHeight: dropHeight};
        }
      }
      return {};
    };

    return {
      ...{
        borderTopWidth: 0,
        overflow: 'hidden',
      },
      ...dropdownStyle,
      ...dropdownCalculatedStyle,
      ...{
        position: 'absolute',
        height: dropdownHEIGHT,
        maxHeight: DROPDOWN_MAX_HEIGHT,
      },
      ...getPositionIfKeyboardIsOpened(),
    };
  }, [
    JSON.stringify(dropdownStyle),
    JSON.stringify(dropdownCalculatedStyle),
    keyboardHeight,
    dropdownHEIGHT,
    isVisible,
  ]);

  const onRequestClose = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    setIsVisible,
    buttonLayout,
    onDropdownButtonLayout,
    dropdownWindowStyle,
    onRequestClose,
  };
};
