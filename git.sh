#/bin/sh


git remote set-url origin git@github.com:AlexbavGamer/DiscordBot.git
git branch --set-upstream-to=origin/master master   
git fetch origin master
git reset --hard origin/master
git pull origin master --force