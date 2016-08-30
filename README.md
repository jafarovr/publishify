# Publishify

A simple command-line tool that allows you to publish any directory as as HTTP web index (like Apache web index).

**NOTE:** Project is currently under development. More features will be added, hopefully.

![Screenshot](https://github.com/jafarovr/publishify/raw/master/screenshot.png "Screenshot")

### How to install

In order to use this tool, **[node.js]**, **[npm]** and **[Git]** should be installed on your machine. Then you could just run following commands.
```
[sudo] npm install -g publishify
```
**Note**: You may need ``sudo`` access to install it.

### Usage
```
publishify DIRECTORY
```
###### Example:
```
publishify /home/user
```
###### Output:
```
publishify running on directory /Users/rj
open http://192.168.1.90:3030/ on your browser to view your files.
```
Then, visit following link: ``http://YOUR_IP_ADDRESS:PORT``. If you're running locally (you won't probably need it) visit ``http://localhost:PORT``.

If you want to expose your directory to the web and share it with your friends, just use following command.
```
publishify /home/user -e
```
You will see an output given below. The functionality is powered by [localtunnel].
```
publishify running on directory .
open http://192.168.1.102:55676/ on your browser to view your files.
your directory is also publicly available on http://jrsqgsdpgq.localtunnel.me
```

Try running ``publishify --help`` to get more info about how to run it. There's not much stuff now, but will add more soon.

### Tools used

* [Express] - Node.js web application framework
* [EJS] - Embedded JavaScript templating
* [localtunnel] - Exposes your localhost to the world!

and many more...

### More?

The project is currently under development. More features will be added soon. Use it on your own risk! Feel free to contribute to the project and/or contact me for any suggestions/bugs.

### License

Copyright (c) 2016 [Ramin Jafarov]. Licensed under the MIT license.

[Express]:http://expressjs.com/
[EJS]:http://www.embeddedjs.com/
[node.js]:https://nodejs.org/
[npm]:https://www.npmjs.com/
[Git]:https://git-scm.com/
[Ramin Jafarov]:https://rjv.me
[localtunnel]:https://github.com/localtunnel/localtunnel