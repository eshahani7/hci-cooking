function toggleFlip(elem) {
  document.getElementsByClassName("login-box")[0].classList.toggle("flipped");
  if(elem.classList.contains("signup-btn")) {
    document.getElementsByClassName("signup-success")[0].classList.add("visible");
  }
}
