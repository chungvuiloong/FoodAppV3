'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Snackbar = function () {
  function Snackbar() {
    _classCallCheck(this, Snackbar);

    this.view = document.body.appendChild(document.createElement('div'));
    this.view.classList.add('snackbar');
    this.isActive = false;
    this.queue = [];
    this.gap = 250;
    this.duration = 5000;
  }

  _createClass(Snackbar, [{
    key: 'show',
    value: function show(message) {
      var _this = this;

      if (this.isActive) {
        this.queue.push(message);
        return;
      }
      this.isActive = true;
      this.view.textContent = message;
      this.view.classList.add('snackbar--visible');
      this.queue.shift();
      setTimeout(function () {
        return _this.hide();
      }, this.duration);
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this2 = this;

      this.isActive = false;
      this.view.classList.remove('snackbar--visible');

      if (this.queue.length) {
        setTimeout(function () {
          return _this2.show(_this2.queue[0]);
        }, this.gap);
      }
    }
  }]);

  return Snackbar;
}();

exports.default = Snackbar;