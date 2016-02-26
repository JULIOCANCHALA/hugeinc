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


/* MenuItem Model : builds a MenuItem from an json, that can be append in a menu
 *
 * @param {JSON} object   : the data containing the label, link and children of this item
 */
var MenuItem = function(object) {
  // Set the default vars
  this.label = object.label;
  this.link = object.url || "#";
  this.children = object.items || [];

  // Build the main DOM object for this menu item
  this.buildDOMObject();
};

MenuItem.prototype = {

  /* Builds the main DOM Object prepaired to be included in the menu
   *
   * @return  void
   */
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

  /* Builds the DOM Object for the Main Items
   *
   * @return  {DOMObject} listItem     : the DOMObject containing the main item with link and label
   */
  buildMainItemDOM: function() {
    // Create DOM elements to build the menu
    let listItem = document.createElement("li");
    let itemLink = document.createElement("a");
    let itemText = document.createTextNode(this.label);

    // Add properties to itemLink
    itemLink.setAttribute("href", this.link);
    itemLink.setAttribute("tabindex", 0);
    itemLink.setAttribute("role", "menuitem");

    this.buildEvents(itemLink);

    // Add the text element to the Link element
    itemLink.appendChild(itemText);
    // Add the link element (with text) to the List item (li)
    listItem.appendChild(itemLink);

    // Return the list item
    return listItem;
  },

  buildEvents: function(itemLink) {
    let _self = this;

    itemLink.onclick = function(e) {
      e.preventDefault();

      hideAllSecondaryMenus();

      if (_self.hasChildren()) {
        _self.showSecondaryMenu();
      } else {
        window.location.href = _self.link;
      }
    }
  },

  /* Builds the secondary menu and its items
   * The items are instances of MenuItem model
   *
   * @return  {DOMObject} secondaryMenu     : the DOMObject containing the secondary menu and items
   */
  buildChildrenDOM: function() {
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

  /* Validate if this menu item has sub items
   *
   * @return  {True/False}.
   */
  hasChildren: function() {
    if (this.children.length > 0) {
      return true
    }
    return false
  },

  // Get functions

  /* Returns the main DOM Object
   *
   * @return  void.
   */
  getDOMObject: function() {
    return this.DOMObject;
  },

  /* Returns the label of this menu item
   *
   * @return  void.
   */
  getLabel: function() {
    return this.label;
  },

  // Show functions
  showSecondaryMenu: function() {
    let secondaryMenu = this.DOMObject.getElementsByClassName('secondary-menu')[0];
    secondaryMenu.style.display = "block";

    showBlackOverlay();
  },

}

let blackOverlay = document.getElementById('black-overlay');

blackOverlay.addEventListener("click", function() {
  hideAllSecondaryMenus();

  blackOverlay.style.display = 'none';
});

function showBlackOverlay() {
  let blackOverlay = document.getElementById('black-overlay');

    blackOverlay.style.display = 'block';
}

function hideAllSecondaryMenus() {
  var menus = document.getElementsByClassName('secondary-menu');

  for (let i = 0; i < menus.length; i++) {
    menus[i].style.display = "none";
  }
}
