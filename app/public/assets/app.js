$("#submit-form").on("click", function(event) {
  event.preventDefault();


  //calculating an array by iterating through all questions
  var answers = $("select.questions").map(function() {
    return parseInt(this.value);
  }).get();
  console.log(answers);

  // console.log(answers.reduce(add, 0));
  function add(a, b) {
    return parseInt(a) + parseInt(b);
  }


  var newFriend = {
    "name":"Khalil",
    "photo":"test",
    "scores": answers
  };

  $.post("/api/friends", newFriend).done(function(data) {
    alert('Adding you to friend Finder!');
    console.log('new user added to friend list');
  });

  $.get("/api/friends", function(data) {
    var yourScore= data[4].scores;
    var yourScore1 = yourScore.reduce(add, 0);
    console.log("your score is " + yourScore1);
  });
});
