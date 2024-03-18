let BookInstance = require('../models/bookinstance');


exports.show_all_books_status = async (res) =>  {
  BookInstance.find({status: "Available"}).populate('book').then(list_bookInstances => {
    res.send(list_bookInstances.map((instance) => {
      return instance.book.title + " : " + instance.status;
    }))
  });
}