import {useState, useEffect, useMemo} from 'react';
import {deepSearchInArr} from '../helpers/deepSearchInArr';
import {findIndexInArr} from '../helpers/findIndexInArr';
import {isExist} from '../helpers/isExist';

export const useSelectDropdown = (
  data,
  defaultValueByIndex,
  defaultValue,
  disabledInternalSearch,
  multiple = false,
) => {
  const [selectedItems, setSelectedItems] = useState([]); // selected items from dropdown
  const [selectedItem, setSelectedItem] = useState(null); // selected item from dropdown
  const [selectedIndex, setSelectedIndex] = useState(-1); // index of selected item from dropdown
  const [searchTxt, setSearchTxt] = useState('');

  // data array changes
  useEffect(() => {
    if (!data || data.length == 0) {
      reset();
    }
  }, [JSON.stringify(data)]);

  // default value by index added or changed
  useEffect(() => {
    // defaultValueByIndex may be equals zero
    if (isExist(defaultValueByIndex)) {
      if (data && isExist(data[defaultValueByIndex])) {
        selectItem(defaultValueByIndex);
      }
    }
  }, [JSON.stringify(defaultValueByIndex)]);
  // default value added or changed
  useEffect(() => {
    // defaultValue may be equals zero
    if (isExist(defaultValue)) {
      if (data && findIndexInArr(defaultValue, data) >= 0) {
        selectItem(findIndexInArr(defaultValue, data));
      }
    }
  }, [JSON.stringify(defaultValue)]);

  const dataArr = useMemo(() => {
    if (disabledInternalSearch) {
      return data;
    }
    return searchTxt ? deepSearchInArr(searchTxt, data) : data;
  }, [JSON.stringify(data), searchTxt]);

  const selectItem = index => {
    if (multiple) {
      setSelectedItems(prevSelectedItems => {
        const isExist = prevSelectedItems.some(item => item?.index === index);
        if (isExist) {
          return prevSelectedItems.filter(item => item?.index !== index);
        } else {
          if(typeof data[index] === 'object') {
            return [...prevSelectedItems, { ...data[index], index }];
          }
          return [...prevSelectedItems, { item: data[index], index }];
        }
      });
    } else {
      setSelectedItem(data[index]);
      setSelectedIndex(index);
    }
  };

  const reset = () => {
    if (multiple) {
      setSelectedItems([]);
    } else {
      setSelectedItem(null);
    }
    setSelectedIndex(-1);
  };

  return {
    dataArr,
    selectedItem,
    selectedItems,
    selectedIndex,
    selectItem,
    reset,
    searchTxt,
    setSearchTxt,
  };
};
