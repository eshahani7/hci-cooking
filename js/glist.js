var db = firebase.firestore();
var checkNum = 0;
var addItem = document.getElementById("add").cloneNode(true);

// adapted from https://stackoverflow.com/questions/27476566/how-to-make-li-editable-on-click
$('.addNewContext').click(function() {
    $(this).html("").attr('contenteditable', 'true');
    curr = this;
}).keyup(function(e) {
  if (e.keyCode == 13) {
     var val = $(this).text();
     var listItem = document.getElementById("item");
     var itemClone = listItem.cloneNode(true);
     itemClone.removeAttribute("id");
     itemClone.classList.toggle("hidden");
     itemClone.querySelector(".check").id = "checkbox" + checkNum;
     itemClone.querySelector(".check-label").setAttribute("for", "checkbox" + checkNum);
     itemClone.querySelector(".item-label").innerText = val;
     $(this)
        // create a new li item
        .before(itemClone)
        // set plus sign again
        .html(addItem)
        // make contenteditable to false, when clicked the process start again.
        .attr('contenteditable', 'false');
     e.preventDefault();
  }
});

function loadItems() {
  db.collection("users").doc("eshahani").get().then(function(doc) {
    // console.log(doc.data().groceryList);
    var listMap = doc.data().groceryList;
    Object.keys(listMap).forEach(function(key) {
      // console.log("key: ", key, ", val: ", listMap[key]);
      var listItem = document.getElementById("item");
      var itemClone = listItem.cloneNode(true);
      itemClone.removeAttribute("id");
      itemClone.classList.toggle("hidden");
      itemClone.querySelector(".check").id = "checkbox" + checkNum;
      itemClone.querySelector(".check-label").setAttribute("for", "checkbox" + checkNum);
      checkNum++;

      itemClone.querySelector(".item-label").innerText = key;
      document.getElementById(listMap[key]).appendChild(itemClone);
    })
  });
}

// function removeFromList(elem) {
//   var label = elem.parentNode.querySelector(".item-label").innerText;
//   db.collection("users").doc("eshahani").get().then(function(doc) {
//
//   });
// }
