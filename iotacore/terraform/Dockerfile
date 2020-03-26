# Dockerfile for private node installation
FROM ubuntu:bionic-20200311
RUN apt-get update
RUN apt-get install pkg-config zip g++ zlib1g-dev unzip python \
apt-transport-https ca-certificates curl software-properties-common

## Download bazel installer 

RUN wget https://github.com/bazelbuild/bazel/releases/download/0.29.0/bazel-0.29.0-installer-linux-x86_64.sh
RUN chmod +x bazel-0.29.0-installer-linux-x86_64.sh
RUN ./bazel-0.29.0-installer-linux-x86_64.sh --user


## Install docker 

RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
RUN apt update
RUN apt install docker-ce

# Install jq

RUN add-apt-repository universe
RUN apt install jq

## Clone and install compass 

RUN git clone https://github.com/iotaledger/compass.git
RUN cd compass
RUN bazel run //docker:layers_calculator

