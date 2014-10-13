# !/bin/sh

cd $(dirname $0)

rsync -av deploy@42.121.19.191:/exprodata/backup/passpro .

sh restoredata.sh