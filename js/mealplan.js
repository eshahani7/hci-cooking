var db = firebase.firestore();

function checkMealGen() {
  var user = db.collection("users").where("email", "==", "shahani.ekta@gmail.com");
  user.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        console.log(doc.data().mealGenerated);
        if(doc.data().mealGenerated) {
          // show plan and populate cards
          // document.getElementById("title").innerText = "Your Meal Plan";
          // document.getElementById("plan").classList.toggle("hidden");
          loadMealPlan();
        } else {
          document.getElementById("title").innerText = "Build a meal plan";
          document.getElementById("generation").classList.toggle("hidden");
        }
    });
  });
}

function populateMealPlan() {
  var bfastNum = document.getElementById("bfast-num").value;
  console.log(bfastNum);
  bfastNum == "" ? bfastNum = 3 : bfastNum = bfastNum;

  // get bfastNum of breakfast meals from breakfast collection
  db.collection("breakfast").get().then(function (querySnapshot) {
    var bfast = shuffle(querySnapshot.docs).slice(0, bfastNum);
    var bfastData = [];
    console.log(bfastData);
    for(var i = 0; i < bfast.length; i++) {
      bfastData[i] = bfast[i].data();
    }
    db.collection("users").doc("eshahani").update({
      "mealPlan.breakfast" : bfastData
    })
  });

  // var lunchNum = document.getElementById("lunch-num").value;
  // lunchNum == "" ? lunchNum = 3 : lunchNum = lunchNum;
  // db.collection("lunch").get().then(function (querySnapshot) {
  //   var lunch = shuffle(querySnapshot.docs).slice(0, bfastNum);
  //   var lunch = [];
  //   for(var i = 0; i < bfast.length; i++) {
  //     lunchData[i] = lunch[i].data();
  //   }
  //   db.collection("users").doc("eshahani").update({
  //     "mealPlan.lunch" : bfastData
  //   })
  // });

  var dinnerNum = document.getElementById("dinner-num").value;
  dinnerNum == "" ? dinnerNum = 3 : dinnerNum = dinnerNum;
  // db.collection("dinner").get().then(function (querySnapshot) {
  //   var dinner = shuffle(querySnapshot.docs).slice(0, bfastNum);
  //   var dinnerData = [];
  //   for(var i = 0; i < bfast.length; i++) {
  //     dinnerData[i] = dinner[i].data();
  //   }
  //   db.collection("users").doc("eshahani").update({
  //     "mealPlan.dinner" : bfastData
  //   })
  // });

  // db.collection("users").doc("eshahani").update({
  //   mealGenerated: true
  // });

  loadMealPlan();
}

function loadMealPlan() {
  document.getElementById("title").innerText = "Your Meal Plan";
  document.getElementById("plan").classList.toggle("hidden");
  var genClasses = document.getElementById("generation").classList;
  if(!genClasses.contains("hidden")) {
    document.getElementById("generation").classList.toggle("hidden");
  }

  // retrieve info from db
  db.collection("users").doc("eshahani").get().then(function (entry) {
    var bfastList = entry.data().mealPlan.breakfast;
    generateCards(bfastList);
  });
}

function generateCards(list) {
  for(var i = 0; i < list.length; i++) {
    var docPath = list[i].src.path;
    var pathArr = docPath.split("/");
    console.log(docPath);
    db.collection(pathArr[0]).doc(pathArr[1]).get().then(function(recipe) {
      var card = document.getElementById("recipe-card");
      var cardClone = card.cloneNode(true);
      cardClone.removeAttribute("id");
      cardClone.classList.toggle("hidden");

      // TODO: change links to recipes
      cardClone.querySelector(".card-text").innerText = recipe.data().name;
      cardClone.querySelector(".card-img-top").src = recipe.data().imgPath;
      document.getElementById("card-row").appendChild(cardClone);
      console.log("appending");
    });
  }
}

$(".ct").on("click", function(){
   $(".meal-tabs").find(".active").removeClass("active");
   $(this).addClass("active");
   var row = document.getElementById("card-row");
   while (row.firstChild) {
     row.removeChild(row.firstChild);
   }

   if(this.innerText == "BREAKFAST") {
     db.collection("users").doc("eshahani").get().then(function (entry) {
       var lunchList = entry.data().mealPlan.breakfast;
       generateCards(lunchList);
     });
  } else if(this.innerText == "LUNCH") {
    db.collection("users").doc("eshahani").get().then(function (entry) {
      var lunchList = entry.data().mealPlan.lunch;
      generateCards(lunchList);
    });
  } else if(this.innerText == "DINNER") {
    db.collection("users").doc("eshahani").get().then(function (entry) {
      var lunchList = entry.data().mealPlan.dinner;
      generateCards(dinnerList);
    });
  }
   return false;
});

// TODO: finish this ugh
function generateGroceryList() {

}

// source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
