# react-native-select-dropdown

This package was forked from https://github.com/AdelRedaa97/react-native-select-dropdown

Allow multiple select dropdown with search and custom styles.

## Installation

#### # Using npm

```bash
npm install react-native-select-dropdown
```

#### # Using yarn

```bash
yarn add react-native-select-dropdown
```

## Demo

#### Code provided in Examples folder.

<p float="left">
	<img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTc2a2Ntc2JpMzg4OXMwaWhsamo1c2JuaXFzNTU5Mm1oNDEzZnkzaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Gvm2WysCnUmQR3cwml/giphy.gif" width="300" height="650">
</p>

## Usage

```
import SelectDropdown from '@duocvo/react-native-select-dropdown'
...
  const emojis = [
    'happy',
    'cool',
    'lol',
    'sad',
    'cry',
    'angry',
    'confused',
    'excited',
    'kiss',
    'devil',
    'dead',
    'wink',
    'sick',
    'frown',
  ];
...
        <SelectDropdown
          data={emojis}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
          }}
          renderButtonMultiple={(selectedItems, isOpen) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <CustomText style={styles.dropdownButtonTxtStyle}>
                  {selectedItems?.map(it => it.item).join(', ') || 'Select your mood'}
                </CustomText>
              </View>
            );
          }}
          multiple
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: '#D2D9DF' }),
                }}
              >
                <CustomText style={styles.dropdownItemTxtStyle}>
                  {item}
                </CustomText>
              </View>
            );
          }}
          dropdownStyle={styles.dropdownMenuStyle}
        />
...
  const styles = StyleSheet.create({
    dropdownButtonStyle: {
      width: 200,
      height: 50,
      backgroundColor: '#E9ECEF',
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownMenuStyle: {
      backgroundColor: '#E9ECEF',
      borderRadius: 8,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
  });
```

### Props

- [`data`](#data)

- [`onSelect`](#onSelect)

- [`renderButton`](#renderButton)

- [`renderItem`](#renderItem)

- [`multiple`](#multiple)

- [`renderButtonMultiple](#renderButtonMultiple)

- [`defaultValue`](#defaultValue)

- [`defaultValueByIndex`](#defaultValueByIndex)

- [`disabled`](#disabled)

- [`disabledIndexes`](#disabledIndexes)

- [`disableAutoScroll`](#disableAutoScroll)

- [`testID`](#testID)

- [`onFocus`](#onFocus)

- [`onBlur`](#onBlur)

- [`onScrollEndReached`](#onScrollEndReached)

- [`statusBarTranslucent`](#statusBarTranslucent)

- [`dropdownStyle`](#dropdownStyle)

- [`dropdownOverlayColor`](#dropdownOverlayColor)

- [`showsVerticalScrollIndicator`](#showsVerticalScrollIndicator)

- [`search`](#search)

- [`searchInputStyle`](#searchInputStyle)

- [`searchInputTxtColor`](#searchInputTxtColor)

- [`searchInputTxtStyle`](#searchInputTxtStyle)

- [`searchPlaceHolder`](#searchPlaceHolder)

- [`searchPlaceHolderColor`](#searchPlaceHolderColor)

- [`renderSearchInputLeftIcon`](#renderSearchInputLeftIcon)

- [`renderSearchInputRightIcon`](#renderSearchInputRightIcon)

- [`onChangeSearchInputText`](#onChangeSearchInputText)

### Methods

- [`reset`](#License)
- [`openDropdown`](#License)
- [`closeDropdown`](#License)
- [`selectIndex`](#License)

---

### data

array of data that will be represented in dropdown 'can be array of objects

| Type  | Required |
| ----- | -------- |
| array | Yes      |

---

### onSelect

function recieves selected item and its index in data array

| Type     | Required |
| -------- | -------- |
| function | Yes      |

---

### renderButton

function returns React component for the dropdown button

| Type     | Required |
| -------- | -------- |
| function | Yes      |

---

### renderItem

function returns React component for each dropdown item

| Type     | Required |
| -------- | -------- |
| function | Yes      |

---

### multiple

Enable multiple selection

| Type     | Required |
| -------- | -------- |
| boolean  | No       |

---

### renderButtonMultiple

function returns React component for the dropdown button when multiple true

| Type     | Required |
| -------- | -------- |
| function | No       |

---

### defaultValue

default selected item in dropdown ( check examples in Demo1)

| Type | Required |
| ---- | -------- |
| any  | No       |

---

### defaultValueByIndex

default selected item index

| Type    | Required |
| ------- | -------- |
| integer | No       |

---

### disabled

disable dropdown

| Type    | Required |
| ------- | -------- |
| boolean | No       |

---

### disabledIndexes

array of disabled items index

| Type  | Required |
| ----- | -------- |
| array | No       |

---

### disableAutoScroll

disable auto scroll to selected value

| Type    | Required |
| ------- | -------- |
| boolean | No       |

---

### testID

dropdown menu testID

| Type   | Required |
| ------ | -------- |
| string | No       |

---

### onFocus

function fires when dropdown is opened

| Type     | Required |
| -------- | -------- |
| function | No       |

---

### onBlur

function fires when dropdown is closed

| Type     | Required |
| -------- | -------- |
| function | No       |

---

### onScrollEndReached

function fires when dropdown scrolls to the end (for paginations)

| Type     | Required |
| -------- | -------- |
| function | No       |

---

### statusBarTranslucent

required to set true when statusbar is translucent `(android only)`

| Type    | Required |
| ------- | -------- |
| boolean | No       |

---

### dropdownStyle

style object for dropdown view

| Type   | Required |
| ------ | -------- |
| object | No       |

---

### dropdownOverlayColor

backdrop color when dropdown is opened

| Type   | Required |
| ------ | -------- |
| string | No       |

---

### showsVerticalScrollIndicator

When true, shows a vertical scroll indicator.

| Type    | Required |
| ------- | -------- |
| boolean | No       |

---

### search

enable search functionality

| Type    | Required |
| ------- | -------- |
| boolean | No       |

---

### searchInputStyle

style object for search input

| Type   | Required |
| ------ | -------- |
| object | No       |

---

### searchInputTxtColor

text color for search input

| Type   | Required |
| ------ | -------- |
| string | No       |

---

### searchInputTxtStyle

style object for search input text

| Type   | Required |
| ------ | -------- |
| object | No       |

---

### searchPlaceHolder

placeholder text for search input

| Type   | Required |
| ------ | -------- |
| string | No       |

---

### searchPlaceHolderColor

text color for search input placeholder

| Type   | Required |
| ------ | -------- |
| string | No       |

---

### renderSearchInputLeftIcon

function returns React component for search input icon

| Type     | Required |
| -------- | -------- |
| function | No       |

---

### renderSearchInputRightIcon

function returns React component for search input icon

| Type     | Required |
| -------- | -------- |
| function | No       |

---

### onChangeSearchInputText

function callback when the search input text changes, this will automatically disable the dropdown's internal search to be implemented manually outside the component

| Type     | Required |
| -------- | -------- |
| function | No       |

---

| Method               | Description                      |
| -------------------- | -------------------------------- |
| `reset()`            | Remove selection & reset it      |
| `openDropdown()`     | Open the dropdown.               |
| `closeDropdown()`    | Close the dropdown.              |
| `selectIndex(index)` | Select a specific item by index. |

---

## License

[MIT](https://choosealicense.com/licenses/mit/)
