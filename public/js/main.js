"use strict";

var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/nav.json');
xhr.send(null);

// From http://www.sitepoint.com/guide-vanilla-ajax-without-jquery/

xhr.onreadystatechange = function() {
  var DONE = 4; // readyState 4 means the request is done.
  var OK = 200; // status 200 is a successful return.
  if (xhr.readyState === DONE) {
    if (xhr.status === OK)
    // console.log(xhr.responseText); // 'This is the returned text.'

    var menuData = JSON.parse(xhr.responseText);

    for (let object of menuData.items) {
      let menuItem = new MenuItem(object);

      let primaryMenu = document.getElementsByClassName("primary-menu")[0];

      menuItem.addToMenu(primaryMenu);
    }

  } else {
    console.log('Error: ' + xhr.status); // An error occurred during the request.
  }
}

var MenuItem = function(object) {
  // Set the default vars
  this.label = object.label;
  this.link = object.link || "#";
  this.children = object.items || [];

  // Build the main DOM object for this menu item
  this.buildDOMObject();
};

MenuItem.prototype = {

  buildDOMObject: function() {

    //Set the main DOM object
    this.DOMObject = this.buildMainItemDOM();

    // Lets build the children!
    //If this item has children
    if (this.hasChildren()) {
      // Build the SecondaryMenu DOM
      let childrenDOM = this.buildChildrenDOM();
      //Add SecondaryMenuDOM to the main DOM
      this.DOMObject.appendChild(childrenDOM);
    }
  },

  buildMainItemDOM : function() {
    // Create DOM elements to build the menu
    let listItem = document.createElement("li");
    let itemLink = document.createElement("a");
    let itemText = document.createTextNode(this.label);

    // Add the text element to the Link element
    itemLink.appendChild(itemText);
    // Add the link element (with text) to the List item (li)
    listItem.appendChild(itemLink);

    // Return the list item
    return listItem;
  },

  /* Builds the secondary menu and its items
   * The items are instances of MenuItem model
   *
   * @return  {DOMObject} secondaryMenu     : the DOMObject containing the secondary menu and items
   */
  buildChildrenDOM : function() {
    // Create the ul element to host the secondaryMenu
    let secondaryMenu = document.createElement("ul");
    // Assign properties to the secondaryMenu
    secondaryMenu.className = "secondary-menu";

    // Iterate over the children items
    for (let object of this.children) {
      // Create a new menu item for each children
      let menuItem = new MenuItem(object);
      // Add the child to the secondaryMenu
      menuItem.addToMenu(secondaryMenu);
    }

    // Returns the secondaryMenu
    return secondaryMenu;
  },

  /* Append the DOM object of this Menu Item
   * to a given Menu Object
   *
   * @param   {DOMObject} menuObject :  the menu object that will receive the menuItem
   * @return  void.
   */
  addToMenu: function(menuObject) {
    // Append to a given Menu Object
    menuObject.appendChild(this.DOMObject);
  },

  hasChildren: function() {
    if (this.children.length > 0) {
      return true
    }
    return false
  },

  // Get functions
  getDOMObject: function() {
    return this.DOMObject;
  },

  getLabel: function() {
    return this.label;
  },

}
