(function() {
  // refactoring
  function InputElement(option) {
    this.name = option.name;
    this.id = option.parentName + '_' + this.name;
    this.listener = option.listener;
    this.element = document.getElementById(this.id);
    this.element.addEventListener('change', this.listener);
  }

  InputElement.prototype.collect = function(target) {
    var value = this.element.value;

    if (value !== '') {
      if (this.element.type === 'number') {
        value = Number(value);
      }
      target[this.name] = this.mapValue(value);
    }
  };

  InputElement.prototype.mapValue = function(value) {
    return value;
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

  function TemplateColorsOption(option) {
    InputElement.call(this, option);
  }

  _inherits(InputElement, TextBox);
  _inherits(InputElement, SelectBox);
  _inherits(InputElement, BooleanSelectBox);
  _inherits(InputElement, TemplateColorsOption);

  BooleanSelectBox.prototype.mapValue = function(value) {
    return value === 'true';
  };

  TemplateColorsOption.prototype.mapValue = function(value) {
    return value.replace(/ */g, '').split(',');
  };

  function DummyOption(option) {
    var _self = this;
    var _listener = option.listener;
    var _name = 'option';
    var _base = new BaseOption({parentName: _name, listener: _listener});
    var _template = new TemplateOption({parentName: _name, listener: _listener});
    var _branchOptions = {};
    
    this.collectOpiton = function() {
      // collect base options
      var baseOption = {};
      _base.collect(baseOption);
      
      // collect template options
      var option = baseOption.base;
      option.template = new GitGraph.Template().get(baseOption.base.template);
      _template.collect(option);

      // collect branch options
      option.branch = {};
      for (var branchName in _branchOptions) {
        _branchOptions[branchName].collect(option.branch);
      }

      return option;
    };

    this.addBranch = function(branchName) {
      // skip if aleady exists
      if (document.getElementById(branchName)) {
        return;
      }

      var html = _createHtml(branchName);
      _appendHtml(branchName, html);
      _initRemoveButton(branchName);

      _branchOptions[branchName] = new BranchOption({
        parentName: _name + '_branch',
        listener: _listener,
        branchName: branchName
      });
    };

    function _createHtml(branchName) {
      var html = document.getElementById('newBranchOptionTemplate').innerText;
      return html.replace(/\${branchName}/g, branchName);
    }

    function _appendHtml(branchName, html) {
      var div = document.createElement('div');
      div.innerHTML = html;
      div.id = branchName + '_options';

      document.getElementById('newBranchesTarget').appendChild(div);
    }

    function _initRemoveButton(branchName) {
      document.getElementById(branchName + '_remove').addEventListener('click', function() {
        _self.removeBranch(branchName);
        draw();
      });
    }

    this.removeBranch = function(branchName) {
      var branchArea = document.getElementById(branchName + "_options");
      document.getElementById('newBranchesTarget').removeChild(branchArea);

      delete _branchOptions[branchName];
    };
  }

  _inherits(AbstractOption, BaseOption);
  _inherits(AbstractOption, TemplateOption);
  _inherits(AbstractOption, TemplateArrowOption);
  _inherits(AbstractOption, TemplateBranchOption);
  _inherits(AbstractOption, TemplateCommitOption);
  _inherits(AbstractOption, TemplateDotOption);
  _inherits(AbstractOption, TemplateMessageOption);
  _inherits(AbstractOption, BranchOption);
  _inherits(AbstractOption, BranchCommitDefaultOption);

  function AbstractOption(option) {
    this.parentName = option.parentName;
    this.listener = option.listener;
    this.children = [];
  }

  AbstractOption.prototype.collect = function(target) {
    var _self = this;

    if (!(_self.name in target)) {
      target[_self.name] = {};
    }

    _self.children.forEach(function(child) {
      child.collect(target[_self.name]);
    });
  };

  AbstractOption.prototype.initName = function(name) {
    this.name = name;
    this.idPrefix = this.parentName + '_' + this.name;
  };

  AbstractOption.prototype.initChildren = function(children) {
    for (var i=0; i<children.length; i++) {
      var child = children[i].newInstance({
        parentName: this.idPrefix,
        listener: this.listener
      });

      this.children.push(child);
    }
  };

  /**
   * create child builder object.
   * child is InputElement or Option class.
   */
  function child(constructorFunction, name) {
    return {
      newInstance: function(option) {
        option.name = name; // only child is InputElement instance.
        return new constructorFunction(option);
      }
    };
  }

  function BaseOption(option) {
    AbstractOption.call(this, option);

    this.initName('base');
    this.initChildren([
      child(SelectBox, 'template'),
      child(BooleanSelectBox, 'reverseArrow'),
      child(SelectBox, 'orientation'),
      child(SelectBox, 'mode'),
      child(TextBox, 'author')
    ]);
  }

  function TemplateOption(option) {
    AbstractOption.call(this, option);

    this.initName('template');
    this.initChildren([
      child(TemplateColorsOption, 'colors'),
      child(TemplateArrowOption),
      child(TemplateBranchOption),
      child(TemplateCommitOption)
    ]);
  }

  function TemplateArrowOption(option) {
    AbstractOption.call(this, option);
    
    this.initName('arrow');
    this.initChildren([
      child(TextBox, 'color'),
      child(TextBox, 'size'),
      child(TextBox, 'offset')
    ]);
  }

  function TemplateBranchOption(option) {
    AbstractOption.call(this, option);

    this.initName('branch');
    this.initChildren([
      child(TextBox, 'color'),
      child(TextBox, 'lineWidth'),
      child(SelectBox, 'mergeStyle'),
      child(TextBox, 'spacingX'),
      child(TextBox, 'spacingY'),
      child(BooleanSelectBox, 'showLabel'),
      child(TextBox, 'labelColor'),
      child(TextBox, 'labelFont')
    ]);
  }

  function TemplateCommitOption(option) {
    AbstractOption.call(this, option);

    this.initName('commit');
    this.initChildren([
      child(TextBox, 'spacingX'),
      child(TextBox, 'spacingY'),
      child(TextBox, 'widthExtension'),
      child(TextBox, 'color'),
      child(TemplateDotOption),
      child(TemplateMessageOption)
    ]);
  }

  function TemplateDotOption(option) {
    AbstractOption.call(this, option);

    this.initName('dot');
    this.initChildren([
      child(TextBox, 'color'),
      child(TextBox, 'size'),
      child(TextBox, 'strokeWidth'),
      child(TextBox, 'strokeColor')
    ]);
  }

  function TemplateMessageOption(option) {
    AbstractOption.call(this, option);

    this.initName('message');
    this.initChildren([
      child(TextBox, 'color'),
      child(BooleanSelectBox, 'display'),
      child(BooleanSelectBox, 'displayAuthor'),
      child(BooleanSelectBox, 'displayBranch'),
      child(BooleanSelectBox, 'displayHash'),
      child(TextBox, 'font'),
      child(BooleanSelectBox, 'shouldDisplayTooltipsInCompactMode')
    ]);
  }

  function BranchOption(option) {
    AbstractOption.call(this, option);
    this.branchName = option.branchName;

    this.initName(this.branchName);
    this.initChildren([
      child(TextBox, 'color'),
      child(TextBox, 'lineWidth'),
      child(BooleanSelectBox, 'showLabel'),
      child(BranchCommitDefaultOption)
    ]);
  }

  function BranchCommitDefaultOption(option) {
    AbstractOption.call(this, option);

    this.initName('commitDefaultOptions');
    this.initChildren([
      child(TextBox, 'color'),
      child(TextBox, 'messageColor'),
      child(TextBox, 'labelColor'),
      child(TextBox, 'dotColor')
    ]);
  }

  function _inherits(SuperClass, SubClass) {
      var f = function() {};
      f.prototype = SuperClass.prototype;
      SubClass.prototype = new f();
      SubClass.prototype.constructor = SubClass;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  var dummyOption = new DummyOption({
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

  draw();

  function draw() {
    var commands = editor.getCommands();
    graph.draw(commands);

    // storage.save(editor, config);
  }

  document.getElementById('addNewBranchOptionButton').addEventListener('click', function() {
    var branchName = document.getElementById('newBranchName').value;
    dummyOption.addBranch(branchName);
  });



  function Graph() {
    var _target = document.getElementById('target');

    this.draw = function(commands) {
      _refreshCanvas();

      var option = dummyOption.collectOpiton();
      var git = new GitGraphWrapperExtention(option);

      git.defaultOptions({
        branch: option.branch
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
})();
