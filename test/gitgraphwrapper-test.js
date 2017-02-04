describe("test all", function() {
    var git, gitgraph;

    beforeEach(function() {
        git = new GitGraphWrapper();
        gitgraph = git.gitGraph;
    });

    describe('test constructor', function() {

        it("constructor option is passed to GitGraph's constructor.", function() {
            // setup
            spyOn(window, 'GitGraph');

            // exercise
            new GitGraphWrapper('option');

            // verify
            expect(window.GitGraph).toHaveBeenCalledWith('option');
        });
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

        it("branch() method delegates GitGraph's branch() method.", function() {
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

        it("checkout() method selects a branch instance specified by argument and delegates checkout() method.", function() {
            // verify
            expect(someBranch.checkout).toHaveBeenCalled();
        });

        it("checkout() method changes a 'head' field to specified branch instance.", function() {
            // verify
            expect(git.head).toBe(someBranch);
        });
    });

    describe('test commit() method', function() {
        var returnValue;

        beforeEach(function() {
            // setup
            spyOn(gitgraph, 'commit');

            // exercise
            returnValue = git.commit('option');
        });

        it('commit() method returns itself.', function() {
            // verify
            expect(returnValue).toBe(git);
        });

        it("commit() method delegates to GitGraph's commit() method.", function() {
            // verify
            expect(gitgraph.commit).toHaveBeenCalledWith('option');
        });
    });

    describe('test tag() method', function() {
        var returnValue;

        beforeEach(function() {
            // setup
            spyOn(gitgraph, 'tag');

            // exercise
            returnValue = git.tag('option');
        });

        it('tag() method returns itself.', function() {
            // verify
            expect(returnValue).toBe(git);
        });

        it("tag() method delegates to GitGraph's tag() method.", function() {
            // verify
            expect(gitgraph.tag).toHaveBeenCalledWith('option');
        });
    });

    describe('test orphanBranch() method', function() {
        var createdBranch = {name: 'branchName'};
        var returnValue;

        beforeEach(function() {
            // setup
            spyOn(gitgraph, 'orphanBranch').and.returnValue(createdBranch);

            // exercise
            returnValue = git.orphanBranch('option');
        });

        it('orphanBranch() method returns itself.', function() {
            // verify
            expect(returnValue).toBe(git);
        });

        it("orphanBranch() method delegates GitGraph's orphanBranch() method.", function() {
            // verify
            expect(gitgraph.orphanBranch).toHaveBeenCalledWith('option');
        });

        it("orphanBranch() method caches created orphanBranch instance into 'branches' field.", function() {
            // verify
            expect(git.branches.branchName).toBe(createdBranch);
        });
    });

    describe('test merge() method', function() {
        var returnValue, fromBranch, toBranch;

        beforeEach(function() {
            // setup
            toBranch = {};
            git.head = toBranch;

            fromBranch = {merge: function() {}};
            git.branches.fromBranchName = fromBranch;
            spyOn(fromBranch, 'merge');

            // exercise
            returnValue = git.merge('fromBranchName', 'option');
        });

        it("merge() method delegates to specified branch's merge() method with arguments there are a head branch and an option.", function() {
            // verify
            expect(fromBranch.merge).toHaveBeenCalledWith(toBranch, 'option');
        });

        it("merge() method returns itself.", function() {
            // verify
            expect(returnValue).toBe(git);
        });
    });
});
