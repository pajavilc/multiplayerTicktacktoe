#Ticktacktoe Server
> An online ticktacktoe game. Live demo [_here_](http://tttproj.ddns.net/).

##Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Project Status](#project-status)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)

##General information
sadasd
>A multiplayer game running on react + node.js + mysql.
>This my personal project made for educational purposes.

##Technologies Used
- Node.js - 16.14.1
- mariadb - 10.5
- express - 4.17.2
- jsonwebtoken - 8.5.1
- react - 17.0.2
- cors - 2.8.5
- redux - 4.1.2
- ws

## Features
- 1 v 1 ticktacktoe
- spectator mode
- chat
- statistics

##Screnshots
To be added

##Setup
You need to install NodeJS from [_here_](https://nodejs.org/en/download/). Next you have to create .env in server and include all the variables from .env.example
	
  Example:
- PORT= 2500
- ACCESS_SECRET_TOKEN='longSequenceOfChars'
- REFRESH_SECRET_TOKEN='longSequenceOfChars'
- ACCESS_EXPIRATION_TIME='2h'
- REFRESH_EXPIRATION_TIME='15d'
- REFRESH_EXPIRATION_TIME_COOKIE=1296000
- DB="name_of_database"
- DBhost="database_host_address"
- DBport=3306
- DBuser="user_name"
- DBpassword= "password"
- NODE_ENV= "development" || "production"
- MAXNUMBEROFGAMES=12

Next you have to install the modules, build react app and move it to server folder and run the server. You can do that by running 'npm run install-modules', 'npm run build-react' and 'npm run-server' (or you can use 'npm run initial') from base location.

## Project Status
Project is: _in progress_

## Acknowledgements
This project is using icons from [_freeiconshop.com_](https://freeiconshop.com/)
Many thanks to [_Web Dev Simplified_](https://www.youtube.com/c/WebDevSimplified)

##Contact
Created by [pajavilc](https://github.com/pajavilc) - feel free to contact me!
