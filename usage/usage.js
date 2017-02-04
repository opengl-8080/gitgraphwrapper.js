new GitGraphWrapper()
    .branch('master')
    .checkout('master')
    .commit()
    .commit()
    .branch('develop')
    .checkout('develop')
    .commit('Hello')
;
