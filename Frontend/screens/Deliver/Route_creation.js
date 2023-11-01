import React, { useState } from "react";
import { IP, getLoginUserId, getLoginUserName } from "../../constFiles";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Route_creation = ({ navigation }) => {
  const deliver_id = getLoginUserId();
  const deliver_name = getLoginUserName();
  const ip = IP();

  const [isLoading, setIsLoading] = useState(false);
  const back_to_previous_page = () => {
    navigation.goBack();
  };

  const [editWorkDuration, setWorkDurationOnPress] = useState(false);
  const [workDuration, setWorkDuration] = useState();

  const editWorkDurationBtnPress = () => {
    setWorkDurationOnPress(true);
  };

  const workDurationChangeFunction = (newWorkDuration) => {
    setWorkDuration(newWorkDuration);
  };

  const [editStreet, setStreetOnPress] = useState(false);
  const [street, setStreet] = useState();

  const editStreetBtnPress = () => {
    setStreetOnPress(true);
  };

  const streetChangeFunction = (newStartAddress) => {
    setStreet(newStartAddress);
  };

  const [editCity, setCityOnPress] = useState(false);
  const [city, setCity] = useState();

  const editCityBtnPress = () => {
    setCityOnPress(true);
  };

  const cityChangeFunction = (newStartAddress) => {
    setCity(newStartAddress);
  };

  const exitEditMode = () => {
    if (editWorkDuration) {
      setWorkDurationOnPress(false);
      Keyboard.dismiss();
    } else if (editStreet) {
      setStreetOnPress(false);
      Keyboard.dismiss();
    } else if (editCity) {
      setCityOnPress(false);
      Keyboard.dismiss();
    }
  };

  const create_route_btn_press = () => {
    Alert.alert(
      `האם אתה בטוח שאתה רוצה ליצור את המסלול?`,
      "",
      [
        { text: "לא", onPress: () => null },
        { text: "כן", onPress: () => open_create_route_screen() },
      ],
      { cancelable: false }
    );
  };

  const validAddress = async () => {
    let address = street + ", " + city;
    const response = await fetch(
      `http://${ip}:3000/letterValidation/${address}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data["Valid address"];
  };

  const isHaveOpenDeliveries = async () => {
    const response = await fetch(
      `http://${ip}:3000/letter/open/${deliver_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data["DeliverOpenLettersCount"] != 0;
  };

  const open_create_route_screen = async () => {
    try {
      if (!(await isHaveOpenDeliveries())) {
        Alert.alert(
          `שגיאה! אין לך משלוחים פתוחים`,
          `אנא הכנס משלוחים למערכת`,
          [{ text: "הבנתי", onPress: () => null }],
          { cancelable: false }
        );
        return;
      }
      const correct_address = await validAddress();
      if (!correct_address) {
        Alert.alert(
          `שגיאה! כתובת ההתחלה אינה קיימת`,
          `אנא מלא כתובת התחלה תקינה`,
          [{ text: "הבנתי", onPress: () => null }],
          { cancelable: false }
        );
        return;
      }
      setIsLoading(true);
      const response = await fetch(
        `http://${ip}:3000/route/${deliver_id}/${workDuration}/${correct_address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.text();
      const parsedData = JSON.parse(data);
      const deliveryArray = Object.values(parsedData);
      const routeLen = deliveryArray.pop()["RouteLength"];
      setIsLoading(false);

      Alert.alert(
        `המסלול נוצר!`,
        `זמן מסלול מוערך: ${routeLen} דקות`,
        [{ text: "קדימה למסלול!", onPress: () => null }],
        { cancelable: false }
      );

      navigation.navigate("Route", { routeList: deliveryArray });
    } catch (error) {
      setIsLoading(false);
      console.log("Error fetching users:", error);
      Alert.alert(
        `אופס... משהו השתבש`,
        "אנא נסו שוב מאוחר יותר",
        [{ text: "הבנתי", onPress: () => null }],
        { cancelable: false }
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={exitEditMode}>
      <View style={styles.container}>
        <View style={styles.title_style}>
          <TouchableOpacity onPress={back_to_previous_page}>
            <Image
              source={require("../../assets/back_icon.png")}
              style={styles.back_icon}
            />
          </TouchableOpacity>
          <Text style={styles.title_text}>אנא הכנס אילוצים</Text>
        </View>
        <View>
          <Text style={styles.attribute_text}>שעות עבודה</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={editWorkDurationBtnPress}
          >
            {editWorkDuration ? (
              <TextInput
                style={styles.attribute_input_text}
                onChangeText={workDurationChangeFunction}
                value={workDuration}
                autoFocus={true}
                keyboardType="numeric"
                onBlur={() => setWorkDurationOnPress(false)}
              />
            ) : (
              <Text style={styles.attribute_input_text}>{workDuration}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.attribute_text}>נקודת התחלה</Text>
          <Text style={styles.attribute_text}>שם ומספר רחוב</Text>
          <TouchableOpacity style={styles.btn} onPress={editStreetBtnPress}>
            {editStreet ? (
              <TextInput
                style={styles.attribute_input_text}
                onChangeText={streetChangeFunction}
                value={street}
                autoFocus={true}
                onBlur={() => setStreetOnPress(false)}
              />
            ) : (
              <Text style={styles.attribute_input_text}>{street}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.attribute_text}>עיר</Text>
          <TouchableOpacity style={styles.btn} onPress={editCityBtnPress}>
            {editCity ? (
              <TextInput
                style={styles.attribute_input_text}
                onChangeText={cityChangeFunction}
                value={city}
                autoFocus={true}
                onBlur={() => setCityOnPress(false)}
              />
            ) : (
              <Text style={styles.attribute_input_text}>{city}</Text>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.save_btn}
          onPress={create_route_btn_press}
        >
          <Text style={styles.btn_text}>צור מסלול</Text>
        </TouchableOpacity>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#C7F9CC",
  },
  title_text: {
    textAlign: "center",
    fontSize: height * 0.06,
    color: "#38A3A5",
  },
  btn: {
    backgroundColor: "white",
    width: width * 0.65,
    height: height * 0.065,
    borderRadius: width * 0.06,
    justifyContent: "center",
    alignItems: "center",
  },
  attribute_input_text: {
    color: "black",
    textAlign: "center",
    fontSize: width * 0.06,
  },
  back_icon: {
    width: width * 0.1,
    height: width * 0.1,
    marginLeft: width * 0.08,
  },
  title_style: {
    display: "flex",
    marginTop: height * 0.05,
    width: width,
  },
  attribute_text: {
    textAlign: "center",
    fontSize: width * 0.06,
    marginTop: width * 0.08,
  },
  save_btn: {
    backgroundColor: "#4FC132",
    width: width * 0.32,
    height: height * 0.065,
    borderRadius: width * 0.06,
    marginTop: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  btn_text: {
    color: "white",
    textAlign: "center",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  loadingContainer: {
    marginTop: width * 0.08,
    alignItems: "center",
  },
});

export default Route_creation;
