const knex = require("./knex");

function createUser(User){
  return knex("User").insert(User);
};

function getAllUsers(){
  return knex("User").select("*");
};

function getUsername(username){
  return knex("User").select("*").where("fullName", username);
};

function getUser(id){
  return knex("User").select("*").where("ID", id);
};

function deleteUser(id){
  return knex("User").where("ID", id).del().returning("ID");
};

function updateUser(id, User){
  return knex("User").where("ID", id).update(User);
};

function isUserExists(username, password) {
  return knex("User").where("fullName", username).where("password", password);
};

module.exports = {createUser, getAllUsers, deleteUser, updateUser, getUser, isUserExists, getUsername};