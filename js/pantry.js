var db = firebase.firestore(); // why this give error?

function search() {

}

function selectView(btn) {
    buttons = document.getElementsByClassName("view-options-btn");
    for (i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "white";
        buttons[i].style.color = "black"
    }
    btn.style.backgroundColor = "#2EC4B6"
    btn.style.color = "white";
    console.log("yeet");
}

function loadItems() {
    db.collection("users").doc("eshahani").get().then(function(doc) {
    //     var listMap = doc.data().pantry;
    //     // Object.keys(listMap).forEach(function(key) {
    //     //     var listItem = document.getElementById("item");
    //     //     var itemClone = listItem.cloneNode(true);
    //     //     itemClone.classList.toggle("hidden", false);

    //     //     // itemClone.querySelector("")
    //     //     console.log
    //     // });
    //     for (elem in listMap) {
    //         console.log(elem);
    //     }
    });
    console.log("what");
}