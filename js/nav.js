var mainMargin = document.getElementById("main").style.marginLeft;

$(function(){
  $("#side-nav").load("./nav.html");
});

function open_nav() {
  var mainList = document.getElementsByClassName("main");
  document.getElementById("main").style.marginLeft = "15%";
  document.getElementById("mySidebar").style.width = "15%";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("openNav").style.display = 'none';
}

function close_nav() {
  document.getElementById("main").style.marginLeft = mainMargin;
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
}
