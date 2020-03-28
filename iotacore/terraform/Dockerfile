# Dockerfile for private node installation

FROM ubuntu:bionic-20200311
RUN apt-get update
RUN apt-get install -y pkg-config zip g++ zlib1g-dev unzip python \
apt-transport-https ca-certificates curl software-properties-common wget

## Download bazel installer 

RUN wget https://github.com/bazelbuild/bazel/releases/download/0.29.0/bazel-0.29.0-installer-linux-x86_64.sh
RUN chmod +x bazel-0.29.0-installer-linux-x86_64.sh
RUN ./bazel-0.29.0-installer-linux-x86_64.sh --user 

## Install docker 

RUN apt-get install -y docker.io
RUN docker --version

# Install jq

RUN apt-get install -y jq locate

## Clone and install compass 

RUN git clone https://github.com/iotaledger/compass.git
#COPY  ./repositories.bzl /root/.cache/bazel/_bazel_root/7204152f44cd9d3a6393832a12e06764/external/io_grpc_grpc_java/
#RUN cd compass && /root/.bazel/bin/bazel run //docker:layers_calculator
RUN cat /dev/urandom |LC_ALL=C tr -dc 'A-Z9' | fold -w 81 | head -n 1
RUN cd compass/docs/private_tangle

 
