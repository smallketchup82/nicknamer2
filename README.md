# nicknamer2
The next generation nicknamer bot. Originally created for the purpose of *not* bullying my friend. This bot allows you to select a user in your server and update their nickname to any messages sent that the bot can see.

# Installation
## Run using docker (this is the way I do it, and its probably the best way to run it).

1. Clone the repository
2. Rename `config.json.example` to `config.json` and fill it in.
3. Create `data` directory. Should be as easy as running `mkdir data`
4. Run `docker-compose up -d`

## Run minimally using docker (You don't have to manually download anything with this method)
Run this command `docker run -d -v nicknamer2db:/app/data -e token="PUT_TOKEN_HERE" smallketchup/nicknamer2` and make sure to replace the token environment variable with your token  
https://hub.docker.com/r/smallketchup/nicknamer2
