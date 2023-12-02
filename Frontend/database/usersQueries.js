import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore/lite";
import firebase from "./firebaseInit";

const getAllUsers = async () => {
  const usersCollection = collection(firebase, "Users");
  const usersSnapshot = await getDocs(usersCollection);
  const usersList = usersSnapshot.docs.map((doc) => doc.data());
  return usersList;
};

const checkUserLogin = async (username, password) => {
  const usersCollection = collection(firebase, "Users");

  const userQuery = query(
    usersCollection,
    where("fullName", "==", username),
    where("password", "==", password)
  );

  const querySnapshot = await getDocs(userQuery);

  const user = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (user.length == 0) {
    return "Doesn't exists";
  }

  user_details = { id: user[0].id, isAdmin: user[0].isAdmin };
  return user_details;
};

const getUserByID = async (userID) => {
  const usersCollection = collection(firebase, "Users");

  const userQuery = query(usersCollection, where("ID", "==", userID));

  const querySnapshot = await getDocs(userQuery);

  const user = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  userDetails = {
    fullName: user[0].fullName,
    address: user[0].address,
    phoneNumber: user[0].phoneNumber,
  };
  return userDetails;
};

const changePassword = async (userID, newPassword) => {
  const documentRef = doc(firebase, "Users", userID);
  try {
    await updateDoc(documentRef, { password: newPassword });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteUser = async (userID) => {
  const documentRef = doc(firebase, "Users", userID);
  try {
    await deleteDoc(documentRef);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const isUserNameAlreadyExists = async (Username) => {
  const usersCollection = collection(firebase, "Users");

  const userQuery = query(usersCollection, where("fullName", "==", Username));

  const querySnapshot = await getDocs(userQuery);

  const user = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return user.length === 1;
};

const isIdAlreadyExists = async (userID) => {
  const usersCollection = collection(firebase, "Users");

  const userQuery = query(usersCollection, where("ID", "==", userID));

  const querySnapshot = await getDocs(userQuery);

  const user = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return user.length === 1;
};

const updateUserDetails = async (userID, userDetails) => {
  const documentRef = doc(firebase, "Users", userID);
  try {
    await updateDoc(documentRef, userDetails);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const addUser = async (userDetails, userID) => {
  const customDocumentRef = doc(firebase, "Users", userID);
  try {
    await setDoc(customDocumentRef, userDetails);
    return true;
  } catch (error) {
    return error;
  }
};

export {
  getAllUsers,
  checkUserLogin,
  changePassword,
  deleteUser,
  getUserByID,
  isUserNameAlreadyExists,
  updateUserDetails,
  isIdAlreadyExists,
  addUser,
};
