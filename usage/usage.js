//////////////////////////////////////////////////////////////////////////////////////
// gitgraph.js
var gitGraph = new GitGraph({orientation: 'vertical-reverse'});

// create 'master' branch and checkout it.
var master = gitGraph.branch({
    name: 'master',
    color: 'red',
    commitDefaultOptions: {
        color: 'red'
    }
});
master.commit().tag('v0.0.0');

// create 'develop' branch and checkout it.
var develop = gitGraph.branch({
    name: 'develop',
    color: 'deepskyblue',
    commitDefaultOptions: {
        color: 'deepskyblue'
    }
});
develop.commit();

// create and checkout 'topic1' branch.
var topic1 = develop.branch('topic1');
topic1.commit().commit();

// create 'topic2' branch from 'develop' branch and checkout 'topic2' branch.
var topic2 = develop.branch('topic2');
topic2.commit();

// merge 'topic1' into 'develop'.
topic1.merge(develop);

// merge 'develop' into 'topic2'.
develop.merge(topic2);
// and merge 'topic2' into 'develop'.
topic2.commit().merge(develop);

// merge 'develop' into 'master'.
develop.merge(master);
master.tag('v1.0.0')

// create oraphan branch.
var orphan = gitGraph.orphanBranch({
    name: 'orphan',
    color: 'purple',
    commitDefaultOptions: {
        color: 'purple'
    }
});
orphan.commit().commit().merge(master);
master.tag('v2.0.0');

//////////////////////////////////////////////////////////////////////////////////////
// GitGraphWrapper
new GitGraphWrapper({orientation: 'vertical-reverse', elementId: 'gitGraphWrapper'})
    // create 'master' branch and checkout it.
    .branch({
        name: 'master',
        color: 'red',
        commitDefaultOptions: {
            color: 'red'
        }
    })
    .commit()
    .tag('v0.0.0')

    // create 'develop' branch and checkout it.
    .branch({
        name: 'develop',
        color: 'deepskyblue',
        commitDefaultOptions: {
            color: 'deepskyblue'
        }
    })
    .commit()

    // create and checkout 'topic1' branch.
    .branch('topic1')
    .commit()
    .commit()

    // create 'topic2' branch from 'develop' branch and checkout 'topic2' branch.
    .checkout('develop')
    .branch('topic2')
    .commit()

    // merge 'topic1' into 'develop'.
    .checkout('develop')
    .merge('topic1')

    // merge 'develop' into 'topic2'.
    .checkout('topic2')
    .merge('develop')
    .commit()
    // and merge 'topic2' into 'develop'.
    .checkout('develop')
    .merge('topic2')

    // merge 'develop' into 'master'.
    .checkout('master')
    .merge('develop')
    .tag('v1.0.0')

    // create oraphan branch.
    .orphanBranch({
        name: 'orphan',
        color: 'purple',
        commitDefaultOptions: {
            color: 'purple'
        }
    })
    .commit()
    .commit()
    .checkout('master')
    .merge('orphan')
    .tag('v2.0.0')
;

//////////////////////////////////////////////////////////////////////////////////////
// GitGraphWrapperExtention
new GitGraphWrapperExtention({orientation: 'vertical-reverse', elementId: 'gitGraphWrapperExtention'})
    // define default arguments for branch() method.
    .defaultOptions({
        branch: {
            // property name is branch name.
            master: {
                color: 'red',
                commitDefaultOptions: {
                    color: 'red'
                }
            },
            develop: {
                color: 'deepskyblue',
                commitDefaultOptions: {
                    color: 'deepskyblue'
                }
            },
            orphan: {
                color: 'purple',
                commitDefaultOptions: {
                    color: 'purple'
                }
            }
        }
    })

    // create 'master' branch and initial commit.
    .branch('master')
    .commit()
    .tag('v0.0.0')
    
    // create and checkout 'develop' branch.
    .branch('develop')
    .commit()

    // create and checkout 'topic1' branch.
    .branch('topic1')
    .commit()
    .commit()

    // create 'topic2' branch from 'develop' branch and checkout 'topic2' branch.
    .branch('topic2', 'develop')
    .commit()

    // merge 'topic1' into 'develop'.
    .checkout('develop')
    .merge('topic1')

    // merge 'develop' into 'topic2'.
    .checkout('topic2')
    .merge('develop')
    .commit()
    // and merge 'topic2' into 'develop'.
    .checkout('develop')
    .merge('topic2')

    // merge 'develop' into 'master'.
    .checkout('master')
    .merge('develop')
    .tag('v1.0.0')

    // create oraphan branch.
    .orphanBranch('orphan')
    .commit()
    .commit()
    .checkout('master')
    .merge('orphan')
    .tag('v2.0.0')
;
