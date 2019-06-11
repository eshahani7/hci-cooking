var db = firebase.firestore();

window.onload = function(){
  var ingredientName;
  var values;
  var url = document.location.href,
          params = url.split('?')[1].split('&'),
          data = {}, tmp;
  for (var i = 0, l = params.length; i < l; i++) {
       tmp = params[i].split('=');
       data[tmp[0]] = tmp[1];
  }

  console.log(data.name);

  loadStuff(data.name);
}

function loadStuff(ingredientName){
  db.collection("ingredients").doc(ingredientName).get().then(function(doc) {
    var title = doc.data().name;
    var imgPath = doc.data().imgPath;
    var desc = doc.data().desc;
    document.getElementById("ingredientTitle").innerHTML = title;
    document.getElementById("ingImage").style.backgroundImage = "url(" + imgPath+ ")";
    document.getElementById("ingContent").innerHTML = desc;
  });
}

loadStuff();
