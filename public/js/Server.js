/*
 * Code created by Cesar Zapata [https://github.com/nosoycesaros]
 * For the Huge Navigation Exercise
 * Date: 26.02.2016
 */

var Server = window.Server = (function(window, document, undefined) {

  "use strict";

  var APIUrlPrefix = '/api';

  const XHR_DONE = 4;
  const HTTP_OK  = 200;

  function get(url) {
	url = APIUrlPrefix + '/' + url;

    return new Promise(function(resolve, reject) {
      let request = fetch(url, 'GET', resolve, reject);
      request.send();
    });
  }

  function fetch(url, method, resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'text';

    xhr.onload = function() {
      if(xhr.readyState === XHR_DONE && xhr.status === HTTP_OK) {
        resolve(xhr.response);
      }
      else {
        reject(Error(xhr.statusText));
      }
    };

    xhr.onerror = function() {
      reject(Error('Network Error'));
    };

    return xhr;
  };

  return {
    get: get
  };
})(window, document);
