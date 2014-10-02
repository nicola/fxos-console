function hey () {
  console.log("hey", Date.now());
}

function hoo () {
  console.log("hoo", Date.now());
}

window.addEventListener('DOMContentLoaded', function() {

  'use strict';

  setInterval(hey, 1000);
  setInterval(hoo, 1000);
});