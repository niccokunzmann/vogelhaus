
var renewImageIntervalID = null;
// set random renewal to avoid being able to track the time we watch
var renewalID = Math.floor(Math.random() * 1000000);

function renewImages() {
  renewalID++;
  var images = document.getElementsByClassName("renew-image");
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    // set the original source
    var source = image.getAttribute("original-src");
    if (!source) {
      source = image.getAttribute("src");
      image.setAttribute("original-src", source);
    }
    image.setAttribute("src", source + "?renewal=" + renewalID);
  }
}

// window.onload according to
// http://stackoverflow.com/a/7371558
window.onload = function() {
  renewImageIntervalID = setInterval(renewImages, 1000);
}


