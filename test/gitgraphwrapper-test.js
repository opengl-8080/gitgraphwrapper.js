describe("test all", function() {
    describe('Test GitGraphWrapper', function() {
        var wrapper, gitGraph;

        beforeEach(function() {
            wrapper = new GitGraphWrapper();
            gitGraph = wrapper.gitGraph;
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
                spyOn(gitGraph, 'branch').and.returnValue(createdBranch);

                // exercise
                returnValue = wrapper.branch('option');
            });

            it('branch() method returns itself.', function() {
                // verify
                expect(returnValue).toBe(wrapper);
            });

            it("branch() method delegates GitGraph's branch() method.", function() {
                // verify
                expect(gitGraph.branch).toHaveBeenCalledWith('option');
            });

            it("branch() method caches created branch instance into 'branches' field.", function() {
                // verify
                expect(wrapper.branches.branchName).toBe(createdBranch);
            });
        });

        describe('test checkout() method', function() {
            var someBranch = {
                checkout: function() {}
            };
            var returnValue;

            beforeEach(function() {
                // setup
                wrapper.branches.someBranch = someBranch;
                spyOn(someBranch, 'checkout');

                // exercise
                returnValue = wrapper.checkout('someBranch');
            });

            it('checkout() method returns itself.', function() {
                // verify
                expect(returnValue).toBe(wrapper);
            });

            it("checkout() method selects a branch instance specified by argument and delegates checkout() method.", function() {
                // verify
                expect(someBranch.checkout).toHaveBeenCalled();
            });

            it("checkout() method changes a 'head' field to specified branch instance.", function() {
                // verify
                expect(wrapper.head).toBe(someBranch);
            });
        });

        describe('test commit() method', function() {
            var returnValue;

            beforeEach(function() {
                // setup
                spyOn(gitGraph, 'commit');

                // exercise
                returnValue = wrapper.commit('option');
            });

            it('commit() method returns itself.', function() {
                // verify
                expect(returnValue).toBe(wrapper);
            });

            it("commit() method delegates to GitGraph's commit() method.", function() {
                // verify
                expect(gitGraph.commit).toHaveBeenCalledWith('option');
            });
        });

        describe('test tag() method', function() {
            var returnValue;

            beforeEach(function() {
                // setup
                spyOn(gitGraph, 'tag');

                // exercise
                returnValue = wrapper.tag('option');
            });

            it('tag() method returns itself.', function() {
                // verify
                expect(returnValue).toBe(wrapper);
            });

            it("tag() method delegates to GitGraph's tag() method.", function() {
                // verify
                expect(gitGraph.tag).toHaveBeenCalledWith('option');
            });
        });

        describe('test orphanBranch() method', function() {
            var createdBranch = {name: 'branchName'};
            var returnValue;

            beforeEach(function() {
                // setup
                spyOn(gitGraph, 'orphanBranch').and.returnValue(createdBranch);

                // exercise
                returnValue = wrapper.orphanBranch('option');
            });

            it('orphanBranch() method returns itself.', function() {
                // verify
                expect(returnValue).toBe(wrapper);
            });

            it("orphanBranch() method delegates GitGraph's orphanBranch() method.", function() {
                // verify
                expect(gitGraph.orphanBranch).toHaveBeenCalledWith('option');
            });

            it("orphanBranch() method caches created orphanBranch instance into 'branches' field.", function() {
                // verify
                expect(wrapper.branches.branchName).toBe(createdBranch);
            });
        });

        describe('test merge() method', function() {
            var returnValue, fromBranch, toBranch;

            beforeEach(function() {
                // setup
                toBranch = {};
                wrapper.head = toBranch;

                fromBranch = {merge: function() {}};
                wrapper.branches.fromBranchName = fromBranch;
                spyOn(fromBranch, 'merge');

                // exercise
                returnValue = wrapper.merge('fromBranchName', 'option');
            });

            it("merge() method delegates to specified branch's merge() method with arguments there are a head branch and an option.", function() {
                // verify
                expect(fromBranch.merge).toHaveBeenCalledWith(toBranch, 'option');
            });

            it("merge() method returns itself.", function() {
                // verify
                expect(returnValue).toBe(wrapper);
            });
        });
    });

    describe('Test GitGraphWrapperExtention', function() {
        var wrapper, gitGraph;

        beforeEach(function() {
            // setup
            wrapper = new GitGraphWrapperExtention();
            gitGraph = wrapper.gitGraph;
        });

        describe('test checkout() method', function() {
            beforeEach(function() {
                // setup
                spyOn(GitGraphWrapperExtention.prototype, 'branch');
                spyOn(GitGraphWrapper.prototype, 'checkout');
            });
            
            it("call checkout() method with '-b' option then branch() and checkout() methods are called.", function() {
                // exercise
                wrapper.checkout('-b', 'branchName');

                // verify
                expect(GitGraphWrapperExtention.prototype.branch).toHaveBeenCalledWith('branchName');
                expect(GitGraphWrapper.prototype.checkout).toHaveBeenCalledWith('branchName');
            });

            it("call checkout() method without '-b' option then checkout() method is only called.", function() {
                // exercise
                wrapper.checkout('branchName');

                // verify
                expect(GitGraphWrapperExtention.prototype.branch.calls.count()).toBe(0);
                expect(GitGraphWrapper.prototype.checkout).toHaveBeenCalledWith('branchName');
            });

            it("checkout() method returns itself.", function() {
                // exercise
                var returnValue = wrapper.checkout('branchName');

                // verify
                expect(returnValue).toBe(wrapper);
            });
        });

    });
});
