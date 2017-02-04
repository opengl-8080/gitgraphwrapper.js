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
}
