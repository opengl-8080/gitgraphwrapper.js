(function() {
    function GitGraphWrapper(option) {
        this.gitGraph = new GitGraph(option);
        this.branches = {};
        this.head = undefined;
    }

    GitGraphWrapper.prototype.branch = function(option) {
        var createdBranch = this.gitGraph.branch(option);
        this.branches[createdBranch.name] = createdBranch;
        return this;
    };

    GitGraphWrapper.prototype.checkout = function(branchName) {
        this.head = this.branches[branchName];
        this.head.checkout();
        return this;
    };

    GitGraphWrapper.prototype.commit = function(option) {
        this.gitGraph.commit(option);
        return this;
    };

    GitGraphWrapper.prototype.tag = function(option) {
        this.gitGraph.tag(option);
        return this;
    };

    GitGraphWrapper.prototype.orphanBranch = function(option) {
        var createdBranch = this.gitGraph.orphanBranch(option);
        this.branches[createdBranch.name] = createdBranch;
        return this;
    };

    GitGraphWrapper.prototype.merge = function(targetBranchName, option) {
        this.branches[targetBranchName].merge(this.head, option);
        return this;
    };



    function GitGraphWrapperExtention(option) {
        GitGraphWrapper.call(this, option);
    }

    _inherits(GitGraphWrapper, GitGraphWrapperExtention);

    GitGraphWrapperExtention.prototype.defaultOptions = function(option) {
        this.defaultOptions = option;
        return this;
    };

    GitGraphWrapperExtention.prototype.getDefaultOptions = function(branchName) {
        if (!this.defaultOptions ||
            !('branch' in this.defaultOptions) ||
            !(branchName in this.defaultOptions.branch)) {
            return {name: branchName};
        }

        return this.defaultOptions.branch[branchName];
    };

    GitGraphWrapperExtention.prototype.orphanBranch = function(option) {
        var branchOption = _buildBranchOption(this, option);

        GitGraphWrapper.prototype.orphanBranch.call(this, branchOption);

        return this;
    };

    GitGraphWrapperExtention.prototype.branch = function(option, startPointBranchName) {
        var branchOption = _buildBranchOption(this, option);

        if (typeof startPointBranchName === 'string') {
            this.checkout(startPointBranchName);
        }
        GitGraphWrapper.prototype.branch.call(this, branchOption);

        return this;
    };

    function _buildBranchOption(self, option) {
        var specifiedOption = _normalizeBranchOption(option);
        var defaultOptions = self.getDefaultOptions(specifiedOption.name);

        var branchOption = {};
        GitGraphWrapperExtention.extend(branchOption, defaultOptions);
        GitGraphWrapperExtention.extend(branchOption, specifiedOption);

        return branchOption;
    }

    function _normalizeBranchOption(argument) {
        return typeof argument === 'string' ? {name: argument} : argument;
    }

    GitGraphWrapperExtention.prototype.checkout = function(branchName) {
        if (arguments[0] === '-b') {
            throw "'-b' option was removed. You can change HEAD just using the branch() method.";
        }

        GitGraphWrapper.prototype.checkout.call(this, branchName);

        return this;
    };

    GitGraphWrapperExtention.prototype.orphanCheckout = function() {
        throw "orphanCheckout() method is removed. You can change HEAD just using the orphanBranch() method.";
    };

    GitGraphWrapperExtention.extend = function(target, source) {
        for (var key in source) {
            var sourceProperty = source[key];
            var targetProperty = target[key];
            
            if (typeof targetProperty === 'object' &&
                typeof sourceProperty === 'object' &&
                sourceProperty !== null) {

                GitGraphWrapperExtention.extend(target[key], sourceProperty);
            } else {

                target[key] = sourceProperty;
            }
        }
    };


    function _inherits(SuperClass, SubClass) {
        var f = function() {};
        f.prototype = SuperClass.prototype;
        SubClass.prototype = new f();
        SubClass.prototype.constructor = SubClass;
    }

    window.GitGraphWrapper = GitGraphWrapper;
    window.GitGraphWrapperExtention = GitGraphWrapperExtention;
})();
