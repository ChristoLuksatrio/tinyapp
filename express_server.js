const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
// const { getUserByEmail } = require('helpers');
const app = express();
const PORT = 8080;


app.use(cookieSession({
  name: 'session',
  secret: "Test",

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "sdsdsd" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "sdsdsd" }
};

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
    password: "test"
  }
};



const generateRandomString = () => {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var result = '';
	for (let i = 0; i < 6; i++) {
		var num = Math.floor(Math.random() * chars.length);
		result += chars.substring(num,num+1);
  }
  return result;
}

// Returns true if email exists in database
const existingEmail = (data) => {
  let value = false;
  for (const user of Object.keys(users)) {
    if (users[user].email === data) {
      value = true;
    } 
  }
  return value;
}


// Returns true if email and password exists in database and matches
const validUser = (emailData, passwordData) => {
  let value = false;
  for (const user of Object.keys(users)) {
    let checkPass = bcrypt.compareSync(passwordData, users[user].password);
    if (users[user].email === emailData && checkPass) {
      value = true;
    } 
  }
  return value;
}

// Creates a cookie for the inputted email
const findID = (emailData) => {
  let ID = '';
  for (const user of Object.keys(users)) {
    if (users[user].email === emailData) {
      ID = user;
    } 
  }
  return ID;
}

// Sifts through urlDatabase, searches for links that matches the userID and returns a new database with the correct links for id
const urlsForUser = id => {
  const newDatabase = {}
  for (const short of Object.keys(urlDatabase)) {
    if (id === urlDatabase[short].userID) {
      newDatabase[short] = urlDatabase[short].longURL
    }
  }
  return newDatabase;
}












app.get('/', (req,res) => {
  res.redirect('/urls');
})


app.get('/urls', (req, res) => {
  const newDatabase = urlsForUser(req.session.user_id);
  let templateVars = {
    urls: newDatabase,
    user: users[req.session.user_id]
  };
  res.render('urls_index', templateVars);
})

// Creates a new shortLink in the database
app.post("/urls", (req, res) => {
  let URL = req.body.longURL;
  let str = generateRandomString();
  if (!URL.startsWith('https://') || !URL.startsWith('http://')) {
    URL = 'http://' + URL;
    res.redirect(`/urls/${str}`);
  }
  urlDatabase[str] = {
    longURL: URL,
    userID: req.session.user_id
  };
});

// Deletes a link
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})

app.get('/urls/new', (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  const userExists = users[req.session.user_id]
  if (userExists) {
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/urls');
  }
})

app.get('/login', (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render('urls_login', templateVars);
})


// When user logs in, check database if email/pass matches, if true, log in
app.post('/login', (req, res) => {
  if (validUser(req.body.email, req.body.password)) {
    let id = findID(req.body.email);
    req.session.user_id = id;
    // res.cookie('user_id', id);
    res.redirect('urls')
  } else {
    res.statusCode = 403;
    res.redirect('/login');
  }
})

app.post('/logout', (req, res) => {
  req.session = null;
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.get('/register', (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render('urls_register', templateVars);
})


// Creates a new account
app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.statusCode = 400;
    res.redirect('/register');
  } else if (existingEmail(req.body.email)) {
    res.statusCode = 400;
    res.redirect('/register');
  } else {
    const mainID = generateRandomString();
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    users[mainID] = {
      id: mainID,
      email: req.body.email,
      password: hashedPassword
    }
    req.session.user_id = mainID;
    // res.cookie('user_id', mainID);
    res.redirect('/urls');
  }
})

// Edit page within each URL that enables you to change the longURL
app.get('/urls/:shortURL', (req, res) => {
  if (req.session.user_id) {
    let templateVars = { 
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: req.session.user_id
      // user: users[req.cookies['user_id']]
    };
    res.render('urls_show', templateVars);
  } else {
    res.redirect('/urls');
  }
})

app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect('/urls')
})


app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  // console.log(urlDatabase[req.params.shortURL].longURL);
  // let templateVars = {
  //   longURL : urlDatabase[req.params.shortURL].longURL
  // }
  res.redirect(longURL);
})




app.listen(PORT, () => {
  console.log(`Example app listening on PORT: ${PORT}`);
})