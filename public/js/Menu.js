var Menu = window.Menu = (function(window, document, MenuItem, undefined) {
  'use strict';

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
      		return new MenuItem(menuItemAttrs, _self.isResponsive);
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
  };

  return Menu;
})(window, document, window.MenuItem);
