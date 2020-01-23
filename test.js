const bcrypt = require('bcrypt');

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  'sdsdsd': {
    id: "sdsdsd", 
    email: "test@test.com", 
    password: "$2b$10$Xj9dsxCXh.tFTieVu/4uCO8weA/IImh2aHXI2DT3GGGe8A2VJAeIe"
  }
}

//bcrypt.compareSync(passwordData, users[user].password)

const validUser = (passwordData) => {
  let value = false;
  for (const user of Object.keys(users)) {
    console.log(bcrypt.compareSync(passwordData, users[user].password))
    // if (users[user].email === emailData && users[user].password === passwordData) {
    // if (bcrypt.compareSync(passwordData, users[user].password)) {

    //   value = true;
    // } 
  }
  return value;
}

validUser('2');

// const validUser = (emailData, passwordData) => {
//   let value = false;
//   for (const user of Object.keys(users)) {
//     if (users[user].email === emailData && users[user].password === passwordData) {
//       value = true;
//     } 
//   }
//   return value;
// }