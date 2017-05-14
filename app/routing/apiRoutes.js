var friendsData = require("../data/friends.js");

module.exports = function(app) {
  app.get("/api/friends", function(req, res) {
    return res.json(friendsData);
  });

  app.post("/api/friends", function(req, res) {
    var newFriend = req.body;
    friendsData.push(newFriend);
    console.log(friendsData);
    return res.json(friendsData);
  });
};
