cd /home/ubuntu/app
rm ecosystem.config.js
mv .aws/scripts/ecosystem.config.js .
curl -O https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem
yarn install --prod
yarn build
pm2 start
cd ..