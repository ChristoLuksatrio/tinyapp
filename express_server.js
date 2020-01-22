const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;
var cookieParser = require('cookie-parser')


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

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
}

function generateRandomString() {
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
    if (users[user].email === emailData && users[user].password === passwordData) {
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






app.get('/', (req,res) => {
  res.redirect('/urls');
})


app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']]
  };
  res.render('urls_index', templateVars);
})

app.post("/urls", (req, res) => {
  let URL = req.body.longURL;
  let str = generateRandomString();
  urlDatabase[str] = URL;
  res.redirect(`/urls/${str}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})

app.get('/urls/new', (req, res) => {
  let templateVars = {
    user: users[req.cookies['user_id']]
  };
  res.render('urls_new');
})

app.get('/login', (req, res) => {
  let templateVars = {
    user: users[req.cookies['user_id']]
  };
  res.render('urls_login', templateVars);
})

app.post('/login', (req, res) => {
  if (validUser(req.body.email, req.body.password)) {
    let id = findID(req.body.email);
    res.cookie('user_id', id);
    res.redirect('urls')
  } else {
    res.statusCode = 403;
    res.redirect('/login');
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.get('/register', (req, res) => {
  let templateVars = {
    user: users[req.cookies['user_id']]
  };
  res.render('urls_register', templateVars);
})

app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.statusCode = 400;
    res.redirect('/register');
  } else if (existingEmail(req.body.email)) {
    res.statusCode = 400;
    res.redirect('/register');
  } else {
    const mainID = generateRandomString();
    users[mainID] = {
      id: mainID,
      email: req.body.email,
      password: req.body.password
    }
    res.cookie('user_id', mainID);
    res.redirect('/urls');
  }
})

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies['user_id']]
  };
  res.render('urls_show', templateVars);
})

app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls')
})


app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})




app.listen(PORT, () => {
  console.log(`Example app listening on PORT: ${PORT}`);
})