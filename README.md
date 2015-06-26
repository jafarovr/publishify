# Publishify

A simple command-line tool that allows you to publish any directory as as HTTP web index (like Apache web index).

**NOTE:** Project is currently under development. More features will be added, hopefully.

### How to install

In order to use this tool **[node.js]** and **[npm]** should be installed on your machine. Then you could just clone this repository and run following command. 
```
cd /path/to/repo
npm install -g
```
**Note**: You may need ``sudo`` access to install it. 

### Usage
```
publishify PORT DIRECTORY
```
##### Example
```
publishify 3000 /home/user
```

### Tools used

* [Express] - Node.js web application framework
* [EJS] - Embedded JavaScript templating

and more...

### More?

The project is under development. I am learning/improving my Node.js skills and as well as working on this project. More features will be added. Feel free to mail me at rj@rjv.me for any suggestions/bugs. 

### License 

Copyright (c) 2015 Ramin Jafarov. Licensed under the MIT license.

[Express]:http://expressjs.com/
[EJS]:http://www.embeddedjs.com/
[node.js]:https://nodejs.org/
[npm]:https://www.npmjs.com/