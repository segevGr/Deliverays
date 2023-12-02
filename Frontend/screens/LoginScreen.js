import React, { useState } from "react";
import { setLoginUserId, setLoginUserName } from "../constFiles";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { checkUserLogin } from "../database/usersQueries";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (username == "" || password == "") {
      Alert.alert(
        "שם משתמש או סיסמה חסרים",
        "אנא מלאו את כל השדות לפני ניסיון ההתחברות",
        [{ text: "OK" }]
      );
      return;
    }
    Keyboard.dismiss();
    const user_results = await is_deliver_exists(username, password);
    if (user_results == "deliver") {
      Alert.alert(`ברוך הבא ${username}!`, "מיד תועבר לעמוד האישי שלך", [
        { text: "OK" },
      ]);
      navigation.navigate("Home_page_deliver");
    } else if (user_results == "manager") {
      Alert.alert(`ברוך הבא ${username}!`, "מיד תועבר לעמוד האישי שלך", [
        { text: "OK" },
      ]);
      navigation.navigate("Home_page_manager", { username: username });
    } else {
      Alert.alert(
        "שם משתמש או סיסמה לא נכונים",
        "אנא וודאו שהזנתם פרטים נכונים",
        [{ text: "OK" }]
      );
    }
  };

  const is_deliver_exists = async (username, password) => {
    try {
      userType = await checkUserLogin(username, password);

      if (userType === "Doesn't exists") {
        return false;
      }

      setLoginUserId(userType.id);
      setLoginUserName(username);

      if (userType.isAdmin == 0) {
        return "deliver";
      } else {
        return "manager";
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="שם משתמש"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="סיסמה"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.login_btn} onPress={handleLogin}>
          <Text style={styles.login_text}>התחברות</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#C7F9CC",
  },
  input: {
    width: width * 0.6,
    height: height * 0.06,
    backgroundColor: "white",
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.02,
    textAlign: "center",
    borderRadius: width * 0.06,
  },
  login_btn: {
    backgroundColor: "#38A3A5",
    width: width * 0.28,
    height: height * 0.05,
    padding: width * 0.02,
    borderRadius: width * 0.06,
    marginTop: height * 0.015,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  login_text: {
    color: "white",
    textAlign: "center",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
});

export default LoginScreen;
