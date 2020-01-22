const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "sdsdsd" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "sdsdsd" },
  sdsdsd: { longURL: "https://www.netflix.ca", userID: "aaaa" }
};

const urlsForUser = id => {
  const newDatabase = {}
  for (const short of Object.keys(urlDatabase)) {
    if (id === urlDatabase[short].userID) {
      newDatabase[short] = urlDatabase[short].longURL
    }
  }
  return newDatabase;
}

console.log(urlsForUser("sdsdsd"))