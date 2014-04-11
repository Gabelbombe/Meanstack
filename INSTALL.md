App generator base installation instructions
============================================

Clone directions and getting your stack running
-----------------------------------------------

 - git clone https://{stashUserName}@stash.corbis.com/scm/bnr/benapp.git {somedirectory}
 - start your local mongo service (Aka: mongod) [no configs are currently hooked up]
 - cd {benappDirectory}
 - npm install [node modeules not currently in repo]
 - grunt


Basic Readme's on stack
-----------------------

 - MongoDB - Go through MongoDB Official Website and proceed to their Official Manual, which should help you understand NoSQL and MongoDB better.
 - Express - The best way to understand express is through its Official Website, particularly The Express Guide; you can also go through this StackOverflow Thread for more resources.
 - AngularJS - Angular's Official Website is a great starting point. You can also use Thinkster Popular Guide, and the Egghead Videos.
 - Node.js - Start by going through Node.js Official Website and this StackOverflow Thread, which should get you going with the Node.js platform in no time.


Basic Generators
----------------

 - [meanjs]						(https://github.com/meanjs/generator-meanjs#application-generator)
 - [meanjs:crud-module]			(https://github.com/meanjs/generator-meanjs#crud-module-sub-generator)
 - [meanjs:angular-module]		(https://github.com/meanjs/generator-meanjs#angularjs-module-sub-generator)
 - [meanjs:angular-route]		(https://github.com/meanjs/generator-meanjs#angularjs-route-sub-generator)
 - [meanjs:angular-controller]	(https://github.com/meanjs/generator-meanjs#angularjs-controller-sub-generator)
 - [meanjs:angular-view]		(https://github.com/meanjs/generator-meanjs#angularjs-view-sub-generator)
 - [meanjs:angular-service]		(https://github.com/meanjs/generator-meanjs#angularjs-service-sub-generator)
 - [meanjs:angular-directive]	(https://github.com/meanjs/generator-meanjs#angularjs-directive-sub-generator)
 - [meanjs:angular-filter]		(https://github.com/meanjs/generator-meanjs#angularjs-filter-sub-generator)
 - [meanjs:angular-config]		(https://github.com/meanjs/generator-meanjs#angularjs-config-sub-generator)
 - [meanjs:angular-test]		(https://github.com/meanjs/generator-meanjs#angularjs-test-sub-generator)
 - [meanjs:express-model]		(https://github.com/meanjs/generator-meanjs#express-model-sub-generator)
 - [meanjs:express-controller]	(https://github.com/meanjs/generator-meanjs#express-controller-sub-generator)
 - [meanjs:express-route]		(https://github.com/meanjs/generator-meanjs#express-routes-sub-generator)
 - [meanjs:express-test]		(https://github.com/meanjs/generator-meanjs#express-test-sub-generator)


Building from scratch
---------------------

This is for a BASE install only, in case you are rebuilding the App!!!

Prerequisites:

 - GIT
   - Windows: https://msysgit.googlecode.com/files/Git-1.9.0-preview20140217.exe
   - Linux: apt-get install -y git git-core
   - Mac: brew install git
 - Node / NPM
  - Windows: http://nodejs.org/dist/v0.10.26/node-v0.10.26-x86.msi
  - Linux: http://richardhsu.net/2013/10/19/installing-nodejs-npm-on-ubuntu-13-10/
  - Mac: http://thechangelog.com/install-node-js-with-homebrew-on-os-x/
 - (sudo) npm install -g yo
 - (sudo) npm install -g generator-meanjs

MeanJS
 - yo meanjs

