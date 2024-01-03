import React, { useState } from "react";
import { View, ScrollView, Alert, SafeAreaView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getAllUsers, deleteUser } from "../../database/usersQueries";
import MainContainerStyle from "../../comps/MainContainerStyle";
import {
  PageHeader,
  ItemInList,
  PageFooter,
} from "../../comps/ManagementPageComp";

const DeliversManagement = ({ navigation }) => {
  const delete_alert = (deliver_id, deliver_name) => {
    Alert.alert(
      `האם אתה בטוח שאתה רוצה למחוק את ${deliver_name} מרשימת השליחים?`,
      "",
      [
        { text: "לא", onPress: () => null },
        { text: "כן", onPress: () => delete_deliver(deliver_id) },
      ],
      { cancelable: false }
    );
  };

  const delete_deliver = async (deliver_id) => {
    if (!(await deleteUser(deliver_id))) {
      Alert.alert(
        `אופס... משהו השתבש`,
        "אנא נסו שוב מאוחר יותר",
        [{ text: "הבנתי", onPress: () => null }],
        { cancelable: false }
      );
    }
    const updatedDelivers_list = delivers_list.filter(
      (deliver) => deliver.id !== deliver_id
    );
    setDelivers_list(updatedDelivers_list);
  };

  const info_screen = (deliver_id, deliver_name) => {
    navigation.navigate("Deliver_edit", {
      deliver_id: deliver_id,
      deliver_name: deliver_name,
    });
  };

  const add_deliver = () => {
    navigation.navigate("Add_deliver");
  };

  const backToPreviousPage = () => {
    navigation.goBack();
  };

  const getUsersFromDB = async () => {
    try {
      const usersList = await getAllUsers();
      const result = usersList.map((result) => ({
        ID: result.ID,
        address: result.address,
        fullName: result.fullName,
        isActiveUser: result.isActiveUser,
        isAdmin: result.isAdmin,
        password: result.password,
        phoneNumber: result.phoneNumber,
      }));

      const users = result
        .map((user) => ({
          id: user.ID,
          fullName: user.fullName,
          isAdmin: user.isAdmin,
        }))
        .filter((user) => user.isAdmin === "0");
      setDelivers_list(users);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const [delivers_list, setDelivers_list] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getUsersFromDB();
    }, [])
  );

  return (
    <SafeAreaView
      style={{ ...MainContainerStyle.container, alignItems: "center" }}
    >
      <PageHeader onPress={backToPreviousPage} headerText="רשימת השליחים" />
      <ScrollView>
        {delivers_list.map((deliver) => {
          return (
            <View key={deliver.id}>
              <ItemInList
                deleteOnClick={() => delete_alert(deliver.id, deliver.fullName)}
                infoOnClick={() => info_screen(deliver.id, deliver.fullName)}
                itemText={deliver.fullName}
                backgroundColor={"#22577A"}
              />
            </View>
          );
        })}
      </ScrollView>
      <PageFooter
        addOnPress={() => add_deliver()}
        addText={"הוספת שליח"}
        filterOnPress={null}
        FilterText={"סינון תוצאות"}
      />
    </SafeAreaView>
  );
};

export default DeliversManagement;
