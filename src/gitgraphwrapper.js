function GitGraphWrapper() {
    this.gitGraph = new GitGraph();
    this.branches = {};
    this.head = undefined;

    this.branch = function(option) {
        var createdBranch = this.gitGraph.branch(option);
        this.branches[createdBranch.name] = createdBranch;
        return this;
    };

    this.checkout = function(branchName) {
        this.head = this.branches[branchName];
        this.head.checkout();
        return this;
    };

    this.commit = function(option) {
        this.gitGraph.commit(option);
        return this;
    };

    this.tag = function(option) {
        this.gitGraph.tag(option);
        return this;
    };

    this.orphanBranch = function(option) {
        var createdBranch = this.gitGraph.orphanBranch(option);
        this.branches[createdBranch.name] = createdBranch;
        return this;
    };

    this.merge = function(targetBranchName, option) {
        this.branches[targetBranchName].merge(this.head, option);
        return this;
    };
}
