(function() {
  // refactoring
  function InputElement(option) {
    this.id = option.id;
    this.name = option.name;
    this.listener = option.listener;
    this.element = document.getElementById(this.id);
    this.element.addEventListener('change', this.listener);
  }

  InputElement.prototype.collect = function(target, mapper) {
    var value = this.element.value;

    if (value !== '') {
      if (this.element.type === 'number') {
        value = Number(value);
      }
      mapper = (typeof mapper === 'function') ? mapper : function(a) {return a;};
      target[this.name] = mapper(value);
    }
  };

  InputElement.prototype.dump = InputElement.prototype.collect;

  InputElement.prototype.restore = function(source) {
    if (this.name in source && source[this.name] !== '') {
      this.element.value = source[this.name];
    }
  };

  function TextBox(option) {
    InputElement.call(this, option);
  }

  function SelectBox(option) {
    InputElement.call(this, option);
  }

  function BooleanSelectBox(option) {
    InputElement.call(this, option);
  }

  _inherits(InputElement, TextBox);
  _inherits(InputElement, SelectBox);
  _inherits(InputElement, BooleanSelectBox);

  BooleanSelectBox.prototype.collect = function(target) {
    var value = this.element.value;

    if (value !== '') {
      target[this.name] = (value === 'true');
    }
  };

  BooleanSelectBox.prototype.dump = BooleanSelectBox.prototype.collect;

  function DummyConfig(option) {
    var _listener = option.listener;
    this.basic = new BasicConfig({listener: _listener});
    this.template = new TemplateConfig({listener: _listener});
  }

  function BasicConfig(option) {
    var _listener = option.listener;
    var _name = 'basic';
    var _inputElements = [
      new SelectBox({id: _name + '_template', name: 'template', listener: _listener}),
      new BooleanSelectBox({id: _name + '_reverseArrow', name: 'reverseArrow', listener: _listener}),
      new SelectBox({id: _name + '_orientation', name: 'orientation', listener: _listener}),
      new SelectBox({id: _name + '_mode', name: 'mode', listener: _listener}),
      new TextBox({id: _name + '_author', name: 'author', listener: _listener})
    ];

    this.collect = function(target) {
      _inputElements.forEach(function(inputElement) {
        inputElement.collect(target);
      });
    };
  }

  function TemplateConfig(option) {
    var _listener = option.listener;
    var _name = 'template';
    var _colors = new TextBox({id: _name + '_colors', name: 'colors', listener: _listener});
    var _childOption = {
      parentName: _name,
      listener: _listener
    };
    var _arrow = new ArrowTemplate(_childOption);
    var _branch = new BranchTemplate(_childOption);
    var _commit = new CommitTemplate(_childOption);

    this.collect = function(target) {
      _colors.collect(target, function(text) {
        return text.replace(/ */g, '').split(',');
      });
      _arrow.collect(target);
      _branch.collect(target);
      _commit.collect(target);
    };
  }

  function ArrowTemplate(option) {
    var _parentName = option.parentName;
    var _name = 'arrow';
    var _idPrefix = _parentName + '_' + _name;
    var _listener = option.listener;
    var _inputElements = [
      new TextBox({id: _idPrefix + '_color', name: 'color', listener: _listener}),
      new TextBox({id: _idPrefix + '_size', name: 'size', listener: _listener}),
      new TextBox({id: _idPrefix + '_offset', name: 'offset', listener: _listener})
    ];

    this.collect = function(target) {
      if (!(_name in target)) {
        target[_name] = {};
      }
      _inputElements.forEach(function(inputElement) {
        inputElement.collect(target[_name]);
      });
    };
  }

  function BranchTemplate(option) {
    var _listener = option.listener;
    var _parentName = option.parentName;
    var _name = 'branch';
    var _idPrefix = _parentName + '_' + _name;
    var _inputElements = [
      new TextBox({id: _idPrefix + '_color', name: 'color', listener: _listener}),
      new TextBox({id: _idPrefix + '_lineWidth', name: 'lineWidth', listener: _listener}),
      new SelectBox({id: _idPrefix + '_mergeStyle', name: 'mergeStyle', listener: _listener}),
      new TextBox({id: _idPrefix + '_spacingX', name: 'spacingX', listener: _listener}),
      new TextBox({id: _idPrefix + '_spacingY', name: 'spacingY', listener: _listener}),
      new BooleanSelectBox({id: _idPrefix + '_showLabel', name: 'showLabel', listener: _listener}),
      new TextBox({id: _idPrefix + '_labelColor', name: 'labelColor', listener: _listener}),
      new TextBox({id: _idPrefix + '_labelFont', name: 'labelFont', listener: _listener})
    ];

    this.collect = function(target) {
      if (!(_name in target)) {
        target[_name] = {};
      }
      _inputElements.forEach(function(inputElement) {
        inputElement.collect(target[_name]);
      });
    };
  }

  function CommitTemplate(option) {
    var _listener = option.listener;
    var _parentName = option.parentName;
    var _name = 'commit';
    var _idPrefix = _parentName + '_' + _name;
    var _inputElements = [
      new TextBox({id: _idPrefix + '_spacingX', name: 'spacingX', listener: _listener}),
      new TextBox({id: _idPrefix + '_spacingY', name: 'spacingY', listener: _listener}),
      new TextBox({id: _idPrefix + '_widthExtension', name: 'widthExtension', listener: _listener}),
      new TextBox({id: _idPrefix + '_color', name: 'color', listener: _listener})
    ];
    var _dotTemplate = new DotTemplate({
      listener: _listener,
      parentName: _idPrefix
    });
    var _messageTemplate = new MessageTemplate({
      listener: _listener,
      parentName: _idPrefix
    });

    this.collect = function(target) {
      if (!(_name in target)) {
        target[_name] = {};
      }
      _inputElements.forEach(function(inputElement) {
        inputElement.collect(target[_name]);
      });
      _dotTemplate.collect(target[_name]);
      _messageTemplate.collect(target[_name]);
    };
  }

  function DotTemplate(option) {
    var _listener = option.listener;
    var _parentName = option.parentName;
    var _name = 'dot';
    var _idPrefix = _parentName + '_' + _name;
    var _inputElements = [
      new TextBox({id: _idPrefix + '_color', name: 'color', listener: _listener}),
      new TextBox({id: _idPrefix + '_size', name: 'size', listener: _listener}),
      new TextBox({id: _idPrefix + '_strokeWidth', name: 'strokeWidth', listener: _listener}),
      new TextBox({id: _idPrefix + '_strokeColor', name: 'strokeColor', listener: _listener})
    ];

    this.collect = function(target) {
      if (!(_name in target)) {
        target[_name] = {};
      }
      _inputElements.forEach(function(inputElement) {
        inputElement.collect(target[_name]);
      });
    };
  }

  function MessageTemplate(option) {
    var _listener = option.listener;
    var _parentName = option.parentName;
    var _name = 'message';
    var _idPrefix = _parentName + '_' + _name;
    var _inputElements = [
      new TextBox({id: _idPrefix + '_color', name: 'color', listener: _listener}),
      new BooleanSelectBox({id: _idPrefix + '_display', name: 'display', listener: _listener}),
      new BooleanSelectBox({id: _idPrefix + '_displayAuthor', name: 'displayAuthor', listener: _listener}),
      new BooleanSelectBox({id: _idPrefix + '_displayBranch', name: 'displayBranch', listener: _listener}),
      new BooleanSelectBox({id: _idPrefix + '_displayHash', name: 'displayHash', listener: _listener}),
      new TextBox({id: _idPrefix + '_font', name: 'font', listener: _listener}),
      new BooleanSelectBox({id: _idPrefix + '_shouldDisplayTooltipsInCompactMode', name: 'shouldDisplayTooltipsInCompactMode', listener: _listener})
    ];

    this.collect = function(target) {
      if (!(_name in target)) {
        target[_name] = {};
      }
      _inputElements.forEach(function(inputElement) {
        inputElement.collect(target[_name]);
      });
    };
  }



  function _inherits(SuperClass, SubClass) {
      var f = function() {};
      f.prototype = SuperClass.prototype;
      SubClass.prototype = new f();
      SubClass.prototype.constructor = SubClass;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  var dummyConfig = new DummyConfig({
    listener: function() {
      draw();
    }
  });
  var storage = new Storage();
  storage.load();

  var graph = new Graph();
  var editor = new Editor();
  editor.setRawText(storage.getEditorText());
  editor.setListener(draw);

  var config = new Config();
  _rebuildBranchOption(storage);
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

      var basicOption = {};
      dummyConfig.basic.collect(basicOption);
      basicOption.template = _createTemplate(basicOption);
      
      var git = new GitGraphWrapperExtention(basicOption);

      git.defaultOptions({
        branch: _createBranchOption()
      });

      for (var i=0; i<commands.length; i++) {
        var command = commands[i];
        command.invoke(git);
      }
    };

    function _createBranchOption() {
      var branchDefaultOptions = {};

      for (var key in config) {
        var branchOptionKey = new BranchOptionKey(key);
        if (branchOptionKey.isBranchOption()) {
          var value = config[key];
          var branchName = branchOptionKey.getBranchName();
          var optionName = branchOptionKey.getOptionName();
          if (!(branchName in branchDefaultOptions)) {
            branchDefaultOptions[branchName] = {};
          }

          if (value !== '') {
            var commitDefaultOptionRegExp = /^commitDefaultOptions_(.*)$/.exec(optionName);

            if (optionName === 'showLabel') {
              branchDefaultOptions[branchName][optionName] = value === 'true';
            } if (commitDefaultOptionRegExp) {
              var optName = commitDefaultOptionRegExp[1];

              if (!('commitDefaultOptions' in branchDefaultOptions[branchName])) {
                branchDefaultOptions[branchName].commitDefaultOptions = {};
              }

              branchDefaultOptions[branchName].commitDefaultOptions[optName] = value;
            } else {
              branchDefaultOptions[branchName][optionName] = value;
            }
          }
        }
      }

      return branchDefaultOptions;
    }

    function _createTemplate(basicOption) {
      var tmpObject = new GitGraph.Template().get(basicOption.template);

      dummyConfig.template.collect(tmpObject);

      return tmpObject;
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
    };

    var _elements = {};
    var _listener = function() {};
    var _self = this;

    this.apply = function(obj) {
      for (var key in obj) {
        var branchOptionKey = new BranchOptionKey(key);

        if (branchOptionKey.isBranchOption()) {
          _initElement(key);
          _setValue(key, obj[key]);
        }
      }
    };

    function _setValue(key, value) {
      _self[key] = value;
      _elements[key].setValue(_self[key]);
    }

    this.reset = function() {
      this.apply(_defaults);
    };

    this.setListener = function(listener) {
      _listener = listener;
    };

    this.addBranchOption = function(name) {
      _initElement('branch_' + name + '_color');
      _initElement('branch_' + name + '_lineWidth');
      _initElement('branch_' + name + '_showLabel');
      _initElement('branch_' + name + '_commitDefaultOptions_color');
      _initElement('branch_' + name + '_commitDefaultOptions_messageColor');
      _initElement('branch_' + name + '_commitDefaultOptions_labelColor');
      _initElement('branch_' + name + '_commitDefaultOptions_dotColor');
    };

    this.removeBranchOption = function(name) {
      for (var key in _elements) {
        var branchOptionKey = new BranchOptionKey(key);
        var branchName = branchOptionKey.getBranchName();

        if (branchOptionKey.isBranchOption() && branchName === name) {
          delete this[key];
          delete _elements[key];
        }
      }
    };

    function _initElement(elementId) {
      _elements[elementId] = new Element(document.getElementById(elementId));
      _elements[elementId].addEventListener(_onChange);
      _self[elementId] = _elements[elementId].getValue();
    }

    function _onChange() {
      for (var key in _elements) {
        _self[key] = _elements[key].getValue();
      }

      _listener();
    }

    this.reset();
  }

  function BranchOptionKey(key) {
    var _regexp = new RegExp("^branch_([^_]*)_(.*)$").exec(key);

    this.getKey = function() {
      return key;
    };

    this.getBranchName = function() {
      return this.isBranchOption() ? _regexp[1] : null;
    };

    this.getOptionName = function() {
      return this.isBranchOption() ? _regexp[2] : null;
    };

    this.isBranchOption = function() {
      return !!_regexp;
    };
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

    draw();
  });

  function _rebuildBranchOption(storage) {
    for (var key in storage.getConfigObj()) {
      var branchOptionKey = new BranchOptionKey(key);

      if (branchOptionKey.isBranchOption()) {
        _addBranchOptionArea(branchOptionKey.getBranchName());
      }
    }
  }

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
