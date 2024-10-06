#! /bin/sh

set -e

echo "Deploying..."

# add ssh authorized keys -> connect project owner
SERVER=""
SERVER_PATH="/tmp/tmp"
SERVER_SCRIPTS_PATH="/home/deploy_web_scripts"


  echo "Making tarball ..."
  tar -czf xxx.tgz dist/
  echo "---- done"

  echo "copy xxx.tgz from localhost to server ..."
  rsync -avz --progress xxx.tgz root@$SERVER:$SERVER_PATH
  echo "---- done"

  echo "Execute script, copy new files, and restart nginx"
  ssh root@$SERVER sh $SERVER_SCRIPTS_PATH/refresh_web.sh xxx
  echo "---- done"

  # echo "clelar tarbarll ..."
  # rm -f xxx.tgz
  # echo "done"

### root@104.168.94.105:/home/deploy_web_scripts/refresh_web.sh ###
# #! /bin/sh

# set -e
# cp -f /tmp/xxx_tmp/xxx.tgz /tmp/xxx_tmp/xxx.tgz.bak
# cp -f /tmp/xxx_tmp/xxx.tgz /usr/share/nginx/html/xxx/xxx.tgz
# tar -xzvf /usr/share/nginx/html/xxx/xxx.tgz -C /usr/share/nginx/html/xxx/

# # Test & Reload Nginx
# nginx -t
# nginx -s reload

###
