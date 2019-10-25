const mongoose = require('mongoose');
const News = mongoose.model('news');
const User = mongoose.model('user');
const serialize = require('../libs/newsSerialize')

function getAllNews(res) {
 
    News.find()
      .populate("user", "firstName image middleName surName username")
      .then(items => {
        const news = items.map(item => serialize(item));
        res.json(news);
      })
      .catch(e => res.status(400).json({ message: e.message}));
  }

exports.getNews =  (req, res, next) => {
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
      user: user.id
    });
    article.save()
      .then(article => getAllNews(res))
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