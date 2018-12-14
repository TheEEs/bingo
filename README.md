# Bingo 

> An online version of the bingo paper game

![Screenshot-from-2018-12-07-00-16-18.png](https://uphinhnhanh.com/images/2018/12/06/Screenshot-from-2018-12-07-00-16-18.png)

## Components
* **VueJS** : the basebone framework for designing components
* **Animate.css** : JS library for animating 
* **Typed.js** : Typeing effect
* **Noty** : Notifications
* **Vue-Pose** : For creating animated UI components for VueJS
* **ChuckCSS** : CSS framework
* **deepstream.io** : For handing realtime connection and realtime data synchronization
* **lodash** : Js utilities library
* **FontAwesome** : For styling text

## Introduction
In the boardgame version, two players will have their own 5x5 tables which are made of 1->25 permutations. Alternatively, each player say a number and both of them circle the corresponding position of that number. After some rounds , the person who first has 5 lines made of picked number's positions will be the winner. In case your picked number make the other player win, even if you have 5 lines, you still lose the game.
> In this online version, rules are the same.

## Usage
First you need to install **deepstream.io** server via NPM :
```bash
sudo npm install -g deepstream.io
deepstream start
#will start the deepstream server on 0.0.0.0:6020
```
then: 
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

Once you have built the source code, just serve it over http via an web-server such as **nginx**, **Apache** or **serve**, ..etc..
