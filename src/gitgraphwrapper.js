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

    GitGraphWrapperExtention.prototype.checkout = function() {
        if (arguments[0] === '-b') {
            this.branch(arguments[1]);
        }

        var branchName = (1 < arguments.length) ? arguments[1] : arguments[0];
        GitGraphWrapper.prototype.checkout.call(this, branchName);

        return this;
    };

    GitGraphWrapperExtention.prototype.orphanCheckout = function(branchName) {
        this.orphanBranch(branchName);
        this.checkout(branchName);
        return this;
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
