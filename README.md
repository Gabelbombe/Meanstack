BEN Really branching and itemization's
======================================

This is the New BEN app contents of this repository will be for things such as Yeoman, Angular Mongo stuff etc. 
If you are uncertain of branches or branch strategies please refer to `Using Branches in Stash:` http://goo.gl/nII75e


Branch checkouts
----------------

In order to utilize branching the following must be done

 * Clone the repository
 * CMD: `git clone http://stash.corbis.com/scm/bnr/benapp.git {somedirectory}`

 * To View available branches in the repository
 * CMD: `git branch -va`

 * Check out the remote branch
 * `git checkout {branchname} AKA: Development`


Branch prefixes
---------------

Use the prefixes below as part of your branch names to categorize them and take advantage of automatic branching 
workflows.

Bugfix  `bugfix/` : Typically used for fixing bugs against a release branch

Feature `feature/`: Used for specific feature work. Typically, this branches from and merges back into the 
          development branch

Hotfix  `hotfix/` : Typically used to quickly fix the production branch

Release `release/`: Used for release tasks and long-term maintenance. Typically, this branches from the development 
          branch and changes are merged back into the development branch


Automatic merge
---------------

This repository uses `Automatic merging`. This will automatically cascading merges from release branches to their 
downstream branches. To use this feature, the release branch type must be enabled. For more information please refer 
to `Automatic branch merging`: http://goo.gl/9DZ27W


Base Installation
=================

Basic cloning steps
-------------------

 - git clone http://stash.corbis.com/scm/bnr/benapp.git {somefolder}/BenApp/
 - cd {somefolder}/BenApp/

Yeoman and Stack
----------------

 - npm install -g generator-angular-fullstack
 - yo angular-fullstack BenApp 
  - Y) Would you like to use Sass (w/ Compass)
  - Y) Would you like to use Twitter Bootstrap
  - Y) Would you like to use the Sass version of Twitter Bootstrap
    - X) angular-resource.js
    - X) angular-cookies.js
    - X) angular-sanitize.js
    - X) angular-route.js
  - Y) Would you like to include MongoDB with Mongoose
  - Y) Would you like to include a Passport authentication boilerplate

Ruby and Gems
-------------

 - Install: http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-1.9.3-p545.exe
 - gem uninstall sass compass (Fixing bad grunt tests/builds, ref: http://goo.gl/L9E5ou)
    - 3) Uninstall all versions
    - Y) to all other questions
 - gem install compass --pre 
 - gem install sass --pre


To Run NODE API
===============

 * In some windows run: node bootapi.js
 * Grunt serve functions as normal
 * [WARN] Respawn issue currently if you try to require('./bootapi.js'); from server.js, will fix later


Export db from Mongo
--------------------

 - mongodump --db (database_name) [ Optional: --collection (collection_name) ]

Import db to Mongo Dump
-----------------------

 - cd dumpfiles
 - mongorestore {database_name}