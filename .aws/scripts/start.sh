cd /home/ubuntu/app
curl https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem
yarn install
yarn build
pm2 start
cd ..