$("#submit-form").on("click", function(event) {
  // prevents page from reloading on submit
  event.preventDefault();
  var goodUrl = false;
  var goodName = false;

  // creating an add function for .reduce
  function add(a, b) {
    return parseInt(a) + parseInt(b);
  }
  // creating a sort function for .sort
  function sortNum(a, b) {
    return a - b;
  }

  // function to validate whether the user-inputted image url contains proper url components
  function urlValidation(link) {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if ((link === "") || (link === null)) {
      goodUrl = false;
      return false;
    }
    else if(link.match(regex)) {
      alert("good url");
      goodUrl = true;
    }
  }

  function validateName(id) {
    var expression = /^[a-zA-Z_]+$/;
    var regex = new RegExp(expression);
    if((id === "") || (id === null)) {
      goodName = false;
      return false;
    }
    else if (id.match(expression)) {
      alert("good name");
      goodName = true;
    }
  }


  //saving an array in variable of user selected answers by iterating through all questions('.questions') and grabbing the selected values
  var answers = $("select.questions").map(function() {
    return parseInt(this.value);
  }).get();

  // creating an array called userTotalScore with the total composite score from all users and storing them in userTotalScore
  // This is done via the .reduce function which iterates through each scores property to reduce it down to one element using the add function defined above passed as an argument
  var userTotalScore = answers.reduce(add, 0);
  console.log("userTotalScore " + userTotalScore);
  var username = $("#username").val().trim();

  var photoLink = $("#photo-link").val().trim();

  // perform validation function calls after form values have been stored in variables
  urlValidation(photoLink);
  validateName(username);
  if ((goodName === false) && (goodUrl === false)) {
    alert("Please enter something in all fields!");
    return false;
  }
  else if (goodName === false) {
    alert("Please enter a name!");
    console.log("bad name " + goodName);
    return false;
  }
  else if(goodUrl === false) {
    alert("Please enter a url!");
    console.log("bad url " + goodUrl);
    return false;
  }


  // initializing an object literal to easily access userinformation
  var newFriend = {
    "name": username,
    "photo": photoLink,
    "scores": answers
  };


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
    // storing the lowest value from sortedCompositeArr[0] in variable for reference;
    var lowestValue = sortedCompositeArr[0];

    // declaring a variable to reference the matchedUserIndex which will be used to grab matched user profile
    var matchedUserIndex;
    for(var i = 0; i < compositeArr.length; i++) {
      if(parseInt(compositeArr[i]) === parseInt(lowestValue)) {
        // retrieving the index of the user from the original array that matches the lowest value from the sortedcompositeArr
        matchedUserIndex = i;
      }
    }


    console.log("matched user index " + matchedUserIndex);
    var matchedUser = {
      name: data[matchedUserIndex].name,
      photo: data[matchedUserIndex].photo,
    };
    var matchedUserName = $("<h2>");
    matchedUserName.text(matchedUser.name);
    matchedUserName.attr("class", "text-center");
    var matchedUserImage = $("<img>");
    matchedUserImage.attr("class", "img-responsive");
    matchedUserImage.attr("src", data[matchedUserIndex].photo);
    $("#modal-content").append(matchedUserName);
    $("#modal-content").append(matchedUserImage);
    $("#myModal").modal('show');


    // posting new user data /api/friends/
    $.post("/api/friends", newFriend).done(function(data){
      console.log("Adding new user to database");
    });

  });
});

$(".modal-button").on("click", function(event) {
  event.preventDefault();
  $("#modal-content").empty();
  $("#myModal").modal('hide');
});

$("#home-page-button").on("click", function(event) {
  event.preventDefault();
  $(location).attr("href", "/survey");
});
