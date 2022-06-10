# nicknamer2
The next generation nicknamer bot.

# Installation
## Run using docker (this is the way I do it, and its probably the best way to run it).

1. Clone the repository
2. Cd into the directory
3. Rename `config.json.example` to `config.json` and fill it in.
4. Create `data` directory. Should be as easy as running `mkdir data`
5. Run `docker-compose up -d`

## Run minimally using docker (You don't have to manually download anything with this method)
Run this command `docker run -d -v nicknamer2db:/app/data -e token="PUT_TOKEN_HERE" smallketchup/nicknamer2` and make sure to replace the token environment variable with your token
