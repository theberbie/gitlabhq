/* eslint-disable func-names, no-var, one-var, consistent-return, no-return-assign, prefer-arrow-callback, prefer-template, no-shadow, no-else-return */

import $ from 'jquery';
import RefSelectDropdown from './ref_select_dropdown';

export default class NewBranchForm {
  constructor(form, availableRefs) {
    this.validate = this.validate.bind(this);
    this.branchNameError = form.find('.js-branch-name-error');
    this.name = form.find('.js-branch-name');
    this.ref = form.find('#ref');
    new RefSelectDropdown($('.js-branch-select'), availableRefs); // eslint-disable-line no-new
    this.setupRestrictions();
    this.addBinding();
    this.init();
  }

  addBinding() {
    return this.name.on('blur', this.validate);
  }

  init() {
    if (this.name.length && this.name.val().length > 0) {
      return this.name.trigger('blur');
    }
  }

  setupRestrictions() {
    var endsWith, invalid, single, startsWith;
    startsWith = {
      pattern: /^(\/|\.)/g,
      prefix: "can't start with",
      conjunction: 'or',
    };
    endsWith = {
      pattern: /(\/|\.|\.lock)$/g,
      prefix: "can't end in",
      conjunction: 'or',
    };
    invalid = {
      pattern: /(\s|~|\^|:|\?|\*|\[|\\|\.\.|@\{|\/{2,}){1}/g,
      prefix: "can't contain",
      conjunction: ', ',
    };
    single = {
      pattern: /^@+$/g,
      prefix: "can't be",
      conjunction: 'or',
    };
    return (this.restrictions = [startsWith, invalid, endsWith, single]);
  }

  validate() {
    var errorMessage, errors, formatter, unique, validator;
    const { indexOf } = [];

    this.branchNameError.empty();
    unique = function(values, value) {
      if (indexOf.call(values, value) === -1) {
        values.push(value);
      }
      return values;
    };
    formatter = function(values, restriction) {
      var formatted;
      formatted = values.map(function(value) {
        switch (false) {
          case !/\s/.test(value):
            return 'spaces';
          case !/\/{2,}/g.test(value):
            return 'consecutive slashes';
          default:
            return "'" + value + "'";
        }
      });
      return restriction.prefix + ' ' + formatted.join(restriction.conjunction);
    };
    validator = (function(_this) {
      return function(errors, restriction) {
        var matched;
        matched = _this.name.val().match(restriction.pattern);
        if (matched) {
          return errors.concat(formatter(matched.reduce(unique, []), restriction));
        } else {
          return errors;
        }
      };
    })(this);
    errors = this.restrictions.reduce(validator, []);
    if (errors.length > 0) {
      errorMessage = $('<span/>').text(errors.join(', '));
      return this.branchNameError.append(errorMessage);
    }
  }
}
