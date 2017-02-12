# My Little Scrum Board
My Little Scrum Board (mlsb) is a simple task organising single page web application build on AngularJS and PouchDB.
You are able to create various boards with some columns, than put your tasks on it. You will be able to move or delete them while you progress with you progress with them. You can assign a Tag and a Link for your task's! Click on them and you redirected to the corresponding url immediately 

Feel free to play around with this project, I it is useful and instructive for those who are just started to learn AngularJS, or for those who intrested in how you can connect your web app and a NoSQL database together.

Also all the Angular veterans out there , feel free to comment/change anything. I'm really intrested in any feedback or a diffrent/better solution.

# Requirements
MLSB designed for the use of CouchDB or any compatible servers, but you can use it in offline mode as-well on browsers support Indexed-DB or LocalStorage.

# Set-up: Offline mode
* Copy/clone mlsb on your web server
* Set globalSync to false in app/app-config.js

# Set-up: Online mode
* Copy/clone mlsb on your web server
* Download and istall CouchDB (or any compatible servers)
* Enable CORS from all domains (*) and set allow_jsonp to true
* Set globalSync to true in app/app-config.js and globalHost to match your CouchDB address

# To do / Future plans
* Create Bower or Npm build script (for dependencies)
* Implement Tag search / filtering

# Useful links
* https://angularjs.org/
* https://pouchdb.com/
* http://getbootstrap.com/
* http://couchdb.apache.org/
