import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore/lite";
import firebase from "./firebaseInit";

const getAllDeliveries = async (userID) => {
  const deliveriesCollection = collection(firebase, "Deliveries");
  const deliveriesQuery = query(
    deliveriesCollection,
    where("userID", "==", userID)
  );

  const querySnapshot = await getDocs(deliveriesQuery);
  const deliveriesList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return deliveriesList;
};

const deleteDelivery = async (letterNumber) => {
  const documentRef = doc(firebase, "Deliveries", letterNumber);
  try {
    await deleteDoc(documentRef);
    return true;
  } catch (error) {
    return error;
  }
};

const updateDelivery = async (letterDetails, letterNumber) => {
  const documentRef = doc(firebase, "Deliveries", letterNumber);
  try {
    await updateDoc(documentRef, letterDetails);
    return true;
  } catch (error) {
    return error;
  }
};

const getDeliveryByID = async (letterNumber) => {
  const deliveriesCollection = collection(firebase, "Deliveries");
  const deliveryQuery = query(
    deliveriesCollection,
    where("letterNumber", "==", letterNumber)
  );

  const querySnapshot = await getDocs(deliveryQuery);
  const delivery = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (delivery.length == 0){
    return 'notExists';
  }

  const delivery_details = {
    deliveryStreet: delivery[0].deliveryStreet,
    deliveryCity: delivery[0].deliveryCity,
    addressee: delivery[0].addressee,
    addresseePhoneNumber: delivery[0].addresseePhoneNumber,
    clientName: delivery[0].clientName,
    deliveryDeadline: delivery[0].deliveryDeadline.replaceAll("-", "."),
    isDelivered: delivery[0].isDelivered,
    userID: delivery[0].userID,
  };

  return delivery_details;
};

const addDelivery = async (letterDetails, letterNumber) => {
  const customDocumentRef = doc(firebase, "Deliveries", letterNumber);
  try {
    await setDoc(customDocumentRef, letterDetails);
    return true;
  } catch (error) {
    return error;
  }
};

const isDeliveryAlreadyExists = async (letterNumber) => {
  const deliveriesCollection = collection(firebase, "Deliveries");
  const deliveriesQuery = query(
    deliveriesCollection,
    where("letterNumber", "==", letterNumber)
  );

  const querySnapshot = await getDocs(deliveriesQuery);
  const deliveriesList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return deliveriesList.length > 0;
};

export {
  getAllDeliveries,
  deleteDelivery,
  updateDelivery,
  getDeliveryByID,
  addDelivery,
  isDeliveryAlreadyExists
};