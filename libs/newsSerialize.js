module.exports = news => {
  return {
    id: news._id,
    created_at: news.created_at,
    text: news.text,
    title: news.title,
    user: {
        firstName: news.user.firstName,
        id: news.user._id,
        image: news.user.image,
        middleName: news.user.middleName,
        surName: news.user.surName,
        username: news.user.username
    }
  }
};

