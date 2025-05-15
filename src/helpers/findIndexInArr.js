import _ from 'lodash';

export const findIndexInArr = (obj, arr, keyForMappingDefaultValues) => {
  var defaultValueIndex = -1;
  if (typeof obj == 'object') {
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (_.isEqual(element, obj)) {
        defaultValueIndex = index;
      }
      if (index == arr.length - 1) {
        return defaultValueIndex;
      }
    }
  } else {
    for (let index = 0; index < arr.length; index++) {
      let element = arr[index];
      if(keyForMappingDefaultValues) {
        element = element[keyForMappingDefaultValues];
      }
      if (element == obj) {
        defaultValueIndex = index;
      }
      if (index == arr.length - 1) {
        return defaultValueIndex;
      }
    }
  }
};
