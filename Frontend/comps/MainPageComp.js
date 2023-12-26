import { Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";

const Option = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.btnText}>{text}</Text>
    </TouchableOpacity>
  );
};

const Title = ({ userName }) => {
  return (
    <Text style={styles.titleText}>
      שלום {userName},{"\n"}מה תרצה לעשות היום?
    </Text>
  );
};

Option.prototype = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

Title.prototype = {
  userName: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  titleText: {
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 120,
    color: "#38A3A5",
  },
  btn: {
    backgroundColor: "#22577A",
    width: 270,
    height: 65,
    marginTop: 85,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 30,
  },
});

export { Option, Title };
