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
  }
}

const createCookie = (emailData) => {
  let cookie = '';
  for (const user of Object.keys(users)) {
    if (users[user].email === emailData) {
      cookie = user;
    } 
  }
  return cookie;
}

const validUser = (emailData, passwordData) => {
  let value = false;
  for (const user of Object.keys(users)) {
    if (users[user].email === emailData && users[user].password === passwordData) {
      value = true;
    } 
  }
  return value;
}

const findID = (emailData) => {
  let ID = '';
  for (const user of Object.keys(users)) {
    if (users[user].email === emailData) {
      ID = user;
    } 
  }
  return ID;
}

console.log(findID('user2@example.com'))

// console.log(validUser("user2@example.com", 'dishwasher-funk'));

// console.log(createCookie('user2@example.com'))