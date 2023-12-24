import { View, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

const Option = ({ btnStyle, onPress, testStyle, text }) => {
  return (
    <TouchableOpacity style={btnStyle} onPress={onPress}>
      <Text style={testStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

const Title = ({ userName, titleStyle }) => {
  return (
    <Text style={titleStyle}>
      שלום {userName},{"\n"}מה תרצה לעשות היום?
    </Text>
  );
};

Option.prototype = {
  btnStyle: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  testStyle: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
};

Title.prototype = {
  userName: PropTypes.string.isRequired,
  titleStyle: PropTypes.object.isRequired,
};

export { Option, Title };
