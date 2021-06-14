cd /home/ubuntu/app
curl -O https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem
yarn install
yarn build
pm2 start
cd ..