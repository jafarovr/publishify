# Publishify

A simple command-line tool that allows you to publish any directory as as HTTP web index (like Apache web index).

**NOTE:** Project is currently under development. More features will be added, hopefully.

### How to install

In order to use this tool, **[node.js]**, **[npm]** and **[Git]** should be installed on your machine. Then you could just run following commands.
```
git clone git@github.com:jafarovr/publishify.git
cd publishify/
npm install -g
```
**Note**: You may need ``sudo`` access to install it.

### Usage
```
publishify PORT DIRECTORY
```
###### Example:
```
publishify 3000 /home/user
```
Then, visit following link: ``http://YOUR_IP_ADDRESS:PORT``. If you're running locally (you won't probably need it) visit ``http://localhost:PORT``.

### Tools used

* [Express] - Node.js web application framework
* [EJS] - Embedded JavaScript templating

and many more...

### More?

The project is currently under development. I am learning/improving my Node.js skills and as well as working on this project. More features will be added soon. Feel free to contribute to the project and mail me at rj@rjv.me for any suggestions/bugs.

### License

Copyright (c) 2015 [Ramin Jafarov]. Licensed under the MIT license.

[Express]:http://expressjs.com/
[EJS]:http://www.embeddedjs.com/
[node.js]:https://nodejs.org/
[npm]:https://www.npmjs.com/
[Git]:https://git-scm.com/
[Ramin Jafarov]:https://rjv.me
