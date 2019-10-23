const serialize = user => {
  return {
    id: user._id,
    userName: user.userName || '',
    firstName: user.firstName || '',
    middleName: user.middleName || '',
    surName: user.surName || '',
    image: user.image || '',
    permission: user.permission
  };
};

module.exports = serialize;