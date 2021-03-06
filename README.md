# My Little Scrum Board
My Little Scrum Board (mlsb) is a simple task organising single page web application build on AngularJS and PouchDB.
You are able to create various boards with some columns, than put your tasks on it. You will be able to move or delete them while you progress with you progress with them. You can assign a Tag and a Link for your task's! Click on them and you redirected to the corresponding url immediately 

Try out now: http://daniel.hodvogner.hu/mlsb

Feel free to play around with this project, I it is useful and instructive for those who are just started to learn AngularJS, or for those who intrested in how you can connect your web app and a NoSQL database together.

Also all the veterans out there, feel free to give me any feedback. I'm really intrested in any different or better solution.

# Requirements
MLSB designed for the use of CouchDB or any compatible servers, but you can use it in offline mode as-well on browsers support Indexed-DB or LocalStorage.

You need Npm, Bower and Gulp to build the project. Currently you can only build a development friendly version, I'm planning to create a production version in the near future.

# Set-up: Offline mode
* Copy/clone mlsb
* npm install, bower install, gulp
* Set globalSync to false in app/app-config.js

# Set-up: Online mode
* Copy/clone mlsb
* npm install, bower install, gulp
* Download and istall CouchDB (or any compatible servers)
* Enable CORS from all domains (*) and set allow_jsonp to true
* Set globalSync to true in app/app-config.js and globalHost to match your CouchDB address

# To do / Future plans
* Boards and tasks got separated, but i have to rework the queries a bit in the future.
* Now the responses and errors are managed effortlessly, i have to rewrite them as-well.
* Conflict management? (Example: Move the same task at the same time.)
* Private boards (Not synced to CouchDB, or not listed, only visible via link)
* Board edit (Task edit?)
* Task URL check (Now it's accept everything)
* Tag based filtering (Multiple tags?)
* Create production build in gulp (uglyfiy, minify, concat)

# Useful links
* https://angularjs.org/
* https://pouchdb.com/
* http://getbootstrap.com/
* http://couchdb.apache.org/
