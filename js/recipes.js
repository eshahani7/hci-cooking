var db = firebase.firestore();
var checkNum = 0

function checkRecipes(){
  db.collection("recipes").get().then(function(querySnapshot) {
    var recipes = shuffle(querySnapshot.docs);
    displayRecipes(recipes);
  });

  loadFilters()
}

function reloadRecipes() {
  db.collection("recipes").get().then(function(querySnapshot) {
    var recipes = findLunchRecipes(querySnapshot.docs);
    document.getElementById("myFrame").reload();
    // window.onclick.reloadRecipes();/
    // removeRecipes();
    displayRecipes(recipes);
  });

  
}

function removeRecipes(){
  $( "#recommended" ).empty();

}

function findLunchRecipes(list) {
  finalRecipeList = []
  for(var i = 0; i < recipes.length - (recipes.length % 2); i+=2) {
    currRecipe = list[i].data();
    mealType = currRecipe.mealType;
    for(i = 0; i < mealType.length; i++) {
      if(mealType[i] == "Lunch") {
        finalRecipeList.push(mealType[i]);
      }
    }
  }
}

function displayRecipes(recipes) {
  for(var i = 0; i < recipes.length; i++) { // - (recipes.length % 2); i+=2) {
    currRecipe = recipes[i].data();
    currRecipe2 = recipes[i+1].data();
    console.log(currRecipe);

    // db.collection(pathArr[0]).doc(pathArr[1]).get().then(function(recipe) {
    var card = document.getElementById("recipe-card");
    var cardClone = card.cloneNode(true);
    cardClone.removeAttribute("id");
    cardClone.classList.toggle("hidden");

    // TODO: change links to recipes
    var b = recipes[i].id, // d = recipe name
    url = '/recipe.html?name=' + encodeURIComponent(b);

    cardClone.querySelector(".card-text").innerText = currRecipe.name;
    cardClone.querySelector(".card-img-top").src = currRecipe.imgPath;
    cardClone.querySelector(".meal-card").href = url;
    document.getElementById("recommended").appendChild(cardClone);

    // var cardClone2 = card.cloneNode(true);
    // cardClone2.removeAttribute("id");
    // cardClone2.classList.toggle("hidden");
    //
    // var b1 = recipes[i].id, // d = recipe name
    // url2 = '/recipe.html?name=' + encodeURIComponent(b1);
    //
    // // TODO: change links to recipes
    // cardClone2.querySelector(".card-text").innerText = currRecipe2.name;
    // cardClone2.querySelector(".card-img-top").src = currRecipe2.imgPath;
    // cardClone2.querySelector(".meal-card").href = url2;
    // document.getElementById("recommended").appendChild(cardClone2);
  }
}

function loadFilters() {
  // FAKE FILTERS
  typeOfMeal = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  typeOfCuisine = ['American', 'Indian', 'Italian', 'Spanish'];

  for(i = 0; i < typeOfMeal.length; i++) {
    var listItem = document.getElementById("item");
    var itemClone = listItem.cloneNode(true);
    itemClone.removeAttribute("id");
    itemClone.classList.toggle("hidden");
    itemClone.querySelector(".check").id = "checkbox" + checkNum;
    itemClone.querySelector(".check-label").setAttribute("for", "checkbox" + checkNum);
    checkNum++;

    itemClone.querySelector(".item-label").innerText = typeOfMeal[i];
    document.getElementById("typeOfMeal").appendChild(itemClone);
  }

  for(i = 0; i < typeOfCuisine.length; i++) {
    var listItem = document.getElementById("item");
    var itemClone = listItem.cloneNode(true);
    itemClone.removeAttribute("id");
    itemClone.classList.toggle("hidden");
    itemClone.querySelector(".check").id = "checkbox" + checkNum;
    itemClone.querySelector(".check-label").setAttribute("for", "checkbox" + checkNum);
    checkNum++;

    itemClone.querySelector(".item-label").innerText = typeOfCuisine[i];
    document.getElementById("typeOfCuisine").appendChild(itemClone);
  }

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
