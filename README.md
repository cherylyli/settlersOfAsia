# Try out demo!
- cloud9: https://settlers-cherylyli.c9users.io/
- AWS: http://settlers-env.us-east-1.elasticbeanstalk.com/login

# Setup
- **Ubuntu**: Install Redis from http://redis.io/download
- **Mac**: Install Redis from https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298#.4t3pcn264
- **Mac**: if you have brew, then "brew install redis"
- Then learn how to **start** and **stop** your redis server
- `cd` to project directory, and type `npm install`


# Start server
Make sure Redis is running `locally` on port `6379`, then simply `cd` to project directory, and
```sh
$ node app.js
```

# Test
- Open `localhost:3000` on your browser, if an alert pops up, then it works!

# Document
- Check out Wiki if you have question about communication pattern and socket event tags.



# Use cases

## Trade with player

- Initiator of a trade sends trade request to the server
- Server forwards trade request ACK to all other player
- Player accepts the trade
	- Player sends accept trade to server
	- Server appends accept trade to list of current trade
	- Initiator of trade chooses trade
	- Initiator his choice to the server
	- Server does transaction

"A19Qs" - year of plenty