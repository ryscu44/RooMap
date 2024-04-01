import RNPickerSelect from "react-native-picker-select";

export default Dropdown = ({ items, onValueChange, style }) => {
  return (
    <RNPickerSelect onValueChange={onValueChange} items={items} style={style} />
  );
};
