const getUserByEmail = (email, database) => {
  let user = undefined;
  for (const id in database) {
    if (database[id].email === email) {
      user = id;
    }
  }
  return user;
}


module.exports = { getUserByEmail };