"use strict";

window.addEventListener('load', function(){
  /*** LOAD MENU ***/
  var primaryMenu = new Menu({name: 'primary-menu'});
  primaryMenu.populate();

  var responsiveMenu = new Menu({name: 'primary-responsive-menu'}, true);
  responsiveMenu.populate();
}, false);


window.addEventListener('resize', function(){
  primaryMenu.closeAll();
  responsiveMenu.closeAll();
}, false);
