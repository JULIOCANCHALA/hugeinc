/*
 * Code created by Cesar Zapata [https://github.com/nosoycesaros]
 * Date: 26.02.2016
 */

"use strict";

// Create the menu objects
var primaryMenu = new Menu({name: 'primary-menu'});
var responsiveMenu = new Menu({name: 'primary-responsive-menu'}, true);

// When the window is ready
window.addEventListener('load', function(){

  // Populate primaryMenu
  primaryMenu.populate();

  // Populate responsiveMenu
  responsiveMenu.populate();
}, false);

// Close all if window is resized
window.addEventListener('resize', function(){
  primaryMenu.closeAll();
  responsiveMenu.closeAll();
}, false);
