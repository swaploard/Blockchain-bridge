#!/bin/sh

# Check if AGE key is provided via environment variable
if [ ! -z "$SOPS_AGE_KEY" ]; then
    # Create the key file from environment variable
    echo "$SOPS_AGE_KEY" > /home/appuser/.config/sops/age/keys.txt
    chmod 600 /home/appuser/.config/sops/age/keys.txt
fi

# Decrypt the environment file
if [ -f .env.enc ]; then
    sops --input-type dotenv --output-type dotenv --decrypt .env.enc > .env || exit 1
fi

# Execute the main command

exec npm run start
