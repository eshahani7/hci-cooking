var db = firebase.firestore();
var checkNum = 0
var b = d.name,
url = '/recipe.html?name=' + encodeURIComponent(b);

function checkRecipes(){
  db.collection("recipes").get().then(function(querySnapshot) {
    var recipes = shuffle(querySnapshot.docs).slice(0,7);
    var recipeData = [];
    for(var i = 0; i < recipes.length; i++) {
      recipeData[i] = recipes[i].data();
    }
    // console.log(recipeData)
    displayRecipes(recipeData)
  })

  loadDietaryRestrictions()
}

function displayRecipes(list) {
  for(var i = 0; i < list.length; i++) {
    currRecipe = list[i]
    // db.collection(pathArr[0]).doc(pathArr[1]).get().then(function(recipe) {
    var card = document.getElementById("recipe-card");
    var cardClone = card.cloneNode(true);
    cardClone.removeAttribute("id");
    cardClone.classList.toggle("hidden");

    // TODO: change links to recipes
    cardClone.querySelector(".card-text").innerText = currRecipe.name;
    cardClone.querySelector(".card-img-top").src = currRecipe.imgPath;
    document.getElementById("recommended").appendChild(cardClone);
  }
}

function loadDietaryRestrictions() {

  db.collection("users").doc("eshahani").get().then(function(entry) {
    var dietaryRestrictions = entry.data().dietaryRestrictions;
    var allergies = entry.data().allergies;
    for(var i = 0; i < dietaryRestrictions.length; i++) {
      var elm = document.getElementById("restriction");
      var elmClone = elm.cloneNode(true);
      elmClone.removeAttribute("id");
      elmClone.classList.toggle("hidden");
      elmClone.querySelector(".labelshit").innerText = dietaryRestrictions[i];
      document.getElementById("flavorprofile2").appendChild(elmClone);
    }

    for(var i = 0; i < allergies.length; i++) {
      var elm = document.getElementById("restriction");
      var elmClone = elm.cloneNode(true);
      elmClone.removeAttribute("id");
      elmClone.classList.toggle("hidden");
      elmClone.querySelector(".labelshit").innerText = allergies[i];
      document.getElementById("flavorprofile3").appendChild(elmClone);
    }
  })


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
