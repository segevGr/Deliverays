const express = require ('express'); // library to handle API routing
const app = express(); // libary to build REST API
app.use(express.json());
const { EMPTY } = require('sqlite3');

const port = process.env.PORT || 3000; // ! when changing environment variables in PowerShell, use: $env:_varName_="_"
app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}...`));


/** ---------------------------------------------------------------------
 * Route API request
 * create route from list of undelivered letters
 */ 
const {spawn} = require('child_process');
app.get('/route/:ID/:workingTime/:startingAddress', async (req, res) => { 
  const undeliveredLetters = await db_letters.getAllPendingLetters(req.params.ID)
  var addressList = req.params.startingAddress // adding starting position
  for (let index = 0; index < undeliveredLetters.length; index++) { // loop to add all addressed for the undelivered letters json
    addressList += "|" + undeliveredLetters[index].deliveryAddress;
  }

  let returningData = '';
  const python = spawn('python', ['route_creation_script .py', req.params.workingTime, addressList]); //JSON.stringify(undeliveredLetters)

  python.stdout.on('data', function (data) { // output stream FROM the python script
    returningData += data.toString();
    if (returningData.split("'")[1] == "http_status"){
      text = ' '+returningData.replaceAll("'",'"') +' ';
      res.json(JSON.parse(text));
    }else{
      var addressOrder = [];
      var unreachable = [];
      var list = returningData.split("~")
      unreachable = unreachable.concat(list[1].split("^")); // list of unreachable stations. currently disabled
      addressOrder = addressOrder.concat(list[0].split("|"));
      const addressOrderJson = {};
      for (let index = 1; index < addressOrder.length; index++) { // starting from index 1 becuase 0 will always be empty
        var letter = undeliveredLetters.find(obj => obj.deliveryAddress == addressOrder[index]);
        if (index == 1) { // if first letter is undefined (starting point), skip it
          continue;
        }
        if (!isNaN(addressOrder[index])){
          addressOrderJson[index-1] = {"RouteLength": parseInt(addressOrder[index])};
        }else {
          addressOrderJson[index-1] = {"letterNumber": letter.letterNumber,
                                    "deliveryAddress": addressOrder[index]};
        }
      }
      //addressOrderJson["Unreachable"] = unreachable; // add unreachable stations to JSON. un-comment if need to be added
      res.json(addressOrderJson);
    }
  });

  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.send('An error has occurred. please check console for details');
  });

  python.on('exit', (code) => {
    if (code != 0) {
      console.error(`Error in Python script: ${code}`);
    }else {
      //console.log('No major errors in python script');
    }
  });

  python.on('close', (code) => {
    //console.log(`child process close all stdio with code ${code}`); // the data that comes back to Node.js
  });
})


/** ---------------------------------------------------------------------
 * user API requests
 * select, create, update, delete
 * login, signup
 * get all letters
 * get urgent letters
 */ 
const db_users = require("./users");
// @ User API endpoints
// # GET - get request (select)
app.get('/user', async (req, res) => { // get a list of all users
    const users = await db_users.getAllUsers();
    res.status(200).json({users});
})

app.get('/user/:id', async (req, res) => {
  const user = await db_users.getUser(req.params.id);
  res.status(200).json({user});
})

app.get('/username/:username', async (req, res) => {
  const user = await db_users.getUsername(req.params.username);
  res.status(200).json({user});
})

app.get('/user/:username/:password', async (req, res) => { // get a user if exists by username&password
  const { username, password } = req.params;
  const users = await db_users.isUserExists(username, password);
  res.status(200).json({ users });
})

// # POST - create request (create)
app.post('/user', async (req, res) => {  // needs to add check if is admin. create Messenger/Secretary accordingly
  const results = await db_users.createUser(req.body);
  res.status(201).json({id: results[0]});
})

// # PUT - update requests
app.put('/user/:id', async (req, res) => { 
    const cnt = await db_users.updateUser(req.params.id, req.body);
    res.status(200).json({'updated rows': cnt});
})

// # DELETE - remove request
app.delete('/user/:id', async (req, res) => { 
    const cnt = await db_users.deleteUser(req.params.id); // cnt = updated rows count
    res.status(200).json({"deleted user ID": req.params.id, "updated rows": cnt});
})


/** ---------------------------------------------------------------------
 * Letters CRUD
 */
const db_letters = require("./letters");
// @ Letter API endpoints
// # GET - get request (select)
app.get('/letter/open/:ID', async (req, res) => { // get number of all undelivered letters of this ID
    const letters = await db_letters.getAllPendingLetters(req.params.ID);
    var result = letters.length;
    res.status(200).json({'DeliverOpenLettersCount': result});
})

app.get('/letter/late/:ID', async (req, res) => { // get a list of all undelivered letters of this ID (that belongs to messenger)
    const letters = await db_letters.getAllPendingLetters(req.params.ID);
    var result = dateFormat(letters);
    res.status(200).json({result});
})

app.get('/letter/all/:ID', async (req, res) => { // get ALL letter of this messenger
  const letters = await db_letters.getLetters(req.params.ID);
  var result = dateFormat(letters)
  res.status(200).json({result});
})

app.get('/letter', async (req, res) => { // get all letters
  const letter = await db_letters.getAllLetters();
  var result = dateFormat(letter);
  res.status(200).json({result});
})

app.get('/letter/global/open', async (req, res) => { // get all pending letters in system
  const letters = await db_letters.getGlobalPendingLetters();
  var result = dateFormat(letters);
  res.status(200).json({result});
})

app.get('/letter/:letterID', async (req, res) => { // get specific letter
  const letter = await db_letters.getLetter(req.params.letterID);
  var result = dateFormat(letter);
  res.status(200).json({result});
})

app.get('/letterValidation/:address', async (req, res) => { // check validity of address
  var address = req.params.address;
  let returningData = '';
  const python = spawn('python', ['addressValidation.py', address]); //JSON.stringify(undeliveredLetters)

  python.stdout.on('data', function (data) { // output stream FROM the python script
    returningData += data.toString();
    if(!isNaN(returningData)){
      var result = Boolean(Number(returningData));
    }else{
      result = returningData;
    }
    res.json({"Valid address": result})
  });

  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.send('An error has occurred. please check console for details');
  });

  python.on('exit', (code) => {
    if (code != 0) {
      console.error(`Error in Python script: ${code}`);
    }else {
      //console.log('No major errors in python script');
    }
  });

  python.on('close', (code) => {
    //console.log(`child process close all stdio with code ${code}`); // the data that comes back to Node.js
  });
})

// helping method to format timestamp into readable date DD-MM-YYYY
function dateFormat(json){
  json.forEach(letterObject => {
    var timeStamp = letterObject["deliveryDeadline"]
    var dateFormat= new Date(timeStamp*1)
    var month = dateFormat.getMonth()+1
    var day = dateFormat.getDate()
    if (month < 10) {
      month = "0" + month.toString()
    } if (day < 10) {
      day = "0" + day.toString()
    }
    letterObject["deliveryDeadline"] = day+"-"+(month)+"-"+dateFormat.getFullYear()
  });
  return json;
}

// # POST - create request (create)
app.post('/letter', async (req, res) => {
  const letter = req.body;
  
  const [day, month, year] = letter.deliveryDeadline.split('-');
  const timestamp = new Date(`${year}-${month}-${day}`);

  letter.deliveryDeadline = timestamp.getTime();
  const results = await db_letters.createLetter(letter); // date format: DD-MM-YYYY
  if(results == null || Object.keys(results).length === 0){
    res.status(400).json({'Error': 'Letter ID already exists'});
  }else{
    res.status(201).json({id: results[0]});
  }
})

// # PUT - update requests
app.put('/letter/:letterNumber', async (req, res) => { // update one letter, based on the 'letterNumber' in the URL
  const letter = req.body;
  if(letter.hasOwnProperty('deliveryDeadline')) {
    const [day, month, year] = letter.deliveryDeadline.split('-');
    const timestamp = new Date(`${year}-${month}-${day}`);
    letter.deliveryDeadline = timestamp.getTime();
  }
  const cnt = await db_letters.updateLetter(req.params.letterNumber, letter);
  res.status(200).json({'updated rows': cnt});
})

app.put('/letterUpdate', async (req, res) => { // iterates over all letters, and update the 'isLate' attribute if delivery date has passed
  const undelivered = await db_letters.updateUndeliveredLetters();
  res.status(200).json({'late letters count': undelivered});
})

// # DELETE - remove request
app.delete('/letter/:letterNumber', async (req, res) => { 
  const cnt = await db_letters.deleteLetter(req.params.letterNumber); // cnt = updated rows count
  res.status(200).json({"deleting letter ID": req.params.letterNumber, "updated rows": cnt});
})

