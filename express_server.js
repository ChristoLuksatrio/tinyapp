const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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


app.get('/', (req,res) => {
  res.redirect('/urls');
})


app.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase};
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
  res.render('urls_new');
})

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
})


app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})




app.listen(PORT, () => {
  console.log(`Example app listening on PORT: ${PORT}`);
})