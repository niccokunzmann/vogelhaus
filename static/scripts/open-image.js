
function openImage(imageID) {
  var image = document.getElementById(imageID);
  // save blob for saved image
  image.setAttribute("deleteBlob", "false");
  var savedImages = document.getElementById("savedImages");
  // clone element 
  //   http://stackoverflow.com/questions/921290/is-it-possible-to-clone-html-element-objects-in-javascript-jquery
  var newElement = image.cloneNode(true);
  newElement.classList.remove("renew-image");
  newElement.removeAttribute("id");
  // insert at beginning
  //   http://www.javascriptkit.com/javatutors/dom2.shtml
  savedImages.insertBefore(newElement, savedImages.firstChild);
}