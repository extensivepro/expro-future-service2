# !/bin/sh

cd $(dirname $0)

mongo passpro-test --eval 'db.dropDatabase()'
mongorestore -d passpro-test passpro

mongo passpro-dev --eval 'db.dropDatabase()'
mongorestore -d passpro-dev passpro