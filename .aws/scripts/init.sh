pm2 delete all
if [ -d "/home/ubuntu/app" ]; then rm -Rf "/home/ubuntu/app"; fi
apt install -y build-essential