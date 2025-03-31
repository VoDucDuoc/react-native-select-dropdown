import React, {useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SelectDropdown from '../src/SelectDropdown';

const TestMultipleSelect = () => {
  const dropdownRef = useRef();

  const data = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  const handleSelect = (selectedItems, index) => {
    console.log('Selected Items:', selectedItems);
    console.log('Selected Index:', index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Multiple Select</Text>
      <SelectDropdown
        ref={dropdownRef}
        data={data}
        multiple={true} // Enable multiple select
        onSelect={handleSelect}
        renderButton={(selectedItems) => (
          <Text style={styles.buttonText}>
            {selectedItems?.length > 0 ? selectedItems.join(', ') : 'Select Options'}
          </Text>
        )}
        renderItem={(item, index, isSelected) => (
          <Text style={[styles.itemText, isSelected && styles.selectedItem]}>{item}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  itemText: {
    fontSize: 14,
    padding: 8,
  },
  selectedItem: {
    backgroundColor: '#d3d3d3',
  },
});

export default TestMultipleSelect;
