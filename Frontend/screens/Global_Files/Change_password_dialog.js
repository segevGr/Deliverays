import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { IP, getLoginUserName, getLoginUserId } from "../../constFiles";

const { width, height } = Dimensions.get("window");

const Change_password_dialog = ({ visible, onClose }) => {
  const user_name = getLoginUserName();
  const user_id = getLoginUserId();
  const ip = IP();

  const [currentPass, setCurrentPass] = useState("");
  const [editCurrentPass, setCurrentPassOnPress] = useState(false);
  const editCurrentPassBtnPress = () => {
    setCurrentPassOnPress(true);
  };

  const [newPass, setNewPass] = useState("");
  const [editNewPass, setNewPassOnPress] = useState(false);
  const editNewPassBtnPress = () => {
    setNewPassOnPress(true);
  };

  const [acceptNewPass, setAcceptNewPass] = useState("");
  const [editAcceptNewPass, setAcceptNewPassOnPress] = useState(false);
  const editAcceptPassBtnPress = () => {
    setAcceptNewPassOnPress(true);
  };

  const check_current_pass = async () => {
    try {
      const response = await fetch(
        `http://${ip}:3000/user/${user_name}/${currentPass}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return data.users.length == 1;
    } catch (error) {
      console.log("Error fetching letters:", error);
    }
  };

  const change_password = async () => {
    const requestBody = JSON.stringify({
      password: newPass,
    });

    try {
      const response = await fetch(`http://${ip}:3000/user/${user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      return true;
    } catch (error) {
      console.log("Error fetching users:", error);
      return false;
    }
  };

  const handle_change_password = async () => {
    if (currentPass == "" || newPass == "" || acceptNewPass == "") {
      Alert.alert("שגיאה!", "אנא מלאו את כל השדות על מנת לשנות סיסמה", [
        { text: "הבנתי" },
      ]);
      return;
    } else if (!(await check_current_pass())) {
      Alert.alert(
        `שגיאה! הסיסמה הנוכחית שהזנת לא נכונה`,
        "אנא הזן סיסמה נוכחית תקינה",
        [{ text: "הבנתי" }]
      );
      return;
    } else if (newPass != acceptNewPass) {
      Alert.alert(
        `שגיאה! הסיסמאות החדשות לא מתאימות`,
        "אנא וודא שהסיסמה החדשה זהה לאימות הסיסמה שהזנת",
        [{ text: "הבנתי" }]
      );
      return;
    } else if (newPass == currentPass) {
      Alert.alert(`שגיאה!`, "הסיסמה החדשה לא יכולה להיות זהה לסיסמה הנוכחית", [
        { text: "הבנתי" },
      ]);
      return;
    } else {
      if (await change_password()) {
        Alert.alert(
          `הסיסמה עודכנה בהצלחה!`,
          "",
          [{ text: "תודה!", onPress: () => null }],
          { cancelable: false }
        );
        onClose();
      } else {
        Alert.alert(
          `אופס... משהו השתבש`,
          "אנא נסו שוב מאוחר יותר",
          [{ text: "הבנתי", onPress: () => null }],
          { cancelable: false }
        );
        return;
      }
    }
  };

  const exitEditMode = () => {
    if (editCurrentPass) {
      setCurrentPassOnPress(false);
      Keyboard.dismiss();
    } else if (editNewPass) {
      setNewPassOnPress(false);
      Keyboard.dismiss();
    } else if (editAcceptNewPass) {
      setAcceptNewPassOnPress(false);
      Keyboard.dismiss();
    }
  };

  useEffect(() => {
    if (visible) {
      setCurrentPass("");
      setNewPass("");
      setAcceptNewPass("");
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={exitEditMode}>
        <View style={styles.modalContainer}>
          <View style={styles.dialog}>
            <Text style={styles.title}>סיסמה נוכחית</Text>
            <TouchableOpacity
              style={styles.input_container}
              onPress={editCurrentPassBtnPress}
            >
              {editCurrentPass ? (
                <TextInput
                  style={styles.input}
                  value={currentPass}
                  onChangeText={setCurrentPass}
                  placeholderTextColor="white"
                  autoFocus={true}
                  onBlur={() => setCurrentPassOnPress(false)}
                  secureTextEntry={true}
                />
              ) : (
                <Text style={styles.input}>
                  {"•".repeat(currentPass.length)}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.title}>סיסמה חדשה</Text>
            <TouchableOpacity
              style={styles.input_container}
              onPress={editNewPassBtnPress}
            >
              {editNewPass ? (
                <TextInput
                  style={styles.input}
                  value={newPass}
                  onChangeText={setNewPass}
                  placeholderTextColor="white"
                  autoFocus={true}
                  onBlur={() => setNewPassOnPress(false)}
                  secureTextEntry={true}
                />
              ) : (
                <Text style={styles.input}>{"•".repeat(newPass.length)}</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.title}>אימות סיסמה</Text>
            <TouchableOpacity
              style={styles.input_container}
              onPress={editAcceptPassBtnPress}
            >
              {editAcceptNewPass ? (
                <TextInput
                  style={styles.input}
                  value={acceptNewPass}
                  onChangeText={setAcceptNewPass}
                  placeholderTextColor="white"
                  autoFocus={true}
                  onBlur={() => setAcceptNewPassOnPress(false)}
                  secureTextEntry={true}
                />
              ) : (
                <Text style={styles.input} secureTextEntry={true}>
                  {"•".repeat(acceptNewPass.length)}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.btns_container}>
              <TouchableOpacity style={styles.btns} onPress={onClose}>
                <Text style={styles.btns_text}>ביטול</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btns}
                onPress={handle_change_password}
              >
                <Text style={styles.btns_text}>שנה סיסמה</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    width: "85%",
    height: "45%",
    backgroundColor: "white",
    padding: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  option_container: {
    alignItems: "center",
    margin: width * 0.035,
  },
  title: {
    fontSize: width * 0.045,
    marginTop: width * 0.02,
  },
  btns_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: width * 0.04,
  },
  btns: {
    width: width * 0.3,
    alignItems: "center",
    marginTop: width * 0.05,
  },
  btns_text: {
    color: "#38A3A5",
    fontWeight: "bold",
    fontSize: width * 0.055,
  },
  input_container: {
    width: width * 0.5,
    height: height * 0.06,
    backgroundColor: "#38A3A5",
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.02,
    borderRadius: width * 0.06,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    textAlign: "center",
    color: "white",
    width: "100%",
  },
});

export default Change_password_dialog;
