#!/bin/bash 

sudo apt update -y

sudo apt install net-tools -y

sudo apt install software-properties-common gnupg apt-transport-https ca-certificates -y

wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

sudo apt update -y

sudo apt install mongodb-org -y

sudo systemctl start mongod

sudo systemctl enable mongod

sudo apt update -y

sudo apt install -y nodejs npm

sudo git clone https://github.com/Bukola-Testimony/Ngo-application.git
