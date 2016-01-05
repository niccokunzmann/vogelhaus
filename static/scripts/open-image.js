
function openImage(imageID) {
  var image = document.getElementById(imageID);
  var savedImages = document.getElementById("savedImages");
  // clone element 
  //   http://stackoverflow.com/questions/921290/is-it-possible-to-clone-html-element-objects-in-javascript-jquery
  var newElement = image.cloneNode(true);
  image.parentElement.insertBefore(newElement, image);
  image.classList.remove("renew-image");
  image.removeAttribute("id");
  // insert at beginning
  //   http://www.javascriptkit.com/javatutors/dom2.shtml
  savedImages.insertBefore(image, savedImages.firstChild);
}