#!/bin/bash

cd ~/www/mean/BenApp/
echo -e "\nErasing contents of: $(pwd)"
read -p "Directory correct [Y/n]: " dir

[ 'y' == "$(echo $dir | awk '{print tolower($0)}')" ] || {
  read -p "Enter absolute path: " dir
  [ -d "$dir" ] && { cd $dir ; }
}

rm -rf *    && git reset --hard HEAD
npm install && grunt bower:install