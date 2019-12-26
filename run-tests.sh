#!/bin/sh

################################
# FUNCTIONS                    #
################################

# Starts a Datastore emulator for running tests
start_datastore_emulator() {
  echo "Starting datastore emulator"

  nohup gcloud beta emulators datastore start --no-store-on-disk 1> /dev/null &
  $(gcloud beta emulators datastore env-init);

}

# Stops the datastore emulator by finding its PID and sending a SIGINT (2) to it
stop_datastore_emulator() {
  echo "\nStopping datastore emulator"
  $(gcloud beta emulators datastore env-unset);

  for pid in $(ps -aef | grep cloud-datastore-emulator/CloudDatastore.jar | awk '{ print $2 }'); do 
    kill -2 $pid 1>/dev/null 2>/dev/null;
  done;

  echo "\n"
}

# Run all tests
run_tests() {
  NODE_ENV=test jest --env node;
  # Return the exit code to know whether to deploy or not
  return $?;
}

# Run all tests matching the first parameter (a suite name or a test name)
run_filtered_tests() {
  NODE_ENV=test jest --env node -t $1
  
  # Same behavior as run_tests, although one shall not deploy after a filtered run
  return $?;
}

################################
# MAIN PROGRAM                 #
################################

start_datastore_emulator;

# If no parameter is given, run all tests
# Else it is a filtered run
if [ -z "$1" ]; then
  run_tests;
else
  run_filtered_tests $1
fi;
SUCCESS=$?;

stop_datastore_emulator;

# Return the result of the jest call
# to determine wether to deploy or not
if [ $SUCCESS == 0 ]; then
  exit 0;
else
  exit 1;
fi;