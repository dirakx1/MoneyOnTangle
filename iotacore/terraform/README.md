# Terraform

Terraform recipe for making a IOTA full node for easygiro.

## Minimal requirements

 * 8GB of storage (go for 12GB if you want to use some monitoring such grafana). Space does not have to be larger than 30GB
 * 2 cores (can works with 1 too but not recommended)
 * 4GB of RAM
 
# Install and configure Private Tangle and node

## Install dependencies. 
```
sudo apt-get install pkg-config zip g++ zlib1g-dev unzip python
```
## Download bazel installer 

```
wget https://github.com/bazelbuild/bazel/releases/download/0.18.0/bazel-0.18.0-installer-linux-x86_64.sh
chmod +x bazel-0.18.0-installer-linux-x86_64.sh
./bazel-0.18.0-installer-linux-x86_64.sh --user
sudo apt install apt-transport-https ca-certificates curl software-properties-common

```
## Install docker 
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
sudo apt install docker-ce
```
# Install jq
```
sudo add-apt-repository universe
sudo apt install jq
```

## Clone and install compass 

```
git clone https://github.com/iotaledger/compass.git
cd compass
bazel run //docker:layers_calculator
```
## Create seed 
* Create a backup for this seed. 
```
cat /dev/urandom |LC_ALL=C tr -dc 'A-Z9' | fold -w 81 | head -n 1 
```


 ## References
 * https://docs.iota.org/docs/compass/0.1/how-to-guides/set-up-a-private-tangle
 * https://github.com/iotaledger/iri
 * https://iri-playbook.readthedocs.io/en/master/getting-started-quickly.html
 * https://iota.partners/
 
 
