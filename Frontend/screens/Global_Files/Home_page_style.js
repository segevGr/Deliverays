import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#C7F9CC",
  },
  title_text: {
    textAlign: "center",
    fontSize: height * 0.035,
    fontWeight: "bold",
    marginTop: height * 0.17,
    color: "#38A3A5",
  },
  btn: {
    backgroundColor: "#22577A",
    width: width * 0.65,
    height: height * 0.065,
    marginTop: height * 0.11,
    borderRadius: width * 0.06,
    justifyContent: "center",
    alignItems: "center",
  },
  btn_text: {
    color: "white",
    textAlign: "center",
    fontSize: width * 0.06,
  },
});

export default styles;
