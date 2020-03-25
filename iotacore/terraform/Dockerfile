# Dockerfile for private node installation

RUN sudo apt-get install pkg-config zip g++ zlib1g-dev unzip python \
apt-transport-https ca-certificates curl software-properties-common

## Download bazel installer 

RUN wget https://github.com/bazelbuild/bazel/releases/download/0.18.0/bazel-0.18.0-installer-linux-x86_64.sh
RUN chmod +x bazel-0.18.0-installer-linux-x86_64.sh
RUN ./bazel-0.18.0-installer-linux-x86_64.sh --user


## Install docker 

RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
RUN sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
RUN sudo apt update
RUN sudo apt install docker-ce

# Install jq

RUN sudo add-apt-repository universe
RUN sudo apt install jq

## Clone and install compass 

RUN git clone https://github.com/iotaledger/compass.git
RUN cd compass
RUN bazel run //docker:layers_calculator

