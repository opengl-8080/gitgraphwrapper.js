new GitGraphWrapper({orientation: 'vertical-reverse'})
    // create 'master' branch and checkout it.
    .branch('master')
    .checkout('master')
    .commit()
    .commit()
    .tag('v1.0')

    // create 'develop' branch and checkout it.
    .branch('develop')
    .checkout('develop')
    .commit('Hello')
    .tag('tag2')
    .commit()

    // checkout master
    .checkout('master')
    .commit()

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


new GitGraphWrapperExtention({elementId: 'gitGraphExtention', orientation: 'vertical-reverse'})
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