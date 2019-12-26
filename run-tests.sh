#!/bin/sh

start_datastore_emulator() {
  echo "Starting datastore emulator"

  nohup gcloud beta emulators datastore start --no-store-on-disk 1> /dev/null &
  $(gcloud beta emulators datastore env-init);

}

stop_datastore_emulator() {
  echo "\nStopping datastore emulator"
  $(gcloud beta emulators datastore env-unset);

  for pid in $(ps -aef | grep cloud-datastore-emulator/CloudDatastore.jar | awk '{ print $2 }'); do 
    kill -2 $pid 1>/dev/null 2>/dev/null;
  done;

  echo "\n"
}

run_tests() {
  NODE_ENV=test jest --env node;
  return $?;
}

start_datastore_emulator;
run_tests;
SUCCESS=$?;
stop_datastore_emulator;

if [ $SUCCESS == 0 ]; then
  exit 0;
else
  exit 1;
fi;