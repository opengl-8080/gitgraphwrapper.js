(function() {
  var storage = new Storage();
  storage.load();

  var graph = new Graph();
  var editor = new Editor();
  editor.setRawText(storage.getEditorText());
  editor.setListener(draw);

  var config = new Config();
  config.apply(storage.getConfigObj());
  config.setListener(draw);

  draw();

  function draw() {
    var commands = editor.getCommands();
    graph.draw(commands);

    storage.save(editor, config);
  }






  function Graph() {
    var _target = document.getElementById('target');

    this.draw = function(commands) {
      _refreshCanvas();
      
      var git = new GitGraphWrapperExtention({
        template: config.template,
        orientation: config.orientation,
        mode: config.mode,
        author: config.author
      });

      for (var i=0; i<commands.length; i++) {
        var command = commands[i];
        command.invoke(git);
      }
    };

    function _refreshCanvas() {
      _removeCurrentCanvas();
      var canvas = _createCanvas();
      _target.appendChild(canvas);
    }

    function _removeCurrentCanvas() {
      if (_target.childNodes.length !== 0) {
        _target.removeChild(_target.firstChild);
      }
    }

    function _createCanvas() {
      var canvas = document.createElement('canvas');
      canvas.id = 'gitGraph';
      return canvas;
    }
  }

  function Command(line) {
    var _elements = _normalize(line);
    var _method = _elements[0];
    var _arguments = _elements.slice(1);

    this.invoke = function(git) {
      if (!(typeof git[_method] === 'function')) {
        return;
      }

      try {
        git[_method].apply(git, _arguments);
      } catch (e) {
        console.warn(e);
      }
    };

    function _normalize(line) {
      var elements = line.split(' ');
      var result = [];

      for (var i=0; i<elements.length; i++) {
        var element = elements[i]

        // remove empty strings
        if (element !== '') {
          result.push(element);
        }
      }

      return result;
    }
  }

  function Editor() {
    var _editor = document.getElementById('editor');
    var _timeoutKey;

    this.setListener = function(listener) {
      _editor.addEventListener('keyup', function() {
        if (_timeoutKey) {
          clearTimeout(_timeoutKey);
        }

        _timeoutKey = setTimeout(function() {
          try {
            listener();
          } finally {
            _timeoutKey = null;
          }
        }, 500);
      });
    };

    this.getCommands = function() {
      var commands = [];
      
      var lines = _editor.value.split('\n');
      for (var i=0; i<lines.length; i++) {
        var line = lines[i].trim();

        if (line.length !== 0) {
          commands.push(new Command(line));
        }
      }

      return commands;
    };

    this.getRawText = function() {
      return _editor.value;
    };

    this.setRawText = function(value) {
      _editor.value = value;
    };
  }

  function Storage() {
    var KEY = "gitgraph.storage";
    var _editor;
    var _config;

    this.save = function(editor, config) {
      var obj = {
        editor: editor.getRawText(),
        config: config
      };

      localStorage.setItem(KEY, JSON.stringify(obj));
    };

    this.load = function() {
      var json = localStorage.getItem(KEY);
      if (typeof json === 'string') {
        var obj = JSON.parse(json);
        _editor = obj.editor;
        _config = obj.config;
      } else {
        _editor = '';
        _config = {};
      }
    };

    this.getEditorText = function() {
      return _editor;
    };

    this.getConfigObj = function() {
      return _config;
    };

    this.remove = function() {
      localStorage.removeItem(KEY);
    };
  }


  function Config() {
    var _defauls = {
      template: 'metro',
      orientation: 'vertical',
      mode: '',
      author: ''
    };

    var _elements = {};
    for (var key in _defauls) {
      _elements[key] = document.getElementById(key);
    }

    var _listener = function() {};
    var _self = this;

    for (var key in _defauls) {
      this[key] = _elements[key].value;
    }

    this.apply = function(obj) {
      for (var key in _defauls) {
        _elements[key].value = this[key] = obj[key] || _defauls[key];
      }
    };

    this.reset = function() {
      this.apply(_defauls);
    };

    this.setListener = function(listener) {
      _listener = listener;
    };

    for (var key in _defauls) {
      _elements[key].addEventListener('change', _onChange);
    }

    function _onChange() {
      for (var key in _defauls) {
        _self[key] = _elements[key].value;
      }

      _listener();
    }

    this.reset();
  }
})();
