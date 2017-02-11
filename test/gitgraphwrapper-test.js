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

            it("checkout() method delegates to parent checkout() method.", function() {
                // exercise
                wrapper.checkout('branchName');

                // verify
                expect(GitGraphWrapper.prototype.checkout).toHaveBeenCalledWith('branchName');
            });

            it("checkout() method delegates to parent checkout() method. (multiple parameters)", function() {
                // exercise
                wrapper.checkout('branchName', 'ignore parameter');

                // verify
                expect(GitGraphWrapper.prototype.checkout).toHaveBeenCalledWith('branchName');
            });

            it("checkout() method returns itself.", function() {
                // exercise
                var returnValue = wrapper.checkout('branchName');

                // verify
                expect(returnValue).toBe(wrapper);
            });

            it("if checkout() method is called with '-b' option, exception is thrown with description message.", function() {
                // verify
                expect(function() {
                    // exercise
                    wrapper.checkout('-b');
                }).toThrow("'-b' option was removed. You can change HEAD just using the branch() method.");
            });
        });

        describe('test orphanCheckout() method', function() {
            it("if orphanCheckout() method is called, exception is thrown with description message.", function() {
                // verify
                expect(wrapper.orphanCheckout)
                    .toThrow('orphanCheckout() method is removed. You can change HEAD just using the orphanBranch() method.');
            });
        });

        describe('test branch() method', function() {

            beforeEach(function() {
                // setup
                spyOn(GitGraphWrapper.prototype, 'branch');
            });

            it('branch() method returns itself.', function() {
                // exercise
                var returnValue = wrapper.branch('option');

                // verfiy
                expect(returnValue).toBe(wrapper);
            });

            it('if second argument (start-point) is specified, create new branch from start-point.', function() {
                // setup
                spyOn(GitGraphWrapperExtention.prototype, 'checkout');

                // exercise
                wrapper.branch('newBranchName', 'startPointBranchName');

                // verify
                expect(GitGraphWrapperExtention.prototype.checkout).toHaveBeenCalledWith('startPointBranchName');
                expect(GitGraphWrapper.prototype.branch).toHaveBeenCalledWith({name: 'newBranchName'});
            });
        });

        describe('test default branch() method arguments definition', function() {

            it('if default branch option is defined, it will be used when orphanBranch() method is called.', function() {
                // setup
                var wrapper = new GitGraphWrapperExtention()
                                    .defaultOptions({
                                        branch: {
                                            orphan: {
                                                color: 'purple',
                                                commitDefaultOptions: {
                                                    color: 'purple'
                                                }
                                            }
                                        }
                                    });

                spyOn(GitGraphWrapper.prototype, 'orphanBranch');

                // exercise
                wrapper.orphanBranch('orphan');

                // verify
                expect(GitGraphWrapper.prototype.orphanBranch).toHaveBeenCalledWith({
                    name: 'orphan',
                    color: 'purple',
                    commitDefaultOptions: {
                        color: 'purple'
                    }
                });
            });

            it('if default branch option is defined, it will be used when branch() method is called.', function() {
                // setup
                var wrapper = new GitGraphWrapperExtention()
                                    .defaultOptions({
                                        branch: {
                                            master: {
                                                color: 'red',
                                                commitDefaultOptions: {
                                                    color: 'red'
                                                }
                                            }
                                        }
                                    });

                spyOn(GitGraphWrapper.prototype, 'branch');

                // exercise
                wrapper.branch('master');

                // verify
                expect(GitGraphWrapper.prototype.branch).toHaveBeenCalledWith({
                    name: 'master',
                    color: 'red',
                    commitDefaultOptions: {
                        color: 'red'
                    }
                });
            });

            it('if branch() method is used with object arguments, default options is overridden.', function() {
                // setup
                var wrapper = new GitGraphWrapperExtention()
                                    .defaultOptions({
                                        branch: {
                                            master: {
                                                color: 'red',
                                                commitDefaultOptions: {
                                                    color: 'red'
                                                }
                                            }
                                        }
                                    });

                spyOn(GitGraphWrapper.prototype, 'branch');

                // exercise
                wrapper.branch({
                    name: 'master',
                    color: 'blue'
                });

                // verify
                expect(GitGraphWrapper.prototype.branch).toHaveBeenCalledWith({
                    name: 'master',
                    color: 'blue',
                    commitDefaultOptions: {
                        color: 'red'
                    }
                });
            });
        });

        describe('test extend() method', function() {
            var extend = GitGraphWrapperExtention.extend;

            it('existing property is overridden and not existing property is appended.', function() {
                // setup
                var target = {a: 1, b: 2};

                // exercise
                extend(target, {b: 3, c: 4});

                // verify
                expect(target).toEqual({a: 1, b: 3, c: 4});
            });

            it('if property is undefined, copy as is.', function() {
                // setup
                var target = {
                    a: 10,
                    b: undefined
                };

                // exercise
                extend(target, {
                    a: undefined,
                    c: undefined
                });

                // verify
                expect(target).toEqual({
                    a: undefined,
                    b: undefined,
                    c: undefined
                });
            });

            it('if property is null, copy as is.', function() {
                // setup
                var target = {
                    a: 10,
                    b: null
                };

                // exercise
                extend(target, {
                    a: null,
                    c: null
                });

                // verify
                expect(target).toEqual({
                    a: null,
                    b: null,
                    c: null
                });
            });

            it('if property is Function, copy as is.', function() {
                // setup
                var target = {
                    func: function() {return 'original';}
                };

                // exercise
                extend(target, {
                    func: function() {return 'override';}
                });

                // verify
                expect(target.func()).toBe('override');
            });

            it('if property is Arrary, copy as is.', function() {
                // setup
                var target = {
                    a: 1,
                    b: [1, 2, {aa: 10, bb: 20}],
                    c: {
                        aaa: 100,
                        bbb: [9, 8, 7]
                    }
                };

                // exercise
                extend(target, {
                    b: [10, 20, {aa: 11, bb: 22}],
                    c: {
                        bbb: [1, 2, 3],
                        ccc: 300
                    }
                });

                // verify
                expect(target).toEqual({
                    a: 1,
                    b: [10, 20, {aa: 11, bb: 22}],
                    c: {
                        aaa: 100,
                        bbb: [1, 2, 3],
                        ccc: 300
                    }
                });
            });

            it('if property is Object, copy as recursively.', function() {
                // setup
                var target = {
                    a: 1,
                    b: {
                        aa: 10,
                        bb: 20,
                        cc: {
                            aaa: 100
                        }
                    }
                };

                // exercise
                extend(target, {
                    b: {
                        aa: "11",
                        cc: {
                            bbb: 222
                        },
                        dd: 444
                    }
                });

                // verify
                expect(target).toEqual({
                    a: 1,
                    b: {
                        aa: "11",
                        bb: 20,
                        cc: {
                            aaa: 100,
                            bbb: 222
                        },
                        dd: 444
                    }
                });
            });

            it('enable to add new Object property.', function() {
                // setup
                var target = {
                    a: 1
                };

                // exercise
                extend(target, {
                    b: {
                        aa: 11,
                        bb: 22
                    }
                });

                // verify
                expect(target).toEqual({
                    a: 1,
                    b: {
                        aa: 11,
                        bb: 22
                    }
                });
            });

            it('enable replace not object property to any object.', function() {
                // setup
                var target = {
                    a: 1
                };

                // exercise
                extend(target, {
                    a: {
                        aa: 11
                    }
                });

                // verify
                expect(target).toEqual({
                    a: {
                        aa: 11
                    }
                });
            });
        });
    });
});
