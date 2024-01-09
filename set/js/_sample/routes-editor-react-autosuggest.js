function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var languages = [{
  name: 'C',
  year: 1972
}, {
  name: 'C#',
  year: 2000
}, {
  name: 'C++',
  year: 1983
}, {
  name: 'Clojure',
  year: 2007
}, {
  name: 'Elm',
  year: 2012
}, {
  name: 'Go',
  year: 2009
}, {
  name: 'Haskell',
  year: 1990
}, {
  name: 'Java',
  year: 1995
}, {
  name: 'Javascript',
  year: 1995
}, {
  name: 'Perl',
  year: 1987
}, {
  name: 'PHP',
  year: 1995
}, {
  name: 'Python',
  year: 1991
}, {
  name: 'Ruby',
  year: 1995
}, {
  name: 'Scala',
  year: 2003
}];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  var escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  var regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(function (language) {
    return regex.test(language.name);
  });
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion, _ref) {
  var query = _ref.query;

  var matches = AutosuggestHighlightMatch(suggestion.name, query);
  var parts = AutosuggestHighlightParse(suggestion.name, matches);

  return React.createElement(
    'span',
    null,
    parts.map(function (part, index) {
      var className = part.highlight ? 'react-autosuggest__suggestion-match' : null;

      return React.createElement(
        'span',
        { className: className, key: index },
        part.text
      );
    })
  );
}

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this));

    _this.onChange = function (event, _ref2) {
      var newValue = _ref2.newValue;
      var method = _ref2.method;

      _this.setState({
        value: newValue
      });
    };

    _this.onSuggestionsFetchRequested = function (_ref3) {
      var value = _ref3.value;

      _this.setState({
        suggestions: getSuggestions(value)
      });
    };

    _this.onSuggestionsClearRequested = function () {
      _this.setState({
        suggestions: []
      });
    };

    _this.state = {
      value: '',
      suggestions: []
    };
    return _this;
  }

  App.prototype.render = function render() {
    var _state = this.state;
    var value = _state.value;
    var suggestions = _state.suggestions;

    var inputProps = {
      placeholder: "Type 'c'",
      value: value,
      onChange: this.onChange,
      className: "form-control"
    };

    return React.createElement(Autosuggest, {
      suggestions: suggestions,
      onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.onSuggestionsClearRequested,
      getSuggestionValue: getSuggestionValue,
      renderSuggestion: renderSuggestion,
      inputProps: inputProps
    });
  };

  return App;
}(React.Component);
