const knex = require("./knex");

// creating function for CRUD operations

function createLetter(letter){
    return knex("Letter").insert(letter)
};

function getAllPendingLetters(userID){ // all messenger undelivered letter
    return knex("Letter").select("*").where({
        "userID": userID,
        "isDelivered": 0
    });
};

function getLetters(userID){ // all messenger letter
    return knex("Letter").select("*").where("userID", userID);
};

function getAllLetters(){ // all letter
    return knex("Letter").select("*");
};

function getGlobalPendingLetters(){
    return knex("Letter").select("*").where("isDelivered", 0);
}

function getLetter(id){
    return knex("Letter").select("*").where("letterNumber", id);
};

function updateLetter(id, letter){
    return knex("Letter").where("letterNumber", id).update(letter);
};

function deleteLetter(id){
    return knex("Letter").where("letterNumber", id).del();
};

module.exports = {createLetter, getAllPendingLetters, getLetters, getAllLetters, getGlobalPendingLetters, getLetter, deleteLetter, updateLetter};