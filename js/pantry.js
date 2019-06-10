var db = firebase.firestore();

function search() {
    var input, filter;
    input = document.getElementById('search-bar');
    filter = input.value.toUpperCase();
    var items = document.getElementsByClassName("item");
    for (var i = 0; i < items.length; i++) {
        var itemName = items[i].id;
        if (itemName.toUpperCase().indexOf(filter) > -1)
            items[i].style.display = "block";
        else
            items[i].style.display = "none";
    }

    var listGroups = document.getElementsByClassName("list-group");
    for (var i = 0; i < listGroups.length; i++) {
        var list = listGroups[i];
        var items = list.querySelectorAll(".item");
        var hidden = true;
        for (var j = 0; j < items.length; j++) {
            if (items[j].style.display != "none") {
                hidden = false;
                break;
            }
        }
        if (hidden == true)
            listGroups[i].style.display = "none";
        else
            listGroups[i].style.display = "inline";
    }
}

function blurBackground() {
    document.getElementsByClassName("blur")[0].classList.add("blur-filter");
    document.getElementsByClassName("blur")[0].style.pointerEvents = "none";
}

function addItem() {
    var newItemName = document.getElementById("new-item-name").value;
    var newItemAmount = document.getElementById("new-item-amount").value;
    var newItemUnit = document.getElementById("new-item-unit").value;
    // var newItemPurchased = new Date(document.getElementById("new-item-purchased").value + "T00:00");
    // var newItemExpires = new Date(document.getElementById("new-item-expires").value + "T00:00");
    var newItemPurchased = document.getElementById("new-item-purchased").value;
    if (newItemPurchased != "")
        newItemPurchased = new Date(newItemPurchased + "T00:00");
    var newItemExpires = document.getElementById("new-item-expires").value;
    if (newItemExpires != "")
        newItemExpires = new Date(newItemExpires + "T00:00");
    var newItemCategory = document.getElementById("new-item-category").value;
    if (newItemName == "") {
        document.getElementById("new-item-name").placeholder = "Item name is required."
        document.getElementById("new-item-name").style.borderColor = "red";
    }
    else {
        var newItem = {
            "name": newItemName,
            "category": "Other",
        }
        if (newItemAmount != "")
            newItem["amount"] = {
                "amount": parseFloat(newItemAmount),
                "unit": newItemUnit
            };
        if (newItemPurchased != "")
            newItem["purchased"] = firebase.firestore.Timestamp.fromDate(newItemPurchased);
        if (newItemExpires != "")
            newItem["expires"] = firebase.firestore.Timestamp.fromDate(newItemExpires);
        if (newItemCategory != "")
            newItem["category"] = newItemCategory;
        var update = {};
        update[`pantry.${newItemName}`] = newItem;
        db.collection("users").doc("eshahani").update(update);
        $("#addItemModal").modal("toggle");
        // clearModal();
        refreshPantry();
    }
}

function clearModal() {
    document.getElementById("new-item-name").value = "";
    document.getElementById("new-item-amount").value = "";
    document.getElementById("new-item-unit").value = "";
    document.getElementById("new-item-purchased").value = "";
    document.getElementById("new-item-expires").value = "";
    document.getElementById("new-item-category").value = "";
}

function editItem(elem) {
    var itemName = getItemName(elem);
    db.collection("users").doc("eshahani").get().then(function(doc) {
        var listMap = doc.data().pantry;
        document.getElementById("new-item-name").value = itemName;
        if (listMap[itemName]["amount"] != null) {
            if (listMap[itemName]["amount"]["amount"] != null)
                document.getElementById("new-item-amount").value = listMap[itemName]["amount"]["amount"];
            if (listMap[itemName]["amount"]["unit"] != null)
                document.getElementById("new-item-unit").value = listMap[itemName]["amount"]["unit"];
        }
        if (listMap[itemName]["purchased"] != null) {
            console.log("purchased: " + listMap[itemName]["purchased"].toDate().toLocaleDateString());
            document.getElementById("new-item-purchased").valueAsDate = listMap[itemName]["purchased"].toDate();
        }
        if (listMap[itemName]["expires"] != null) {
            console.log("expires: " + listMap[itemName]["expires"].toDate().toLocaleDateString());
            document.getElementById("new-item-expires").valueAsDate = listMap[itemName]["expires"].toDate();
        }
        if (listMap[itemName]["category"] != null)
            $("#new-item-category").selectpicker("val", listMap[itemName]["category"]);
        $("#addItemModal").modal("toggle");
    });
    // addItem();
}

function deleteItem(elem) {
    var result = confirm("Do you want to delete this item?");
    if (result = true) {
        var itemName = getItemName(elem);
        db.collection("users").doc("eshahani").update({
            ["pantry." + itemName]: firebase.firestore.FieldValue.delete()
        });
        refreshPantry();
    }
}

function getItemName(elem) {
    var e = elem;
    while (e.classList != null && !e.classList.contains("item"))
        e = e.parentNode;
    return e.id;
}

function refreshPantry() {
    var items = document.getElementsByClassName("item");
    while (items.length > 0) {
        items[0].parentNode.style.display = "none";
        items[0].parentNode.removeChild(items[0]);
    }
    loadItems();
}

$("#addItemModal").on('hidden.bs.modal', function (e) {
    document.getElementsByClassName("blur")[0].classList.remove("blur-filter");
    document.getElementsByClassName("blur")[0].style.pointerEvents = "auto";
    clearModal();
})

function collapseAll() {
    db.collection("users").doc("eshahani").get().then(function(doc) {
        var listMap = doc.data().pantry;
        Object.keys(listMap).forEach(function(key) {
            var id = listMap[key]["name"];

            if (listMap[key]["purchased"] != null)
            document.getElementById(id).querySelector("#purchased").classList.toggle("hidden", true);
        
            if (listMap[key]["expires"] != null)
                document.getElementById(id).querySelector("#expires").classList.toggle("hidden", true);

            document.getElementById(id).querySelector("#edit-item-btn").classList.toggle("hidden", true);
            document.getElementById(id).querySelector("#delete-item-btn").classList.toggle("hidden", true);
        });
    });
}

function expandAll() {
    db.collection("users").doc("eshahani").get().then(function(doc) {
        var listMap = doc.data().pantry;
        Object.keys(listMap).forEach(function(key) {
            var id = listMap[key]["name"];

            if (listMap[key]["purchased"] != null)
                document.getElementById(id).querySelector("#purchased").classList.toggle("hidden", false);
        
            if (listMap[key]["expires"] != null)
                document.getElementById(id).querySelector("#expires").classList.toggle("hidden", false);

            document.getElementById(id).querySelector("#edit-item-btn").classList.toggle("hidden", false);
            document.getElementById(id).querySelector("#delete-item-btn").classList.toggle("hidden", false);
        });
    });
}

function selectView(btn) {
    buttons = document.getElementsByClassName("view-options-btn");
    for (i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "white";
        buttons[i].style.color = "black"
    }
    btn.style.backgroundColor = "#2EC4B6"
    btn.style.color = "white";
    
    if (btn.id == "list-view-btn") {
        collapseAll();
    }
    else if (btn.id == "detailed-view-btn") {
        expandAll();
    }
}

function loadItems() {
    db.collection("users").doc("eshahani").get().then(function(doc) {
        var listMap = doc.data().pantry;
        Object.keys(listMap).forEach(function(key) {
            var listItem = document.getElementById("item");
            var itemClone = listItem.cloneNode(true);
            itemClone.classList.toggle("hidden", false);
            itemClone.querySelector("#item-name").innerText = listMap[key]["name"];

            if (listMap[key]["amount"] != null) {
                var amount = listMap[key]["amount"]["amount"];
                if (listMap[key]["amount"]["unit"] != "")
                    amount += " " + listMap[key]["amount"]["unit"]
                itemClone.querySelector("#amount").innerText = amount;
            }

            if (listMap[key]["purchased"] != null) {
                var purchased = listMap[key]["purchased"].toDate().toLocaleDateString();
                itemClone.querySelector("#purchased").innerText = "Purchased: " + purchased;
            }

            if (listMap[key]["expires"] != null) {
                var expires = listMap[key]["expires"].toDate().toLocaleDateString();
                itemClone.querySelector("#expires").innerText = "Expires: " + expires;
            }

            itemClone.id = listMap[key]["name"];
            itemClone.classList.add("item");

            document.getElementById(listMap[key]["category"]).appendChild(itemClone);
            document.getElementById(listMap[key]["category"]).style.display = "inline";
        });
    });
}

function selectItem(elem) {
    db.collection("users").doc("eshahani").get().then(function(doc) {
        var listMap = doc.data().pantry;
        var key = elem.querySelector("#item-name").innerText;
        if (listMap[key]["purchased"] != null)
            elem.querySelector("#purchased").classList.toggle("hidden");
        
        if (listMap[key]["expires"] != null)
            elem.querySelector("#expires").classList.toggle("hidden");

        elem.querySelector("#edit-item-btn").classList.toggle("hidden");
        elem.querySelector("#delete-item-btn").classList.toggle("hidden");
    });
}