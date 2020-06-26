!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t,n){},,function(e,t,n){"use strict";function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}n.r(t);var o=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,o;return t=e,o=[{key:"createNodeWithText",value:function(e,t){var n,r=document.createElement(e);if("string"!=typeof e)throw Error("First argument must be valid node string");Array.isArray(t)&&(n=t.join(" "));for(var o=arguments.length,i=new Array(o>2?o-2:0),u=2;u<o;u++)i[u-2]=arguments[u];return i&&(n="".concat(t," ").concat(i.join(" "))),r.appendChild(document.createTextNode(n||t)),r}}],(n=null)&&r(t.prototype,n),o&&r(t,o),e}(),i=JSON.parse(localStorage.getItem("model"))||{};function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,r;return t=e,r=[{key:"subscribe",value:function(t,n,r){var o=n||"any",i=e.subscribers;void 0===i[o]&&(i[o]=[]),i[n].push({fn:t,context:r||this})}},{key:"unsubscribe",value:function(e,t,n){this.visitSubscribers("unsubscribe",e,t,n)}},{key:"publish",value:function(e,t){this.visitSubscribers("publish",e,t)}},{key:"visitSubscribers",value:function(t,n,r,o){var i=r||"any",u=e.subscribers[i];u.forEach((function(e,r){"publish"===t?e.fn.call(e.context,n):e===n&&e.context===o&&u.splice(r,1)}))}},{key:"getList",value:function(){return i}},{key:"add",value:function(e){return i.push(e)}},{key:"remove",value:function(e){return i.splice("string"==typeof e?i.indexOf(e):e)}},{key:"empty",value:function(){return i.splice(0,i.length)}},{key:"save",value:function(){return localStorage.setItem("model",JSON.stringify(i))}},{key:"autoSave",value:function(e,t){return e(t),this.save()}},{key:"autoSaveAndPublish",value:function(e,t,n,r){return this.autoSave(e,t),this.publish(n,r)}}],(n=null)&&c(t.prototype,n),r&&c(t,r),e}();a(s,"subscribers",{any:[]}),a(s,"interface",{updateList:function(e,t){if("string"!=typeof e)throw Error("First parameter must be a string defining the type of action");if("add"===e&&"object"===u(t))s.autoSaveAndPublish(s.add,t,i,"modelUpdate");else if("add"===e&&"object"!==u(t))throw Error("If action is to add, second parameter must an object");if("remove"===e&&"number"==typeof t)s.autoSaveAndPublish(s.remove,t,i,"modelUpdate");else if("remove"===e&&"number"!=typeof t)throw Error("If action is to delete, second parameter must be an index");"empty"===e&&s.autoSaveAndPublish(s.empty,null,i,"modelUpdate")},subscribe:s.subscribe,unsubscribe:s.unsubscribe,getList:s.getList});var l=s.interface;function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function b(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function d(e,t){return(d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function y(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=h(e);if(t){var o=h(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return m(this,n)}}function m(e,t){return!t||"object"!==f(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function h(e){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var v=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&d(e,t)}(u,e);var t,n,r,i=y(u);function u(){return p(this,u),i.apply(this,arguments)}return t=u,(n=[{key:"init",value:function(){this.listNode=document.getElementById("list-view"),this.input=document.getElementById("task"),this.submit=document.getElementById("submit-form"),this.clear=document.getElementById("clear-list"),this.submit.addEventListener("click",this.handleSubmit.bind(this)),this.clear.addEventListener("click",(function(){l.updateList("empty")})),l.subscribe(this.render,"modelUpdate",this),this.render(l.getList())}},{key:"render",value:function(e){var t,n,r,i,u=document.createDocumentFragment(),c=e.length-1;for(this.listNode.innerHTML="";c>=0;c-=1)r=e[c],(n=document.createElement("input")).setAttribute("type","checkbox"),r.completed&&(n.checked=!0),(i=o.createNodeWithText("span"," x;")).addEventListener("click",function(e,t){return function(){return l.updateList("remove",e),t.render()}}(c,this)),(t=o.createNodeWithText("li",r.task)).appendChild(n),t.appendChild(i),u.appendChild(t);return this.listNode.appendChild(u)}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=this.input.value;return t?l.updateList("add",{completed:!1,task:t}):this}}])&&b(t.prototype,n),r&&b(t,r),u}(o);n(0);(new v).init()}]);