function Git() {
    this.gitgraph = new GitGraph();
    this.branches = {};
    this.head = undefined;

    this.branch = function(option) {
        var createdBranch = this.gitgraph.branch(option);
        this.branches[createdBranch.name] = createdBranch;
        return this;
    };

    this.checkout = function(branchName) {
        this.head = this.branches[branchName];
        this.head.checkout();
        return this;
    };
}
