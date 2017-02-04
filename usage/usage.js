new GitGraphWrapper({orientation: 'vertical-reverse'})
    // create 'master' branch and checkout it.
    .branch({
        name: 'master',
        color: 'red',
        commitDefaultOptions: {
            color: 'red'
        }
    })
    .checkout('master')
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
    .checkout('develop')
    .commit()

    // create and checkout 'topic1' branch.
    .branch('topic1')
    .checkout('topic1')
    .commit()
    .commit()

    // create 'topic2' branch from 'develop' branch and checkout 'topic2' branch.
    .checkout('develop')
    .branch('topic2')
    .checkout('topic2')
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
    .checkout('orphan')
    .commit()
    .commit()
    .checkout('master')
    .merge('orphan')
    .tag('v2.0.0')
;


new GitGraphWrapperExtention({
    elementId: 'gitGraphExtention',
    orientation: 'vertical-reverse'
})
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
    .checkout('-b', 'develop')
    .commit()

    // create and checkout 'topic1' branch.
    .checkout('-b', 'topic1')
    .commit()
    .commit()

    // create 'topic2' branch from 'develop' branch and checkout 'topic2' branch.
    .checkout('-b', 'topic2', 'develop')
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
    .orphanCheckout('orphan')
    .commit()
    .commit()
    .checkout('master')
    .merge('orphan')
    .tag('v2.0.0')
;
