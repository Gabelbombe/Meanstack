BEN Really branching and itemizations
=====================================

This is the New BEN app contents of this repository will be for things such as Yeoman, Angular Mongo stuff etc. If you are uncertain of branches or branch strategies please refer to `Using Branches in Stash:` goo.gl/nII75e

Branch checkouts
----------------

In order to utilize branching the following must be done

 * Clone the repository
 	* CMD: `git clone http://stash.corbis.com/scm/bnr/benapp.git {somedirectory}`
 * To View available branches in the repository
 	* CMD: `git branch -va`
 * Check out the remote branch
 	* `git checkout -b {branchname} origin/{branchname}`

Branch prefixes
---------------

Use the prefixes below as part of your branch names to categorize them and take advantage of automatic branching workflows.

Bugfix  `bugfix/` : Typically used for fixing bugs against a release branch
Feature `feature/`: Used for specific feature work. Typically, this branches from and merges back into the development branch
Hotfix  `hotfix/` : Typically used to quickly fix the production branch
Release `release/`: Used for release tasks and long-term maintenance. Typically, this branches from the development branch and changes are merged back into the development branch

Automatic merge
---------------

This repository uses `Automatic merging`. This will automatically cascading merges from release branches to their downstream branches. To use this feature, the release branch type must be enabled. For more information please refer to `Automatic branch merging`: http://goo.gl/9DZ27W