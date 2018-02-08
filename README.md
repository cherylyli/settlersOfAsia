# Overview
- Online multiplayer game based on board Settlers of Catan.
- Web app. All JS.
- Tech stack: 
  - Front end: Vue, Jquery, SVG
  - Caching: Redis
  - DB: MongoDB
  - Real time Communication: Socket.io (Web Socket)
  - Back end: Node.js


# Setup
- First install Redis.
  - **Ubuntu**: Install Redis from http://redis.io/download
  - **Mac**: Install Redis from https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298#.4t3pcn264
  - **Mac**: if you have brew, then "brew install redis"
- Start redis server 
  ```sh
  $ redis-server
  ```
- Clone the repository and `cd` to project directory, and type `npm install` to install all the dependencies.


# Start server
Make sure Redis is running `locally` on port `6379`, then simply `cd` to project directory, and
```sh
$ npm start
```

# Test
- Log in/ Sign up
- Then you should be able to see the game lobby. You can join an existing game (if there is one in the lobby), or start a new game (continued saved game is not supported now).
![lobby](https://github.com/cherylyli/settlersOfAsia/blob/master/screenshots/Screenshot%20from%202018-02-07%2021-54-56.png)
- Once there are 3 ~ 4 players, game starts. (So you may need to log in with 3~4 different accounts in different broswers.)
![waiting](https://github.com/cherylyli/settlersOfAsia/blob/master/screenshots/Screenshot%20from%202018-02-07%2021-55-26.png)
![p1](https://github.com/cherylyli/settlersOfAsia/blob/master/screenshots/Screenshot%20from%202017-04-04%2017-55-44.png)
![p2](https://github.com/cherylyli/settlersOfAsia/blob/master/screenshots/Screenshot%20from%202017-04-12%2009-29-28.png)
![p3](https://github.com/cherylyli/settlersOfAsia/blob/master/screenshots/Screenshot%20from%202018-02-07%2021-57-42.png)
![p4](https://github.com/cherylyli/settlersOfAsia/blob/master/screenshots/Screenshot%20from%202018-02-07%2021-58-00.png)
# Document
- Check out Wiki if you have question about communication pattern and socket event tags.


(account: Emol (password: 1); Emol1 (1); Emol4 (4))
