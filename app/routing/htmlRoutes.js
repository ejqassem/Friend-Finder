module.exports = function(app, path) {
  app.get("/survey", function(req,res) {
    res.sendFile(path.join(__dirname, "../public/survey.html"));
  });

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });

  app.get("*", function(req, res) {
    res.status(404);
    res.sendFile(path.join(__dirname, "../public/404.html"));
  });
};
