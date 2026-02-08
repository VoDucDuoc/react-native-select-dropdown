import {useState, useEffect, useMemo} from 'react';
import {deepSearchInArr} from '../helpers/deepSearchInArr';
import {findIndexInArr} from '../helpers/findIndexInArr';
import {isExist} from '../helpers/isExist';

interface SelectedItem {
  index: number;
  [key: string]: any;
}

export const useSelectDropdown = (
  data: any[],
  defaultValueByIndex: number | undefined,
  defaultValue: any,
  disabledInternalSearch: boolean,
  multiple: boolean = false,
  isRemoveDiacritics: boolean = false,
) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]); // selected items from dropdown
  const [selectedItem, setSelectedItem] = useState<any>(null); // selected item from dropdown
  const [selectedIndex, setSelectedIndex] = useState<number>(-1); // index of selected item from dropdown
  const [searchTxt, setSearchTxt] = useState<string>('');

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
        if (multiple) {
          selectItems(defaultValueByIndex);
        } else {
          selectItem(defaultValueByIndex);
        }
      }
    }
  }, [JSON.stringify(defaultValueByIndex)]);
  // default value added or changed
  useEffect(() => {
    // defaultValue may be equals zero
    if (isExist(defaultValue)) {
      if (multiple) {
        for (let index = 0; index < defaultValue.length; index++) {
          const selectItemIndex = findIndexInArr(defaultValue[index], data);
          if (data && selectItemIndex >= 0) {
            selectItems(selectItemIndex);
          }
        }
       
      } else {
        const selectItemIndex = findIndexInArr(defaultValue, data);
        if (data && selectItemIndex >= 0) {
          selectItem(selectItemIndex);
        }
      }
    }
  }, [JSON.stringify(defaultValue), data]);

  const dataArr = useMemo(() => {
    if (disabledInternalSearch) {
      return data;
    }
    return searchTxt ? deepSearchInArr(searchTxt, data, isRemoveDiacritics) : data;
  }, [JSON.stringify(data), searchTxt]);

  const selectItem = (index: number) => {
    setSelectedItem(data[index]);
    setSelectedIndex(index);
  };
  const selectItems = (index: number) => {
    setSelectedItems(prevSelectedItems => {
      const isExist = prevSelectedItems.some(item => item?.index === index);
      if (isExist) {
        return prevSelectedItems.filter(item => item?.index !== index);
      } else {
        if (typeof data[index] === 'object') {
          return [...prevSelectedItems, {...data[index], index}];
        }
        return [...prevSelectedItems, {item: data[index], index}];
      }
    });
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
    selectItems,
    reset,
    searchTxt,
    setSearchTxt,
  };
};

