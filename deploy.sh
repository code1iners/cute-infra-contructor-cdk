#!/bin/bash

set -e

instructions ()
{
  echo "*************************************************"
  echo "Run this script                                 *"
  echo "$ sh deploy.s <aws-profile>                         *"
  echo "*************************************************"
}

if [ $# -lt 1 ]; then
    echo "Invalid deploy command syntax.\nPlease enter valid command likely\n$ sh deploy.sh <aws-profile>"
    exit 1
fi

PROFILE="$1"

tsc
cdk synth --debug --profile "$PROFILE"
cdk deploy --debug --profile "$PROFILE"