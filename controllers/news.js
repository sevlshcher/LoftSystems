const mongoose = require('mongoose');
const News = mongoose.model('news');
const User = mongoose.model('user');

function getAllNews(res) {
  News.find({}, (err, news) => {
    let items = JSON.parse(JSON.stringify(news));
    items.forEach(item => item.id = item._id);
    res.json(items);
  });
}

exports.getNews = (req, res, next) => {
  getAllNews(res);
};

exports.postNews = async (req, res, next) => {
  const {text, title} = req.body;
  try {
    const user = await User.findOne({_id: req.user.userId});
    const article = new News({
      created_at: Date.now(),
      text: text,
      title: title,
      user: {
        firstName: user.firstName,
        id: user._id,
        image: user.image,
        middleName: user.middleName,
        surName: user.surName,
        username: user.username,
    }});
    article.save()
      .then(article => {
        getAllNews(res);
      });
  } catch (e) {
    console.log(e)
    res.status(400).json({message: 'News Update error'});
  };
};

exports.updateNews = (req, res, next) => {
  News.findOneAndUpdate({_id: req.params.id}, req.body, () => {
    getAllNews(res);
  });
};

exports.deleteNews = async (req, res, next) => {
  News.findOneAndDelete({_id: req.params.id}, () => {
    getAllNews(res);
  });
};