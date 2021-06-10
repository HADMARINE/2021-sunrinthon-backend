#!/bin/bash
echo "Health check started"

for RETRY_COUNT in {1..15}
do
  RESPONSE=$(curl -s http://localhost/status)
  UP_COUNT=$(echo $RESPONSE | grep 'UP' | wc -l)

  if [ $UP_COUNT -ge 1 ]
  then
      echo "> Health check success"
      break
  else
      echo "> Health check failed"
  fi

  if [ $RETRY_COUNT -eq 10 ]
  then
    echo "Health check failed"
    exit 1
  fi

  echo "Health check retrying..."
  sleep 10
done
exit 0