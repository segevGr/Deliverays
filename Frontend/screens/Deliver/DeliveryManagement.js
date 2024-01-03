import React, { useState } from "react";
import { View, ScrollView, Alert, SafeAreaView } from "react-native";
import { getLoginUserId } from "../../constFiles";
import { useFocusEffect } from "@react-navigation/native";
import Delivery_filter_dialog from "./Dialogs/Delivery_filter_dialog";
import {
  getAllDeliveries,
  deleteDelivery,
} from "../../database/deliveriesQueries";
import MainContainerStyle from "../../comps/MainContainerStyle";
import {
  PageHeader,
  ItemInList,
  PageFooter,
} from "../../comps/ManagementPageComp";

const DeliveryManagement = ({ navigation }) => {
  const deliver_id = getLoginUserId();

  const [filterDialogVisible, setFilterDialogVisible] = useState(false);
  const [clientNameList, setClientNameList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  const showFilterDialog = () => {
    setFilterDialogVisible(true);
  };

  const closeFilterDialog = () => {
    setFilterDialogVisible(false);
  };

  const delete_alert = (key, deliveryAddress) => {
    Alert.alert(
      `האם אתה בטוח שאתה רוצה למחוק את ${deliveryAddress} מרשימת המשלוחים?`,
      "",
      [
        { text: "לא", onPress: () => null },
        { text: "כן", onPress: () => delete_delivery(key) },
      ],
      { cancelable: false }
    );
  };

  const delete_delivery = async (key) => {
    const deleteResult = await deleteDelivery(key);
    if (deleteResult !== true) {
      console.log("Error fetching letters:", deleteResult);
      Alert.alert(
        `אופס... משהו השתבש`,
        "אנא נסו שוב מאוחר יותר",
        [{ text: "הבנתי", onPress: () => null }],
        { cancelable: false }
      );
      return;
    }
    const updatedDelivery_list = delivery_list.filter(
      (delivery) => delivery.key !== key
    );
    setDelivery_list(updatedDelivery_list);
  };

  const add_delivery = () => {
    navigation.navigate("Add_delivery", { deliver_id: deliver_id });
  };

  const edit_delivery = (key) => {
    navigation.navigate("Delivery_edit", { letterNumber: key });
  };

  const backToPreviousPage = () => {
    navigation.goBack();
  };

  const getLettersFromDB = async () => {
    try {
      const deliveriesList = await getAllDeliveries(deliver_id);
      const result = deliveriesList.map((result) => ({
        key: result.letterNumber,
        deliveryAddress: result.deliveryStreet + ", " + result.deliveryCity,
        deliveryCity: result.deliveryCity,
        isDelivered: result.isDelivered,
        clientName: result.clientName,
      }));
      setOriginal_delivery_list(result);
      setDelivery_list(result);
      create_clientNameList(result);
      create_CitiesList(result);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const create_CitiesList = (result) => {
    let cities_set = new Set();
    result.forEach((item) => {
      cities_set.add(item.deliveryCity);
    });
    setCitiesList(Array.from(cities_set));
  };

  const create_clientNameList = (result) => {
    let clientNames_set = new Set();
    result.forEach((item) => {
      clientNames_set.add(item.clientName);
    });
    setClientNameList(Array.from(clientNames_set));
  };

  const [delivery_list, setDelivery_list] = useState([]);

  const [original_delivery_list, setOriginal_delivery_list] = useState([]);

  const filterData = (filter_array) => {
    let filtered_delivery_list = original_delivery_list;
    if (filter_array["status"] != null) {
      filtered_delivery_list = filtered_delivery_list.filter(
        (delivery) => delivery.isDelivered === filter_array["status"]
      );
    }
    if (filter_array["client"] != null) {
      filtered_delivery_list = filtered_delivery_list.filter(
        (delivery) => delivery.clientName === filter_array["client"]
      );
    }
    if (filter_array["city"] != null) {
      filtered_delivery_list = filtered_delivery_list.filter(
        (delivery) => delivery.deliveryCity === filter_array["city"]
      );
    }
    setDelivery_list(filtered_delivery_list);
  };

  useFocusEffect(
    React.useCallback(() => {
      getLettersFromDB();
    }, [])
  );

  return (
    <SafeAreaView
      style={{ ...MainContainerStyle.container, alignItems: "center" }}
    >
      <Delivery_filter_dialog
        visible={filterDialogVisible}
        onClose={closeFilterDialog}
        onSave={filterData}
        clientNameList={clientNameList}
        citiesList={citiesList}
      />
      <PageHeader
        onPress={backToPreviousPage}
        headerText={`יש לך ${delivery_list.length} משלוחים ברשימה`}
      />
      <ScrollView>
        {delivery_list.map((letter) => {
          let deliveryColor = letter.isDelivered == 0 ? "#22577A" : "green";
          return (
            <View key={letter.id}>
              <ItemInList
                deleteOnClick={() =>
                  delete_alert(letter.key, letter.deliveryAddress)
                }
                infoOnClick={() => edit_delivery(letter.key)}
                itemText={letter.deliveryAddress}
                backgroundColor={deliveryColor}
              />
            </View>
          );
        })}
      </ScrollView>
      <PageFooter
        addOnPress={() => add_delivery()}
        addText={"הוספת משלוח"}
        filterOnPress={() => showFilterDialog()}
        FilterText={"סינון תוצאות"}
      />
    </SafeAreaView>
  );
};

export default DeliveryManagement;
