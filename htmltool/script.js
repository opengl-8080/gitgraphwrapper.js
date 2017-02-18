(function() {
  ////////////////////////////////////////////////////////////////////////////////////
  // Input elements
  ////////////////////////////////////////////////////////////////////////////////////
  /**
   * Base class of input elements.
   */
  function InputElement(option) {
    this.name = option.name;
    this.id = option.parentName + '_' + this.name;
    this.listener = option.listener;
    this.element = byId(this.id);

    this.element.addEventListener('change', this.listener);
  }

  /**
   * Collect this input value into target object.
   */
  InputElement.prototype.collect = function(target) {
    var value = this.element.value;

    if (value !== '') {
      if (this.element.type === 'number') {
        value = Number(value);
      }
      target[this.name] = this.mapValue(value);
    }
  };

  /**
   * Storategy to map value.
   */
  InputElement.prototype.mapValue = function(value) {
    return value;
  };

  /**
   * Restore value from source object.
   */
  InputElement.prototype.restore = function(source) {
    if (this.name in source && source[this.name] !== '') {
      this.element.value = source[this.name];
    }
  };

  /**
   * Clear value.
   */
  InputElement.prototype.clear = function() {
    this.element.value = '';
  };

  // define inheritance relationship for InputElement
  inherits(InputElement, TextBox);
  inherits(InputElement, SelectBox);
  inherits(InputElement, BooleanSelectBox);
  inherits(InputElement, TemplateColorsOption);

  /**
   * <input type="text"> element.
   */
  function TextBox(option) {
    InputElement.call(this, option);
  }

  /**
   * <select> element.
   */
  function SelectBox(option) {
    InputElement.call(this, option);
  }

  /**
   * <select> element as primitive boolean value.
   */
  function BooleanSelectBox(option) {
    InputElement.call(this, option);
  }

  /**
   * Map value from String to boolean.
   */
  BooleanSelectBox.prototype.mapValue = function(value) {
    return value === 'true';
  };

  /**
   * For template.colors options element.
   */
  function TemplateColorsOption(option) {
    InputElement.call(this, option);
  }

  /**
   * Map value to color code array.
   */
  TemplateColorsOption.prototype.mapValue = function(value) {
    return value.replace(/ */g, '').split(',');
  };

  ////////////////////////////////////////////////////////////////////////////////////
  // Options
  ////////////////////////////////////////////////////////////////////////////////////
  /**
   * Root option.
   */
  function GitGraphOption(option) {
    var _self = this;
    var _listener = option.listener;
    var _name = 'option';
    var _base = new BaseOption({parentName: _name, listener: _listener});
    var _template = new TemplateOption({parentName: _name, listener: _listener});
    var _branchOptions = {};

    /**
     * Dump option values as is.
     */
    this.dump = function() {
      // collect base options
      var option = {};
      _base.collect(option);
      
      // collect template options
      _template.collect(option);

      // collect branch options
      option.branch = {};
      for (var branchName in _branchOptions) {
        _branchOptions[branchName].collect(option.branch);
      }

      return option;
    };
    
    /**
     * Collect option values for GitGraph parameter.
     */
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

    /**
     * Restore option values from source object.
     */
    this.restore = function(source) {
      _base.restore(source);
      _template.restore(source);
      for (var branchName in source.branch) {
        this.addBranch(branchName);
        _branchOptions[branchName].restore(source.branch);
      }
    };

    /**
     * Add new branch option.
     */
    this.addBranch = function(branchName) {
      // skip if aleady exists
      if (byId(branchName)) {
        return;
      }

      // create html
      var html = _createHtml(branchName);
      _appendHtml(branchName, html);
      _initRemoveButton(branchName);

      // create Option instance
      _branchOptions[branchName] = new BranchOption({
        parentName: _name + '_branch',
        listener: _listener,
        branchName: branchName
      });
    };

    function _createHtml(branchName) {
      var html = byId('newBranchOptionTemplate').innerText;
      return html.replace(/\${branchName}/g, branchName);
    }

    function _appendHtml(branchName, html) {
      var div = document.createElement('div');
      div.innerHTML = html;
      div.id = branchName + '_options';

      byId('newBranchesTarget').appendChild(div);
    }

    function _initRemoveButton(branchName) {
      onClick(branchName + '_remove', function() {
        _removeBranch(branchName);
        _listener();
      });
    }

    function _removeBranch(branchName) {
      var branchArea = byId(branchName + "_options");
      byId('newBranchesTarget').removeChild(branchArea);

      delete _branchOptions[branchName];
    };

    /**
     * Clear options.
     */
    this.clear = function() {
      _base.clear();
      _template.clear();

      for (var branchName in _branchOptions) {
        _removeBranch(branchName);
      }
    };
  }

  /**
   * Base of option classes.
   * 
   * Option class has some children.
   * Children include other AbstractOptions or InputElements.
   */
  function AbstractOption(option) {
    this.parentName = option.parentName;
    this.listener = option.listener;
    this.children = [];
  }

  /**
   * Collect option values from children and set these into target object.
   */
  AbstractOption.prototype.collect = function(target) {
    var _self = this;

    if (!(_self.name in target)) {
      target[_self.name] = {};
    }

    _self.children.forEach(function(child) {
      child.collect(target[_self.name]);
    });
  };

  /**
   * Restore values into children from source object.
   */
  AbstractOption.prototype.restore = function(source) {
    var _self = this;

    if (!(_self.name in source)) {
      return;
    }

    _self.children.forEach(function(child) {
      child.restore(source[_self.name]);
    });
  };

  /**
   * Initialize name and idPrefix property.
   * idPrefix is important to create child instances.
   */
  AbstractOption.prototype.initName = function(name) {
    this.name = name;
    this.idPrefix = this.parentName + '_' + this.name;
  };

  /**
   * Initialize children by child element builders.
   */
  AbstractOption.prototype.initChildren = function(childBuilders) {
    for (var i=0; i<childBuilders.length; i++) {
      var child = childBuilders[i].newInstance({
        parentName: this.idPrefix,
        listener: this.listener
      });

      this.children.push(child);
    }
  };

  /**
   * Clear values of children.
   */
  AbstractOption.prototype.clear = function() {
    this.children.forEach(function(child) {
      child.clear();
    });
  };

  /**
   * Create child builder object.
   * Child is InputElement or Option class.
   */
  function child(constructorFunction, name) {
    return {
      newInstance: function(option) {
        option.name = name; // only child is InputElement instance.
        return new constructorFunction(option);
      }
    };
  }

  // define inheritance relationship for AbstractOption
  inherits(AbstractOption, BaseOption);
  inherits(AbstractOption, TemplateOption);
  inherits(AbstractOption, TemplateArrowOption);
  inherits(AbstractOption, TemplateBranchOption);
  inherits(AbstractOption, TemplateCommitOption);
  inherits(AbstractOption, TemplateDotOption);
  inherits(AbstractOption, TemplateMessageOption);
  inherits(AbstractOption, BranchOption);
  inherits(AbstractOption, BranchCommitDefaultOption);

  /**
   * base option definition.
   */
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

  /**
   * template option definition.
   */
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

  /**
   * template.arrow option definition.
   */
  function TemplateArrowOption(option) {
    AbstractOption.call(this, option);
    
    this.initName('arrow');
    this.initChildren([
      child(TextBox, 'color'),
      child(TextBox, 'size'),
      child(TextBox, 'offset')
    ]);
  }

  /**
   * template.branch option definition.
   */
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

  /**
   * template.commit option definition.
   */
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

  /**
   * template.dot option definition.
   */
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

  /**
   * template.message option definition.
   */
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

  /**
   * branch option definition.
   */
  function BranchOption(option) {
    AbstractOption.call(this, option);
    this.branchName = option.branchName;

    this.initName(this.branchName);
    this.initChildren([
      child(TextBox, 'column'),
      child(TextBox, 'color'),
      child(TextBox, 'lineWidth'),
      child(BooleanSelectBox, 'showLabel'),
      child(BranchCommitDefaultOption)
    ]);
  }

  /**
   * branch.commitDefaultOptions option definition.
   */
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

  ////////////////////////////////////////////////////////////////////////////////////
  // Other classes
  ////////////////////////////////////////////////////////////////////////////////////
  /**
   * Control graph canvas.
   */
  function Graph(gitGraphOption) {
    var _target = byId('target');

    this.draw = function(commands) {
      _refreshCanvas();

      var option = gitGraphOption.collectOpiton();
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

  /**
   * Parse user input as git command.
   */
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
      var elements = line.match(/[^\s"]+|"([^\\"]|\\\\|\\")*"/g);
      var result = [];

      for (var i=0; i<elements.length; i++) {
        var element = elements[i]

        element = element.replace(/^"|"$/g, '');
        element = element.replace(/\\"/g, '"');
        element = element.replace(/\\\\/g, '\\');

        result.push(element);
      }

      return result;
    }
  }

  /**
   * Control textarea editor.
   */
  function Editor(option) {
    var _editor = byId('editor');
    var _timeoutKey;

    _setListener(option.listener);

    this.getCommands = function() {
      var commands = [];
      
      var lines = _removeMultiLineComment(_editor.value).split('\n');
      for (var i=0; i<lines.length; i++) {
        var line = lines[i].trim();

        if (line.length !== 0) {
          commands.push(new Command(line));
        }
      }

      return commands;
    };

    function _removeMultiLineComment(text) {
      return text.replace(/\/\*(.|\n)*\*\//g, '\n');
    }

    this.getRawText = function() {
      return _editor.value;
    };

    this.setRawText = function(value) {
      _editor.value = value;
    };

    function _setListener(listener) {
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
    }

    this.clear = function() {
      _editor.value = '';
    };
  }
  
  /**
   * To save and restore options.
   */
  function Storage(gitGraphOption, editor) {
    var KEY = "gitgraph.storage";
    var _text;
    var _option;

    this.save = function() {
      localStorage.setItem(KEY, this.export());
    };

    this.load = function() {
      var json = localStorage.getItem(KEY);
      this.import(json);
    };

    this.getText = function() {
      return _text;
    };

    this.getOption = function() {
      return _option;
    };

    this.clear = function() {
      localStorage.removeItem(KEY);
      editor.clear();
      gitGraphOption.clear();
    };

    this.export = function() {
      var obj = {
        text: editor.getRawText(),
        option: gitGraphOption.dump()
      };

      return JSON.stringify(obj);
    };

    this.import = function(json) {
      editor.clear();
      gitGraphOption.clear();

      if (typeof json === 'string') {
        var obj = JSON.parse(json);
        editor.setRawText(obj.text);
        gitGraphOption.restore(obj.option);
      }
    };
  }

  /**
   * Controller of GitGraphEditor.
   */
  function MainController() {
    var _gitGraphOption = new GitGraphOption({listener: _draw});
    var _editor = new Editor({listener: _draw});
    var _storage = new Storage(_gitGraphOption, _editor);
    var _graph = new Graph(_gitGraphOption);

    function _draw() {
      var commands = _editor.getCommands();
      _graph.draw(commands);

      _storage.save();
    }

    /**
     * start program.
     */
    this.start = function() {
      // load options
      _storage.load();

      // setup event
      onClick('addNewBranchOptionButton', _onClickNewBranchButton);
      onClick('expand', _onClickExpandButton);
      onClick('exportButton', _onClickExportButton);
      onClick('importButton', _onClickImportButton);
      onClick('clearButton', _onClickClearButton);

      // start
      _draw();
    };

    function _onClickNewBranchButton() {
      var branchName = byId('newBranchName').value;
      _gitGraphOption.addBranch(branchName);
    }

    function _onClickExpandButton() {
      var bottomArea = byId('bottom-area');

      if (bottomArea.style.height === '') {
        bottomArea.style.height = '80%';
        byId('expand').innerText = 'expand↓';
      } else {
        bottomArea.style.height = '';
        byId('expand').innerText = 'expand↑';
      }
    }

    function _onClickExportButton() {
      var json = _storage.export();
      prompt('Please copy a following json text, and save as an any file.', json);
    }

    function _onClickImportButton() {
      var json = prompt("Please paste a json text that you saved as a file before.\n***Caution*** : All settings and editor's text will be overriden by imported settings.");

      if (json !== null) {
        try {
          _storage.import(json);
          _draw();
        } catch (e) {
          console.error(e);
          alert('Failed to import options!');
        }
      }
    }

    function _onClickClearButton() {
      if (confirm("To clear local storage, all settings and editor's text.\nAre you OK?")) {
        _storage.clear();
        _draw();
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // Global functions
  ////////////////////////////////////////////////////////////////////////////////////
  /**
   * Define class inheritance.
   */
  function inherits(SuperClass, SubClass) {
      var f = function() {};
      f.prototype = SuperClass.prototype;
      SubClass.prototype = new f();
      SubClass.prototype.constructor = SubClass;
  }

  /**
   * Synonym of document.getElementById()
   */
  function byId(id) {
    return document.getElementById(id);
  }

  /**
   * Add click event listener.
   */
  function onClick(id, callback) {
    byId(id).addEventListener('click', callback);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // Start
  ////////////////////////////////////////////////////////////////////////////////////
  new MainController().start();

})();
