import {useRef, RefObject} from 'react';
import {View, FlatList} from 'react-native';

export const useRefs = () => {
  const dropdownButtonRef = useRef<View>(null); // button ref to get positions
  const dropDownFlatlistRef = useRef<FlatList>(null); // ref to the drop down flatlist

  return {
    dropdownButtonRef,
    dropDownFlatlistRef,
  };
};

