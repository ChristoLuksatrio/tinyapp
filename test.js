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

// Finds userID by email
const getUserByEmail = (email, database) => {
  let user = {};
  for (const id in database) {
    // console.log(id);
    if (database[id].email === email) {
      user = database[id];
    }
  }
  return user;
}

console.log(getUserByEmail('test@test.com', users));