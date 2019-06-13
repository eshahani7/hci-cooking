var db = firebase.firestore();
var recipeName;


window.onload = function(){

  var imgPath = "";
  var values;
  var url = document.location.href,
          params = url.split('?')[1].split('&'),
          data = {}, tmp;
  for (var i = 0, l = params.length; i < l; i++) {
       tmp = params[i].split('=');
       data[tmp[0]] = tmp[1];
  }

  console.log(data.name);
  recipeName = data.name;
  loadHeader();
  loadIngredients();
  loadDirections();
}

function loadHeader(){
  db.collection("recipes").doc(recipeName).get().then(function(doc) {
    var title = doc.data().name;
    var imgPath = doc.data().imgPath;
    document.getElementById("recipeTitle").innerHTML = title;
    document.getElementById("topImage").style.backgroundImage = "url(" + imgPath+ ")";
  });
}
function loadIngredients(){
  var num = 0;
  console.log("loading headers");
  db.collection("recipes").doc(recipeName).get().then(function(doc) {
    var ingredientList = doc.data().ingredients;
    // console.log(ingredientList[0].path);

    var keys = Object.keys(ingredientList);
    values = Object.values(ingredientList);
    // console.log(values[0].path);
    num = 0;
    keys.forEach(function(key) {
      // categories.push(ingredientList[key]);
      var ingredient = document.createElement("LI");
      ingredient.id = "" + num;

      ingredient.classList.add("ingredient");
      ingredient.addEventListener("click", function(){displayPopUp(ingredient.id)});
      // console.log(ingredientList[key].toString());
      var ingredientText = document.createTextNode(key);
      var popUpText = document.createTextNode("Alternatives");
      // popUpText.classList.add("popUpContent");
      var popUpSpan = document.createElement("span");
      var popUpDiv = document.createElement("div");
      // popUpDiv.classList.add("popUp");
      popUpSpan.classList.add("popUpContent");
      popUpSpan.id = "popUpSpan" + num;
      popUpSpan.appendChild(popUpText);
      // popUpDiv.appendChild(popUpSpan);
      // var text = key;

      ingredient.appendChild(ingredientText);

      var ul = document.createElement("ul");
      console.log(num);
      console.log(values[num]);
      parseArr = values[num].path.split("/");
      db.collection(parseArr[0]).doc(parseArr[1]).get().then(function(doc) {
        var options = doc.data().options;
        for(option in options){
          var altOpt = document.createElement("LI");
          if (options[option].toLowerCase() == key.toLowerCase()){
            var altText = document.createTextNode(options[option] + " (recommended)");
          }
          else{
            var altText = document.createTextNode(options[option]);
          }

          altOpt.appendChild(altText);
          ul.appendChild(altOpt);
        }
        // console.log(options);
      });
      popUpSpan.appendChild(ul);

      ingredient.appendChild(popUpSpan);

      document.getElementById("ingredientList").appendChild(ingredient);
      num += 1;
    })
  });

  // createListeners(num);
}

function loadDirections(){
  db.collection("recipes").doc(recipeName).get().then(function(doc) {
    var directionsList = doc.data().steps;
    for (i in directionsList){
      var directionElement = document.createElement("LI");
      directionElement.classList.add("direction");
      var text = directionsList[i]
      // console.log(directionsList[i]);
      var directionText = document.createTextNode(text);

      directionElement.appendChild(directionText);

      document.getElementById("directionList").appendChild(directionElement);
    }
  });
}

function displayPopUp(ingredient_id){
  createIngredientsPopUp(ingredient_id);
}

function createIngredientsPopUp(ingredient_id){
  id = (parseInt(ingredient_id));
  var popup = document.getElementById("popUpSpan" + id);

  popup.classList.toggle("show");
}
