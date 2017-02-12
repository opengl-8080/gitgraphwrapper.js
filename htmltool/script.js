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
        template: _createTemplate(),
        reverseArrow: config.reverseArrow,
        orientation: config.orientation,
        mode: config.mode,
        author: config.author === '' ? null : config.author
      });

      var branchDefaultOptions = {};
      for (var key in config) {
        if (/^branch_/.test(key)) {
          var value = config[key];
          var matchResult = /_([^_]+)_(.*)/.exec(key);
          var branchName = matchResult[1];
          var optionName = matchResult[2];
          if (!(branchName in branchDefaultOptions)) {
            branchDefaultOptions[branchName] = {};
          }
          branchDefaultOptions[branchName][optionName] = value;
        }
      }
      git.defaultOptions({
        branch: branchDefaultOptions
      });

      for (var i=0; i<commands.length; i++) {
        var command = commands[i];
        command.invoke(git);
      }
    };

    function _createTemplate() {
      var template = new GitGraph.Template().get(config.template);
      
      if (config.colors !== '') {
        var colors = config.colors.split(',');
        template.colors = colors;
      }

      // arrow
      if (config.arrowColor) {
        template.arrow.color = config.arrowColor;
      }
      if (config.arrowSize) {
        template.arrow.size = config.arrowSize;
      }
      if (config.arrowOffset) {
        template.arrow.offset = config.arrowOffset;
      }

      // branch
      if (config.branchColor) {
        template.branch.color = config.branchColor;
      }
      if (config.branchLineWidth) {
        template.branch.lineWidth = config.branchLineWidth;
      }
      if (config.branchMergeStyle) {
        template.branch.mergeStyle = config.branchMergeStyle;
      }
      if (config.branchSpacingX) {
        template.branch.spacingX = config.branchSpacingX;
      }
      if (config.branchSpacingY) {
        template.branch.spacingY = config.branchSpacingY;
      }
      if (config.branchShowLabel) {
        template.branch.showLabel = config.branchShowLabel === 'true';
      }
      if (config.branchLabelColor) {
        template.branch.labelColor = config.branchLabelColor;
      }
      if (config.branchLabelFont) {
        template.branch.labelFont = config.branchLabelFont;
      }

      // commit
      if (config.commitSpacingX) {
        template.commit.spacingX = config.commitSpacingX;
      }
      if (config.commitSpacingY) {
        template.commit.spacingY = config.commitSpacingY;
      }
      if (config.commitWidthExtension) {
        template.commit.widthExtension = config.commitWidthExtension;
      }
      if (config.commitColor) {
        template.commit.color = config.commitColor;
      }
      if (config.commitShouldDisplayTooltipsInCompactMode) {
        template.commit.shouldDisplayTooltipsInCompactMode = config.commitShouldDisplayTooltipsInCompactMode === 'true';
      }

      // commit.dot
      if (config.commitDotColor) {
        template.commit.dot.color = config.commitDotColor;
      }
      if (config.commitDotSize) {
        template.commit.dot.size = config.commitDotSize;
      }
      if (config.commitDotStrokeWidth) {
        template.commit.dot.strokeWidth = config.commitDotStrokeWidth;
      }
      if (config.commitDotStrokeColor) {
        template.commit.dot.strokeColor = config.commitDotStrokeColor;
      }

      // commit.message
      if (config.commitMessageColor) {
        template.commit.message.color = config.commitMessageColor;
      }
      if (config.commitMessageDisplay) {
        template.commit.message.display = config.commitMessageDisplay === 'true';
      }
      if (config.commitMessageDisplayAuthor) {
        template.commit.message.displayAuthor = config.commitMessageDisplayAuthor === 'true';
      }
      if (config.commitMessageDisplayBranch) {
        template.commit.message.displayBranch = config.commitMessageDisplayBranch === 'true';
      }
      if (config.commitMessageDisplayHash) {
        template.commit.message.displayHash = config.commitMessageDisplayHash === 'true';
      }
      if (config.commitMessageFont) {
        template.commit.message.font = config.commitMessageFont;
      }

      return template;
    }

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
    var _defaults = {
      template: 'metro',
      orientation: 'vertical',
      mode: '',
      author: '',
      reverseArrow: false,
      colors: '',
      arrowColor: '',
      arrowSize: '',
      arrowOffset: '',
      branchColor: '',
      branchLineWidth: '',
      branchMergeStyle: '',
      branchSpacingX: '',
      branchSpacingY: '',
      branchShowLabel: '',
      branchLabelColor: '',
      branchLabelFont: '',
      commitSpacingX: '',
      commitSpacingY: '',
      commitWidthExtension: '',
      commitColor: '',
      commitDotColor: '',
      commitDotSize: '',
      commitDotStrokeWidth: '',
      commitMessageColor: '',
      commitMessageDisplay: '',
      commitMessageDisplayAuthor: '',
      commitMessageDisplayBranch: '',
      commitMessageDisplayHash: '',
      commitMessageFont: '',
      commitShouldDisplayTooltipsInCompactMode: ''
    };

    var _elements = {};
    var _listener = function() {};
    var _self = this;

    for (var key in _defaults) {
      _initElement(key);
    }

    this.apply = function(obj) {
      for (var key in _defaults) {
        this[key] = obj[key] || _defaults[key];
        _elements[key].setValue(this[key]);
      }

      for (var key in obj) {
        var matchResult = /^branch_([^_]+)_.*$/.exec(key);
        if (matchResult) {
          _defaults['branch_' + matchResult[1] + '_color'] = '';
          _addBranchOptionArea(matchResult[1]);
          _initElement(key);
          this[key] = obj[key];
          _elements[key].setValue(this[key]);
        }
      }
    };

    this.reset = function() {
      this.apply(_defaults);
    };

    this.setListener = function(listener) {
      _listener = listener;
    };

    this.addBranchOption = function(name) {
      _defaults['branch_' + name + '_color'] = '';

      for (var key in _defaults) {
        if (new RegExp('^branch_' + name, 'g').test(key)) {
          _initElement(key);
        }
      }
    };

    this.removeBranchOption = function(name) {
      for (var key in _defaults) {
        if (new RegExp('^branch_' + name).test(key)) {
          delete _defaults[key];
          delete this[key];
          delete _elements[key];
        }
      }
    };

    function _initElement(elementId) {
      _elements[elementId] = new Element(document.getElementById(elementId));
      _elements[elementId].addEventListener(_onChange);
      _self[key] = _elements[elementId].getValue();
    }

    function _onChange() {
      for (var key in _defaults) {
        _self[key] = _elements[key].getValue();
      }

      _listener();
    }

    this.reset();
  }

  function Element(e) {
    this.getValue = function() {
      if (_isCheckbox()) {
        return e.checked;
      } else if (e.type === 'number') {
        return Number(e.value);
      } else {
        return e.value;
      }
    };

    this.setValue = function(value) {
      if (_isCheckbox()) {
        e.checked = value;
      } else {
        e.value = value;
      }
    };

    this.addEventListener = function(listener) {
      e.addEventListener('change', listener);
    };

    function _isCheckbox() {
      return e.type === 'checkbox';
    }
  }

  var bottomArea = document.getElementById('bottom-area');
  var expand = document.getElementById('expand');
  expand.addEventListener('click', function() {
    if (bottomArea.style.height === '') {
      bottomArea.style.height = '80%';
      expand.innerText = 'expand↓';
    } else {
      bottomArea.style.height = '';
      expand.innerText = 'expand↑';
    }
  });


  var newBranchName = document.getElementById('newBranchName');

  document.getElementById('addNewBranchOptionButton').addEventListener('click', function() {
    var name = newBranchName.value;

    _addBranchOptionArea(name);

    config.addBranchOption(name);
  });

  function _addBranchOptionArea(name) {
    // skip if aleady exists
    if (document.getElementById(name)) {
      return;
    }

    var newBranchesTarget = document.getElementById('newBranchesTarget');

    var newBranchOptionTemplate = document.getElementById('newBranchOptionTemplate');
    var html = newBranchOptionTemplate.innerText;
    html = html.replace(/\${name}/g, name);

    var div = document.createElement('div');
    div.innerHTML = html;

    newBranchesTarget.appendChild(div);

    var removeButton = document.getElementById(name + '_remove');
    removeButton.addEventListener('click', function() {
      newBranchesTarget.removeChild(div);
      config.removeBranchOption(name);
      draw();
    });
  }
})();
