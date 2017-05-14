$("#submit-form").on("click", function(event) {
  // prevents page from reloading on submit
  event.preventDefault();


  // creating an add function for .reduce
  function add(a, b) {
    return parseInt(a) + parseInt(b);
  }

  function sortNum(a, b) {
    return a - b;
  }

  //saving an array in variable of user selected answers by iterating through all questions('.questions') and grabbing the selected values
  var answers = $("select.questions").map(function() {
    return parseInt(this.value);
  }).get();


  var userTotalScore = answers.reduce(add, 0);
  console.log("userTotalScore " + userTotalScore);
  var username = $("#username").val().trim();

  var photoLink = $("#photo-link").val().trim();


  // initializing an object literal to easily access userinformation
  var newFriend = {
    "name": username,
    "photo": photoLink,
    "scores": answers
  };

  // // sending user information to be stored inside friends list
  // $.post("/api/friends", newFriend).done(function(data) {
  //   alert('Adding you to friend Finder!');
  //   console.log('new user added to friend list');
  // });



  $.get("/api/friends", function(data) {
    // iterate through the returned userScores and save in array
    var potentialFriendArr = data.map(function(value) {
      // iterate on each user score and calculate their composite score via the reduce method
      return value.scores.reduce(add, 0);
    });
    console.log("Potential Friend Arr" + potentialFriendArr);

    // iterate through the composite scores of listed users on server and save into new array
    var compositeArr = potentialFriendArr.map(function(value) {
      // subtract the composite scores from userTotalScore and return the absolute value and store inside new array(compositeArr)
      return Math.abs(value - userTotalScore);
    });
    console.log("Composite Arr " + compositeArr);
    // using the array.slice method to make a copy of the composite arr before sorting the array
    var sortedCompositeArr = compositeArr.slice(0).sort(sortNum);
    console.log("Sorted composite arr" + sortedCompositeArr);
    var lowestValue = sortedCompositeArr[0];

    var matchedUserIndex;
    for(var i = 0; i < compositeArr.length; i++) {
      if(parseInt(compositeArr[i]) === parseInt(lowestValue)) {
        // retrieving the index of the user from the original array that has the closet value to the user
        matchedUserIndex = i;
      }
    }
    console.log("matched user index " + matchedUserIndex);
    console.log(data[matchedUserIndex]);
    $.post("/api/friends", newFriend).done(function(data){
      console.log("Adding new user to database");
    });
  });
});
