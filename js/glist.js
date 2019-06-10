var db = firebase.firestore();
var checkNum = 0;
var addItem = document.getElementById("add").cloneNode(true);

// adapted from https://stackoverflow.com/questions/27476566/how-to-make-li-editable-on-click
$('.addNewContext').click(function() {
    $(this).html("").attr('contenteditable', 'true');
}).keyup(function(e) {
  if (e.keyCode == 13) {
     var val = $(this).text();
     var heading = this.id.split("-")[0];
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
        // insert add field
        .html(addItem)
        // make contenteditable to false, when clicked the process start again.
        .attr('contenteditable', 'false');
     e.preventDefault();

     // save item to grocery list collection
     addToList(val, heading);
  }
});

// TODO: @Christina you'll update the pantry with the item info here
// key = item, value = heading
function onCheckChange(elem) {
  var key = elem.parentNode.parentNode.querySelector(".item-label").innerText;
  // var value = elem.parentNode.parentNode.parentNode.parentNode.id;
  var value = getHeading(elem);
  console.log("heading: " + value);

  if(elem.checked) {
    addToPantry(key, value);
    removeFromList(key, value);
  } else {
    addToList(key, value);
  }
}

function getHeading(elem) {
  var e = elem;
  console.log("id: " + e.id);
  while (e.classList == null || (e.classList != null && !e.classList.contains("heading")))
    e = e.parentNode;
  return e.id;
}

function addToPantry(itemName, category) {
  newItem = {
    "name": itemName,
    "category": category
  }
  var update = {};
  update[`pantry.${itemName}`] = newItem;
  db.collection("users").doc("eshahani").update(update);
}

function addToList(key, value) {
  const update = {};
  update[`groceryList.${key}`] = value;
  db.collection("users").doc("eshahani").update(update);
}

function removeFromList(key, value) {
  db.collection("users").doc("eshahani").get().then(function(doc) {
    const map = doc.data().groceryList;
    delete map[key];
    db.collection("users").doc("eshahani").update({groceryList : map});
  });
}

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
