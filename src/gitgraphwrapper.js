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

    window.GitGraphWrapper = GitGraphWrapper;
})();
