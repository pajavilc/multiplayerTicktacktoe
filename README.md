# Ticktacktoe Server
> An online ticktacktoe game. Live demo [_here_](https://tttproj.ddns.net/).

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Project Status](#project-status)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)

## general information
>A multiplayer ticktacktoe game running on react + node.js + mysql.
>This is my personal project made for educational purposes.

## features
- 1 v 1 ticktacktoe
- spectator mode
- chat
- statistics

## screenshots
<p float=left>
<img src='https://user-images.githubusercontent.com/62508683/159980386-2d49d93e-3772-424d-bff6-63c37a54024f.png' width=200px style='display: inline-block;'/>

<img src='https://user-images.githubusercontent.com/62508683/159984441-86c2c29d-7a7c-47c7-ac06-016abc354069.png' width=200px style='display: inline-block;'/>
	
<img src='https://user-images.githubusercontent.com/62508683/159980804-45513326-1b47-4ecf-9d30-c69d5d461660.png' height=200px style='display: inline-block;'/>
</p>

## technologies Used
- Node.js - 16.14.1
- mariadb - 10.5
- express - 4.17.2
- jsonwebtoken - 8.5.1
- react - 17.0.2
- cors - 2.8.5
- redux - 4.1.2
- ws

## setup
First, you need to [_install MySQL_](https://dev.mysql.com/doc/mysql-getting-started/en) and set it up. The file createTables.session.sql in the DATABASE folder contains two query commands with which you can create necessary database tables.

You also need to install NodeJS from [_here_](https://nodejs.org/en/download/). 

Next you have to create .env in server and include all of the variables from .env.example:
	
  Example:
  
```- PORT= 2500

- ACCESS_SECRET_TOKEN='longSequenceOfChars'

`- REFRESH_SECRET_TOKEN='longSequenceOfChars'`

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
```

Next you have to install the modules, build react app and move it to server folder and run the server. You can do that by running <code>npm&nbsp;run&nbsp;install-modules</code>, <code>npm&nbsp;run&nbsp;build-react</code> and <code>npm&nbsp;run&nbsp;run-server</code> (or you can use <code>npm&nbsp;run&nbsp;initial</code>) from base location.

> Note: Production build needs an ssl cert and private key included in ssl folder (+ `SSLPORT=` var in .env)

## project Status
Project is: _in progress_

## acknowledgements
This project is using icons from [_freeiconshop.com_](https://freeiconshop.com/)

Many thanks to [_Web Dev Simplified_](https://www.youtube.com/c/WebDevSimplified) for his tutorials and tips regarding js and css. 

## contact
Created by [pajavilc](https://github.com/pajavilc) - feel free to contact me!
