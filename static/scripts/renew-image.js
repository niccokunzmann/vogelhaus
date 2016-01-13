function getImageLocation(image) {
    var location = image.getAttribute("original-src");
    if (!location) {
      location = image.getAttribute("src");
      image.setAttribute("original-src", location);
    }
    return location;
}

function sendRequestToSource(image, location, callback) {
  if (image.getAttribute("loading") == "true") {
    return;
  }
  // http://www.w3schools.com/ajax/ajax_xmlhttprequest_send.asp
  var headers = {};
  var lastModified = image.getAttribute("lastModified");
  if (lastModified) {
    headers["If-Modified-Since"] = lastModified;
  }
  var xhttp = new XMLHttpRequest(headers);
  xhttp.responseType = "blob";

  xhttp.onreadystatechange = function() {
    // from http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_callback
    // from https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    if (xhttp.readyState == 4) {
      image.setAttribute("loading", "false");
      if (xhttp.status == 200) {
        callback(xhttp);
      }
    }
  };
  xhttp.open("GET", location, true);
  xhttp.send();
  image.setAttribute("loading", "true");
}

function setImage(xhttp, image) {
  if (image.getAttribute("deleteBlob") == "false") {
    // do not delete the blob i.e. if we saved the image
    image.setAttribute("deleteBlob", "true");
  } else {
    // from http://stackoverflow.com/a/19680728
    window.URL.revokeObjectURL(image.getAttribute("src"));
  }
  var blob = xhttp.response;
  var imgSrc = URL.createObjectURL(blob);
  image.setAttribute("src", imgSrc);
}

function imageReceived(xhttp, image) {
  var modificationDate = xhttp.getResponseHeader("Last-Modified");
  var lastModified = image.getAttribute("lastModified");
  if (modificationDate) {
    if (lastModified) {
      // if two dates are given, we can compare them
      // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
      if (Date.parse(lastModified) < Date.parse(modificationDate)) {
        image.setAttribute("lastModified", modificationDate);
        setImage(xhttp, image);
      }
    } else {
      // we have no information about when the image was modified
      image.setAttribute("lastModified", modificationDate);
      setImage(xhttp, image);
    }
  } else {
    // server sends no modification information 
    // this results in higher bandwidth usage
    setImage(xhttp, image);
  }
}

function renewImage(image) {
  var location = getImageLocation(image);
  sendRequestToSource(image, location, function(xhttp){imageReceived(xhttp, image)})
}

function renewImages() {
  var images = document.getElementsByClassName("renew-image");
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    // set the original source
    renewImage(image)
  }
}

// window.onload according to
// http://stackoverflow.com/a/7371558
window.onload = function() {
  renewImageIntervalID = setInterval(renewImages, 1000);
}


