var MenuItem = window.MenuItem = (function(window, document, undefined) {
  'use strict';

/**
 * MenuItem Model : builds a MenuItem from an json, that can be append in a menu
 *
 * @param {JSON} object   : the data containing the label, link and children of this item
 */
var MenuItem = function(object) {
  // Set the default vars
  this.label = object.label;
  this.link = object.url || "#";
  this.children = object.items || [];

  // Build the main DOM object for this menu item
  this.buildDOMElement();

  this.showSubMenu = new CustomEvent(
    "unfold",
    {
        detail: {
            secondaryMenu: this.getSecondaryMenu(),
            time: new Date(),
        },
        bubbles: true,
        cancelable: true
    }
  );

  this.hideSubMenu = new CustomEvent(
    "shrink",
    {
      detail: {
          secondaryMenu: this.getSecondaryMenu(),
          time: new Date(),
      },
      bubbles: true,
      cancelable: true
    }
  )
};

MenuItem.prototype = {

  /**
   * Builds the main DOM Object prepaired to be included in the menu
   *
   * @return  void
   */
  buildDOMElement: function() {

    //Set the main DOM object
    this.DOMElement = this.buildMainItemDOM();

    // Lets build the children!
    //If this item has children
    if (this.hasChildren()) {
      // Build the SecondaryMenu DOM
      let childrenDOM = this.createChildrenElements();
      //Add SecondaryMenuDOM to the main DOM
      this.DOMElement.appendChild(childrenDOM);
    }
  },

  /**
   * Builds the DOM Object for the Main Items
   *
   * @return  {DOMElement} listItem     : the DOMElement containing the main item with link and label
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

    this.attachEvents(itemLink);

    // Add the text element to the Link element
    itemLink.appendChild(itemText);
    // Add the link element (with text) to the List item (li)
    listItem.appendChild(itemLink);

    // Return the list item
    return listItem;
  },

  /**
   * Builds events for this A element
   *
   * @param   {DOMElement} itemLink    : the A item which we will put the events
   * @return  void
   */
  attachEvents: function(itemLink) {
    //Save this for inner functions
    let _self = this;

    //Set onclick event
    itemLink.onclick = function(e) {
      // Prevent navigation
      e.preventDefault();

      //  If this item has children
      if (_self.hasChildren()) {
        // Show or hide secondaryMenu
        _self.toggleSecondaryMenu();

      } else { // If this item has no children

        // Navigate to self link
        window.location.href = _self.link;
      }
    }
  },

  /**
   * Builds the secondary menu and its items
   * The items are instances of MenuItem model
   *
   * @return  {DOMElement} secondaryMenu     : the DOMElement containing the secondary menu and items
   */
  createChildrenElements: function() {
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

  /**
   * Append the DOM object of this Menu Item
   * to a given Menu Object
   *
   * @param   {DOMElement} menuObject :  the menu object that will receive the menuItem
   * @return  void.
   */
  addToMenu: function(menuObject) {
    // Append to a given Menu Object
    menuObject.appendChild(this.DOMElement);
  },

  /**
   * Validate if this menu item has sub items
   *
   * @return  {boolean}.
   */
  hasChildren: function() {
    if (this.children.length > 0) {
      return true
    }
    return false
  },

  // Get functions

  /**
   * Returns the main DOM Object
   *
   * @return  void.
   */
  getDOMElement: function() {
    return this.DOMElement;
  },

  getSecondaryMenu: function() {
    return this.DOMElement.getElementsByClassName('secondary-menu')[0];
  },

  /**
   * Returns the label of this menu item
   *
   * @return  void.
   */
  getLabel: function() {
    return this.label;
  },

  // SecondaryMenu functions

  /**
   * show the Secondary Menu of this item
   *
   * @return  void.
   */
  showSecondaryMenu: function() {
    this.getSecondaryMenu().classList.add("open");

    //Dispatch the unfold event
    this.DOMElement.dispatchEvent(this.showSubMenu);
  },

  /**
   * toggle the Secondary Menu of this item
   *
   * @return  void.
   */
  toggleSecondaryMenu: function() {
    this.getSecondaryMenu().classList.toggle("open");

    // Send the proper events

    // If secondary Menu is open
    if (this.secondaryMenuIsOpen()) {
      //Dispatch the proper event
      this.DOMElement.dispatchEvent(this.showSubMenu);
    } else {
      // Dispatch the event where the secondary Menu is shrink
      this.DOMElement.dispatchEvent(this.hideSubMenu);
    }
  },

  /**
   * Evaluate if the secondary Menu is open
   *
   * @return  {boolean}.
   */
  secondaryMenuIsOpen: function() {
    if (this.getSecondaryMenu().classList.contains("open")) {
      return true;
    }

    return false;
  }

};

return MenuItem;

})(window, document, window.MenuItem);
