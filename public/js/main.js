"use strict";

var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/nav.json');
xhr.send(null);

// From http://www.sitepoint.com/guide-vanilla-ajax-without-jquery/

xhr.onreadystatechange = function () {
  var DONE = 4; // readyState 4 means the request is done.
  var OK = 200; // status 200 is a successful return.
  if (xhr.readyState === DONE) {
    if (xhr.status === OK)
      // console.log(xhr.responseText); // 'This is the returned text.'

      var data = JSON.parse(xhr.responseText);

      for (let object of data.items) {
        addMenuItem(object);
      }

    } else {
      console.log('Error: ' + xhr.status); // An error occurred during the request.
    }
  }

function addMenuItem(item) {

  // console.log(item)

  let liItem = document.createElement("li");

  var link = document.createElement("a");

  var text = document.createTextNode(item.label);

  link.appendChild(text);

  liItem.appendChild(link);

  // Find childs
  let childs = item.items

  let secondaryMenu;

    // Add elements to primary-menu
    var primaryMenu = document.getElementsByClassName("primary-menu")[0];

  //If there are childs
  if(childs.length > 0) {
      addSecondaryMenu(liItem, childs);
  }

  primaryMenu.appendChild(liItem);
}

function addSecondaryMenu(primaryMenuItem, childs) {
  let secondaryMenu = document.createElement("ul");

  secondaryMenu.className = "secondary-menu";

  for (let object of childs) {
    secondaryMenu.appendChild(createSecondaryMenuItem(object));
  }

  primaryMenuItem.appendChild(secondaryMenu);
}

function createSecondaryMenuItem(item) {
  // console.log(item.label);

  let liItem = document.createElement("li");

  let link = document.createElement("a");

  let text = document.createTextNode(item.label);

  link.appendChild(text);

  liItem.appendChild(link);

  return liItem;
}


var menuItem = function(object) {
   this.label = object.label;
   this.link = "";
   this.items = object.items;

   this.addSecondaryMenu = function() {
     console.log(this.label + "MTF");
   }

   this.hasChilds = function() {
     if (this.items.length > 0) {
       return true;
     }
     return false;
   }
}

let myItem = new menuItem({label:"myLabel"});

// myItem.addSecondaryMenu();

console.log(myItem.hasChilds());


console.log(myItem.hasChilds());
