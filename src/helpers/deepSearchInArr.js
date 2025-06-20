const contains = (item, searchTxt, isRemoveDiacritics = false) => {
  // item is an object
  if (typeof item == 'object' && item != null) {
    for (let key in item) {
      const value = item[key];
      if (contains(value, searchTxt, isRemoveDiacritics)) {
        return true;
      }
    }
  }
  // string, number or boolean
  if (typeof item != 'object' && item != null && item != undefined) {
    const itemStringfied = isRemoveDiacritics ? removeDiacritics(item.toString().toLowerCase()) : item.toString().toLowerCase();
    const searchTxtStringfied = isRemoveDiacritics ? removeDiacritics(searchTxt.toString().toLowerCase()) : searchTxt.toString().toLowerCase();
    if (itemStringfied.includes(searchTxtStringfied)) {
      return true;
    }
  }
  return false;
};

const removeDiacritics = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

export const deepSearchInArr = (query, arr, isRemoveDiacritics = false) => {
  let array = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    if (contains(arr[i], query, isRemoveDiacritics)) {
      array.push(arr[i]);
    }
    if (i == arr.length - 1) {
      return array;
    }
  }
};
