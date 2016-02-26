"use strict";

var Menu = function(object, isResponsive) {
  this.name = object.name;
  this.DOMElement = document.getElementById(this.name);

  this.blackOverlay = document.getElementById('black-overlay');

  this.isResponsive = isResponsive;

  if (isResponsive) {
    this.addResponsiveEvent();
  }

  this.listenEvents();
}

Menu.prototype = {

  /**
   * Make the ajax call to fill the menu items
   *
   * @return  void
   */
  populate: function() {

    let _self = this;

    Server.get('nav.json')

    .then(function(response) {
    	// Parse JSON from response
    	return JSON.parse(response);
    })
    .then(function(jsonResponse) {
      // Transform received JSON into MenuItem Objects
    	return jsonResponse.items.map(function(menuItemAttrs) {
    		return new MenuItem(menuItemAttrs);
    	});
    })
    .then(function(menuItems) {
    	// add menu items to the menu
      [].forEach.call(menuItems, function (menuItem) {
        _self.addItem(menuItem.getDOMElement());
      });
    })
    .catch(function(error) {
    	throw error;
    });
  },

  /**
   * Add items to current menu
   *
   * @return  void
   */
  addItem: function(item) {
    this.DOMElement.appendChild(item);
  },

  /**
   * Create listeners for different elements of the Menu
   *
   * @return  void
   */
  listenEvents: function(){
    let _self = this;

    // Listener to submenu unfold
    this.getDOMElement().addEventListener('unfold', function(e){
      //Hide all SubMenus except the one with the event
      _self.hideAllSubmenusExcept(e.detail.secondaryMenu);

      // If is not a responsive Menu show the black overlay
      if (!_self.isResponsive) {
        _self.showBlackOverlay();
      }
    }, false);

    // Listen to submenu shrik
    this.getDOMElement().addEventListener('shrink', function(e){
      // If is not a responsive menu, hide the black overlay
      if (!_self.isResponsive) {
        _self.hideBlackOverlay();
      }
    }, false);

    // Listen to blackOverlay click
    this.blackOverlay.addEventListener("click", function() {
      //Close all elements when click to black overlay
      _self.closeAll();
    });
  },

  // Based on offcanvas Muscle [https://github.com/nosoycesaros/offcanvas-muscle] of my autorship

  /**
   * Find the toggle button for the menu
   * Set the open event
   *
   * @return  void
   */
  addResponsiveEvent: function(){
    let _self = this;
    let responsiveButton = document.getElementById(this.name + '-button');

    responsiveButton.addEventListener("click", function() {
        let targetMenu = this.getAttribute('offcanvas-menu');
        _self.toggleResponsiveMenu(targetMenu);
    });
  },

  /**
   * Close all open ellements:
   * Submenus, responsiveMenu, and Black Overlay
   *
   * @return  void
   */
  closeAll: function() {
    this.hideAllSubmenus();

    if (this.isResponsive) {
      this.closeResponsiveMenu();
    }

    this.hideBlackOverlay();
  },

  /**
   * Toggle the offcanvas menu and all his elements
   *
   * @return  void
   */
  toggleResponsiveMenu: function() {
      this.DOMElement.classList.toggle('open');

      let siteWrap = document.getElementsByClassName('site-wrap')[0];
      siteWrap.classList.toggle('open');

      if (this.DOMElement.classList.contains('left')) {
          siteWrap.classList.toggle('left');
      }

      // Added for this project
      var menuIcon = document.getElementsByClassName('menu-icon');
      menuIcon[0].classList.toggle('open');

      var mainLogo = document.getElementById('main-logo');
      mainLogo.classList.toggle('open');


      this.toggleBlackOverlay();
  },

  /**
   * Close all elements of the offcanvas menu
   *
   * @return  void
   */
  closeResponsiveMenu: function() {
    this.DOMElement.classList.remove('open');

    let siteWrap = document.getElementsByClassName('site-wrap')[0];
    siteWrap.classList.remove('open');

    if (this.DOMElement.classList.contains('left')) {
        siteWrap.classList.remove('left');
    }

    // Added for this project
    var menuIcon = document.getElementsByClassName('menu-icon');
    menuIcon[0].classList.remove('open');

    var mainLogo = document.getElementById('main-logo');
    mainLogo.classList.remove('open');
  },

  /**
   * Hide all submenus
   *
   * @return  void
   */
  hideAllSubmenus: function() {
    let subMenus = this.DOMElement.getElementsByClassName('secondary-menu');

    [].forEach.call(subMenus, function (subMenu) {
      subMenu.classList.remove('open');
    });
  },

  /**
   * Hide all submenus except the one given
   *
   * @return  void
   */
  hideAllSubmenusExcept: function(secondaryMenu) {
    let subMenus = this.DOMElement.getElementsByClassName('secondary-menu');

    [].forEach.call(subMenus, function (subMenu) {
      if (subMenu != secondaryMenu) {
        subMenu.classList.remove('open');
      }
    });
  },

  /** 
   * Show and hide the black overlay over the page
   *
   * @return  void
   */
  toggleBlackOverlay: function() {
    this.blackOverlay.classList.toggle('open');
  },

  /**
   * Show a black overlay over the page
   *
   * @return  void
   */
  showBlackOverlay: function() {
    this.blackOverlay.classList.add('open');
  },

  /**
   * Hide the black overlay over the page
   *
   * @return  void
   */
  hideBlackOverlay: function() {
    this.blackOverlay.classList.remove('open');
  },

  /**
   * Get the DOM object of this menu
   *
   * @return  void
   */
  getDOMElement: function() {
    return this.DOMElement;
  },
}


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

}


/*** LOAD MENU ***/
var primaryMenu = new Menu({name: 'primary-menu'});
primaryMenu.populate();

var responsiveMenu = new Menu({name: 'primary-responsive-menu'}, true);
responsiveMenu.populate();


window.addEventListener('resize', function(){
  primaryMenu.closeAll();
  responsiveMenu.closeAll();
}, false);
