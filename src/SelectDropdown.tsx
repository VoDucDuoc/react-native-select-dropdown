import React, { forwardRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, FlatList, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { isExist } from './helpers/isExist';
import Input from './components/Input';
import DropdownOverlay from './components/DropdownOverlay';
import DropdownModal from './components/DropdownModal';
import DropdownWindow from './components/DropdownWindow';
import { useSelectDropdown } from './hooks/useSelectDropdown';
import { useLayoutDropdown } from './hooks/useLayoutDropdown';
import { useRefs } from './hooks/useRefs';
import { findIndexInArr } from './helpers/findIndexInArr';
import { getWidth } from './helpers/getWidth';

export interface SelectDropdownProps {
  // ==================== Core Props ====================
  /**
   * array of data that will be represented in dropdown, can be array of objects
   */
  data: Array<any>;
  /**
   * function recieves selected item and its index in data array
   */
  onSelect: (selectedItem: any, index: number) => void;
  /**
   * function returns React component for the dropdown button
   */
  renderButton: (selectedItem: any, isOpened: boolean) => React.ReactNode;
  /**
   * function returns React component for each dropdown item
   */
  renderItem: (selectedItem: any, index: number, isSelected: boolean) => React.ReactNode;

  // ==================== Selection Props ====================
  /**
   * default selected item in dropdown
   */
  defaultValue?: any;
  /**
   * default selected item index
   */
  defaultValueByIndex?: number;
  /**
   * Enable multiple selection
   */
  multiple?: boolean;
  /**
   * function returns React component for the dropdown button when multiple is true
   */
  renderButtonMultiple?: (selectedItems: any[], isOpened: boolean) => React.ReactNode;
  /**
   * disable dropdown
   */
  disabled?: boolean;
  /**
   * array of disabled items index
   */
  disabledIndexes?: number[];

  // ==================== Search Props ====================
  /**
   * enable search functionality
   */
  search?: boolean;
  /**
   * style object for search input
   */
  searchInputStyle?: StyleProp<ViewStyle>;
  /**
   * text color for search input
   */
  searchInputTxtColor?: string;
  /**
   * text style for search input
   */
  searchInputTxtStyle?: StyleProp<TextStyle>;
  /**
   * placeholder text for search input
   */
  searchPlaceHolder?: string;
  /**
   * text color for search input placeholder
   */
  searchPlaceHolderColor?: string;
  /**
   * Enable auto focus the search input
   */
  autoFocusSearchInput?: boolean;
  /**
   * Remove diacritics from search input text
   */
  isRemoveDiacritics?: boolean;
  /**
   * function returns React component for search input icon
   */
  renderSearchInputLeftIcon?: () => React.ReactNode;
  /**
   * function returns React component for search input icon
   */
  renderSearchInputRightIcon?: () => React.ReactNode;
  /**
   * function callback when the search input text changes, this will automatically disable the dropdown's internal search to be implemented manually outside the component
   */
  onChangeSearchInputText?: (searchText: string) => void;

  // ==================== Styling Props ====================
  /**
   * style object for dropdown view
   */
  dropdownStyle?: StyleProp<ViewStyle>;
  /**
   * backdrop color when dropdown is opened
   */
  dropdownOverlayColor?: string;
  /**
   * style object for dropdown content container
   */
  dropdownContentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * When true, shows a vertical scroll indicator in the dropdown.
   */
  showsVerticalScrollIndicator?: boolean;

  // ==================== Behavior Props ====================
  /**
   * Dropdown position mode: 'default' positions dropdown near button, 'bottom' positions dropdown at bottom of screen
   */
  dropdownPositionMode?: 'default' | 'bottom';
  /**
   * Keyboard height, used to calculate dropdown position when keyboard is opened
   */
  keyboardHeight?: number;
  /**
   * disable auto scroll to selected value
   */
  disableAutoScroll?: boolean;
  /**
   * required to set true when statusbar is translucent (android only)
   */
  statusBarTranslucent?: boolean;

  // ==================== Event Props ====================
  /**
   * function fires when dropdown is opened
   */
  onFocus?: () => void;
  /**
   * function fires when dropdown is closed
   */
  onBlur?: () => void;
  /**
   * function fires when dropdown reaches the end
   */
  onScrollEndReached?: () => void;

  // ==================== Other Props ====================
  /**
   * dropdown menu testID
   */
  testID?: string;
}

export interface SelectDropdownRef {
  /**
   * Remove selection & reset it
   */
  reset(): void;
  /**
   * Open the dropdown.
   */
  openDropdown(): void;
  /**
   * Close the dropdown.
   */
  closeDropdown(): void;
  /**
   * Select index.
   */
  selectIndex(index: number): void;
}

const SelectDropdown = (
  {
    data,
    onSelect,
    renderButton,
    renderButtonMultiple,
    renderItem,
    defaultValue,
    defaultValueByIndex,
    disabled,
    disabledIndexes,
    disableAutoScroll,
    testID,
    onFocus,
    onBlur,
    onScrollEndReached,
    statusBarTranslucent,
    dropdownStyle,
    dropdownOverlayColor,
    showsVerticalScrollIndicator,
    search,
    searchInputStyle,
    searchInputTxtColor,
    searchInputTxtStyle,
    searchPlaceHolder,
    searchPlaceHolderColor,
    renderSearchInputLeftIcon,
    renderSearchInputRightIcon,
    onChangeSearchInputText,
    multiple = false, // for multiple select
    autoFocusSearchInput = false,
    isRemoveDiacritics = false,
    dropdownContentContainerStyle,
    dropdownPositionMode = 'default',
    keyboardHeight,
  }: SelectDropdownProps,
  ref: React.Ref<SelectDropdownRef>,
) => {
  const disabledInternalSearch = !!onChangeSearchInputText;
  /* ******************* hooks ******************* */
  const { dropdownButtonRef, dropDownFlatlistRef } = useRefs();
  const {
    dataArr, //
    selectedItem,
    selectedItems,
    selectItem,
    selectItems,
    reset,
    searchTxt,
    setSearchTxt,
  } = useSelectDropdown(data, defaultValueByIndex, defaultValue, disabledInternalSearch, multiple, isRemoveDiacritics);
  const {
    isVisible,
    setIsVisible,
    buttonLayout,
    onDropdownButtonLayout,
    dropDownStyleByMode,
    onRequestClose,
    dropdownPosition,
    setIsFocusedSearchInput,
    isKeyboardOpened,
    keyboardAdjustmentForBottomMode
  } = useLayoutDropdown(data, dropdownStyle, dropdownPositionMode, keyboardHeight);
  useImperativeHandle(ref, () => ({
    reset: () => {
      reset();
    },
    openDropdown: () => {
      openDropdown();
    },
    closeDropdown: () => {
      closeDropdown();
    },
    selectIndex: (index: number) => {
      selectItem(index);
    },
  }));
  /* ******************* Methods ******************* */
  const openDropdown = () => {
    if (dropdownButtonRef.current) {
      dropdownButtonRef.current.measure(
        async (_fx: number, _fy: number, w: number, h: number, px: number, py: number) => {
          onDropdownButtonLayout(w, h, px, py);
          await new Promise(resolve => setTimeout(resolve, 200));
          setIsVisible(true);
          onFocus && onFocus();
          if (!disableAutoScroll) {
            scrollToSelectedItem();
          }
        },
      );
    }
  };
  const closeDropdown = () => {
    onRequestClose();
    setSearchTxt('');
    onBlur && onBlur();
  };
  const scrollToSelectedItem = () => {
    const indexInCurrArr = findIndexInArr(selectedItem, dataArr);
    setTimeout((): void => {
      if (disableAutoScroll) {
        return;
      }
      if (indexInCurrArr > 1) {
        dropDownFlatlistRef?.current?.scrollToIndex({
          index: search ? indexInCurrArr - 1 : indexInCurrArr,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }, 200);
  };
  const onSelectItem = (item: any, index: number) => {
    const indexInOriginalArr = findIndexInArr(item, data);
    onSelect && onSelect(item, indexInOriginalArr);
    if (multiple) {
      selectItems(indexInOriginalArr);
    } else {
      selectItem(indexInOriginalArr);
      closeDropdown();
    }
  };
  const onScrollToIndexFailed = (error: { index: number; averageItemLength: number }) => {
    if (dropDownFlatlistRef.current) {
      dropDownFlatlistRef.current.scrollToOffset({
        offset: error.averageItemLength * error.index,
        animated: true,
      });
      setTimeout((): void => {
        if (dataArr.length !== 0 && dropDownFlatlistRef.current) {
          dropDownFlatlistRef.current.scrollToIndex({ index: error.index, animated: true });
        }
      }, 100);
    }
  };
  /* ******************** Render Methods ******************** */
  const renderSearchView = (): React.ReactElement | null => {
    if (!search || !buttonLayout) {
      return null;
    }
    return (
      <Input
        searchViewWidth={getWidth(dropDownStyleByMode) || buttonLayout.w}
        value={searchTxt}
        valueColor={searchInputTxtColor}
        placeholder={searchPlaceHolder}
        placeholderTextColor={searchPlaceHolderColor}
        onChangeText={(txt: string) => {
          setSearchTxt(txt);
          disabledInternalSearch && onChangeSearchInputText && onChangeSearchInputText(txt);
        }}
        inputStyle={searchInputStyle}
        inputTextStyle={searchInputTxtStyle}
        renderLeft={renderSearchInputLeftIcon}
        renderRight={renderSearchInputRightIcon}
        autoFocus={autoFocusSearchInput}
        onFocus={() => setIsFocusedSearchInput(true)}
        onBlur={() => setIsFocusedSearchInput(false)}
      />
    );
  };
  const renderFlatlistItem = ({ item, index }: { item: any; index: number }): React.ReactElement | null => {
    let isSelected = false;
    if (multiple) {
      isSelected = selectedItems.some((selectedItem: any) => selectedItem?.index === index);
    } else {
      const indexInCurrArr = findIndexInArr(selectedItem, dataArr);
      isSelected = index == indexInCurrArr;
    }

    let clonedElement = renderItem ? renderItem(item, index, isSelected) : <View />;
    // Ensure clonedElement is a React element, not null/undefined
    if (!clonedElement || typeof clonedElement !== 'object' || !('props' in clonedElement)) {
      clonedElement = <View />;
    }
    let props = { ...(clonedElement as React.ReactElement).props };
    return isExist(item) ? (
      <TouchableOpacity
        {...props}
        disabled={disabledIndexes?.includes(index)}
        activeOpacity={0.8}
        onPress={() => onSelectItem(item, index)}>
        {props?.children}
      </TouchableOpacity>
    ) : null;
  };

  const renderDropdown = () => {
    return (
      isVisible && <DropdownModal statusBarTranslucent={statusBarTranslucent} visible={isVisible} onRequestClose={onRequestClose}>
        <DropdownOverlay onPress={closeDropdown} backgroundColor={dropdownOverlayColor} />
        <DropdownWindow
          dropDownStyle={dropDownStyleByMode}
          dropdownPosition={dropdownPosition}
          dropdownPositionMode={dropdownPositionMode}
          isKeyboardOpened={isKeyboardOpened}
          keyboardAdjustmentForBottomMode={keyboardAdjustmentForBottomMode}
        >
          <FlatList
            testID={testID}
            data={dataArr}
            keyExtractor={(item: any, index: number) => index.toString()}
            ref={dropDownFlatlistRef}
            renderItem={renderFlatlistItem}
            ListHeaderComponent={renderSearchView()}
            stickyHeaderIndices={search && buttonLayout ? [0] : undefined}
            onEndReached={() => onScrollEndReached && onScrollEndReached()}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            onScrollToIndexFailed={onScrollToIndexFailed}
            contentContainerStyle={dropdownContentContainerStyle}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode='interactive'
          />
        </DropdownWindow>
      </DropdownModal>
    );
  };
  ///////////////////////////////////////////////////////
  let clonedElement = multiple ? (
    renderButtonMultiple ? (
      renderButtonMultiple(selectedItems, isVisible)
    ) : (
      <View />
    )
  ) : renderButton ? (
    renderButton(selectedItem, isVisible)
  ) : (
    <View />
  );
  // Ensure clonedElement is a React element, not null/undefined
  if (!clonedElement || typeof clonedElement !== 'object' || !('props' in clonedElement)) {
    clonedElement = <View />;
  }
  let props = { ...(clonedElement as React.ReactElement).props };
  return (
    <View>
      <TouchableOpacity
        {...props}
        activeOpacity={0.8}
        ref={dropdownButtonRef}
        disabled={disabled}
        onPress={openDropdown}>
        {props?.children}
      </TouchableOpacity>
      {renderDropdown()}
    </View>
  );
};

export default forwardRef<SelectDropdownRef, SelectDropdownProps>(
  (props: SelectDropdownProps, ref: React.Ref<SelectDropdownRef>) => SelectDropdown(props, ref),
);
