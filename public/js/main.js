"use strict";

var primaryMenu = new Menu({name: 'primary-menu'});
var responsiveMenu = new Menu({name: 'primary-responsive-menu'}, true);

window.addEventListener('load', function(){

  // Populate primaryMenu
  primaryMenu.populate();

  // Populate responsiveMenu
  responsiveMenu.populate();
}, false);


window.addEventListener('resize', function(){
  primaryMenu.closeAll();
  responsiveMenu.closeAll();
}, false);
