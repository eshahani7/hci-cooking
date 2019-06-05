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
}