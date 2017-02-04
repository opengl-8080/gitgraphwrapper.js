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
    .commit()
    .tag('v1.0')

    // create 'develop' branch and checkout it.
    .branch({
        name: 'develop',
        color: 'deepskyblue',
        commitDefaultOptions: {
            color: 'deepskyblue'
        }
    })
    .checkout('develop')
    .commit('Hello')
    .tag('tag2')
    .commit()

    // checkout master
    .checkout('master')
    .commit()

    // create 'topic' branch from 'develop' branch.
    .checkout('develop')
    .branch('topic')
    .commit()
    .commit()

    // merge 'topic' into 'develop'
    .checkout('develop')
    .merge('topic')

    // create orphan branch 'orphan' and checkout it.
    .orphanBranch('orphan')
    .checkout('orphan')
    .commit()
    .commit()

    // checkout 'develop'
    .checkout('develop')
    .commit()

    // checkout 'master' and merge 'develop' and 'orphan' branches.
    .checkout('master')
    .merge('develop', {message: 'merge from develop'})
    .merge('orphan')
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
            }
        }
    })

    // create 'master' branch and checkout it.
    .checkout('-b', 'master')
    .commit()
    .commit()
    .tag('v1.0')

    // create 'develop' branch and checkout it.
    .checkout('-b', 'develop')
    .commit('Hello')
    .tag('tag2')
    .commit()

    // checkout master
    .checkout('master')
    .commit()

    // create 'topic' branch from 'develop' branch and checkout 'topic' branch.
    .checkout('-b', 'topic', 'develop')
    .commit()
    .commit()

    // merge 'topic' into 'develop'
    .checkout('develop')
    .merge('topic')

    // create orphan branch 'orphan' and checkout it.
    .orphanCheckout('orphan')
    .commit()
    .commit()

    // checkout 'develop'
    .checkout('develop')
    .commit()

    // checkout 'master' and merge 'develop' and 'orphan' branches.
    .checkout('master')
    .merge('develop', {message: 'merge from develop'})
    .merge('orphan')
;