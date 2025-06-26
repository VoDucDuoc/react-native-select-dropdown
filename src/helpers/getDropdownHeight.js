export const getDropdownHeight = (dropdownStyle, maxHeight) => {
  if (dropdownStyle && dropdownStyle.height) {
    return dropdownStyle.height;
  }
  return maxHeight;
};
