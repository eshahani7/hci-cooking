var db = firebase.firestore();
var result = {};

function checkMealGen() {
  var user = db.collection("users").where("email", "==", "shahani.ekta@gmail.com");
  user.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        console.log(doc.data().mealGenerated);
        if(doc.data().mealGenerated) {
          // show plan and populate cards
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
    for(var i = 0; i < bfast.length; i++) {
      bfastData[i] = bfast[i].data();
    }
    db.collection("users").doc("eshahani").update({
      "mealPlan.breakfast" : bfastData
    })
    loadMealPlan();
    generateGroceryList(bfastData);
    // grocery List
  });

  var lunchNum = document.getElementById("lunch-num").value;
  lunchNum == "" ? lunchNum = 3 : lunchNum = lunchNum;
  db.collection("lunch").get().then(function (querySnapshot) {
    var lunch = shuffle(querySnapshot.docs).slice(0, lunchNum);
    var lunchData = [];
    for(var i = 0; i < lunch.length; i++) {
      lunchData[i] = lunch[i].data();
    }
    db.collection("users").doc("eshahani").update({
      "mealPlan.lunch" : lunchData
    })
    generateGroceryList(lunchData);
  });

  var dinnerNum = document.getElementById("dinner-num").value;
  dinnerNum == "" ? dinnerNum = 3 : dinnerNum = dinnerNum;
  db.collection("dinner").get().then(function (querySnapshot) {
    var dinner = shuffle(querySnapshot.docs).slice(0, bfastNum);
    var dinnerData = [];
    for(var i = 0; i < dinner.length; i++) {
      dinnerData[i] = dinner[i].data();
    }
    db.collection("users").doc("eshahani").update({
      "mealPlan.dinner" : dinnerData
    })
    generateGroceryList(dinnerData);
  });

  db.collection("users").doc("eshahani").update({
    mealGenerated: true
  });
}

function loadMealPlan() {
  document.getElementById("title").innerText = "Your Meal Plan";
  document.getElementById("plan").classList.toggle("hidden");
  document.getElementById("tabs").classList.toggle("hidden");
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
    var recipeQueryName;
    console.log(docPath);
    db.collection(pathArr[0]).doc(pathArr[1]).get().then(function(recipe) {
      var card = document.getElementById("recipe-card");
      var cardClone = card.cloneNode(true);
      cardClone.removeAttribute("id");
      cardClone.classList.toggle("hidden");

      // TODO: change links to recipes
      // console.log(recipeQueryName);
      cardClone.querySelector(".card-text").innerText = recipe.data().name;
      cardClone.querySelector(".card-img-top").src = recipe.data().imgPath;

      var recipeQueryName = "/recipe.html?name="+encodeURIComponent(recipe.id);
      cardClone.querySelector("a").href = recipeQueryName;
      document.getElementById("card-row").appendChild(cardClone);
    });
  }
}

function replaceCard(card, docPath, meal) {
  var pathArr = docPath.split("/");
  db.collection(pathArr[0]).doc(pathArr[1]).get().then(function(recipe) {

    // TODO: change links to recipes
    var oldName = card.querySelector(".card-text").innerText;
    card.querySelector(".card-text").innerText = recipe.data().name;
    card.querySelector(".card-img-top").src = recipe.data().imgPath;
    var recipeQueryName = "/recipe.html?name="+encodeURIComponent(recipe.id);
    card.querySelector("a").href = recipeQueryName;
    var name = "mealPlan.breakfast";

    if(meal == "breakfast") {
      var query = db.collection("breakfast").where("name", "==", oldName);
      query.get().then(function (querySnapshot) {
        db.collection("users").doc("eshahani").update({
          "mealPlan.breakfast" : firebase.firestore.FieldValue.arrayRemove(querySnapshot.docs[0].data())
        });
      });
      var query = db.collection("breakfast").where("name", "==", recipe.data().name);
      query.get().then(function (querySnapshot) {
        db.collection("users").doc("eshahani").update({
          "mealPlan.breakfast" : firebase.firestore.FieldValue.arrayUnion(querySnapshot.docs[0].data())
        });
      });
    } else if(meal == "lunch") {
      var query = db.collection("lunch").where("name", "==", oldName);
      query.get().then(function (querySnapshot) {
        db.collection("users").doc("eshahani").update({
          "mealPlan.lunch" : firebase.firestore.FieldValue.arrayRemove(querySnapshot.docs[0].data())
        });
      });
      var query = db.collection("lunch").where("name", "==", recipe.data().name);
      query.get().then(function (querySnapshot) {
        db.collection("users").doc("eshahani").update({
          "mealPlan.lunch" : firebase.firestore.FieldValue.arrayUnion(querySnapshot.docs[0].data())
        });
      });
    } else {
      var query = db.collection("dinner").where("name", "==", oldName);
      query.get().then(function (querySnapshot) {
        db.collection("users").doc("eshahani").update({
          "mealPlan.dinner" : firebase.firestore.FieldValue.arrayRemove(querySnapshot.docs[0].data())
        });
      });
      var query = db.collection("dinner").where("name", "==", recipe.data().name);
      query.get().then(function (querySnapshot) {
        db.collection("users").doc("eshahani").update({
          "mealPlan.dinner" : firebase.firestore.FieldValue.arrayUnion(querySnapshot.docs[0].data())
        });
      });
    }
  });
}

function refreshCard(elem) {
  // get actual card
  var node = elem.parentNode.parentNode.parentNode;
  var meal = document.getElementsByClassName("active")[0].innerText.toLowerCase();

  // check inner text of active item to query appropriate collection
  db.collection(meal).get().then(function (querySnapshot) {
    var allMeals = querySnapshot.docs;
    var allMealData = allMeals.map(value => value.data().src.path);
    db.collection("users").doc("eshahani").get().then(function (entry) {
      var mealPlan = entry.data().mealPlan.breakfast;
      if(meal == "lunch") {
        mealPlan = entry.data().mealPlan.lunch;
      } else if(meal == "dinner") {
        mealPlan = entry.data().mealPlan.dinner;
      }
      mealPlan = mealPlan.map(value => value.src.path);
      var subset = allMealData.filter(value => !mealPlan.includes(value));
      var path = shuffle(subset)[0];
      replaceCard(node, path, meal);
    });
  });
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
      console.log("dinner: ", lunchList);
      generateCards(lunchList);
    });
  }
   return false;
});

// TODO: finish this ugh
function generateGroceryList(list) {
  list.forEach(function(listItem) {
    var docPath = listItem.src.path;
    var pathArr = docPath.split("/");
    console.log("outer");
    db.collection(pathArr[0]).doc(pathArr[1]).get().then(function(recipe) {
      var keys = Object.keys(recipe.data().ingredients);
      var values = Object.values(recipe.data().ingredients);
      values.forEach(function(val, i) {
        console.log("in for each");
        var ingPath = val.path.split("/");
        db.collection(ingPath[0]).doc(ingPath[1]).get().then(function(ing) {
          values[i] = ing.data().type;
          keys.forEach((key, i) => result[key] = values[i]);
        });
      })
    });
    setTimeout(function() {
    }, 2000);
  })
  setTimeout(function(){
    db.collection("users").doc("eshahani").update({
      "groceryList" : result
    })
  }, 5000);
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
