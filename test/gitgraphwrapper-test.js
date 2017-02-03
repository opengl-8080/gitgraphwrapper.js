describe("test all", function() {
    var git, gitgraph;

    beforeEach(function() {
        git = new GitGraphWrapper();
        gitgraph = git.gitgraph;
    });

    describe('test branch() method', function() {
        var createdBranch = {name: 'branchName'};
        var returnValue;

        beforeEach(function() {
            // setup
            spyOn(gitgraph, 'branch').and.returnValue(createdBranch);

            // exercise
            returnValue = git.branch('option');
        });

        it('branch() method returns itself.', function() {
            // verify
            expect(returnValue).toBe(git);
        });

        it("branch() method proxies GitGraph's branch() method.", function() {
            // verify
            expect(gitgraph.branch).toHaveBeenCalledWith('option');
        });

        it("branch() method caches created branch instance into 'branches' field.", function() {
            // verify
            expect(git.branches.branchName).toBe(createdBranch);
        });
    });

    describe('test checkout() method', function() {
        var someBranch = {
            checkout: function() {}
        };
        var returnValue;

        beforeEach(function() {
            // setup
            git.branches.someBranch = someBranch;
            spyOn(someBranch, 'checkout');

            // exercise
            returnValue = git.checkout('someBranch');
        });

        it('checkout() method returns itself.', function() {
            // verify
            expect(returnValue).toBe(git);
        });

        it("checkout() method selects a branch instance specified by argument and proxies checkout() method.", function() {
            // verify
            expect(someBranch.checkout).toHaveBeenCalled();
        });

        it("checkout() method changes a 'head' field to specified branch instance.", function() {
            // verify
            expect(git.head).toBe(someBranch);
        });
    });


});
