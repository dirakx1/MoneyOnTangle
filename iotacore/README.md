# Iotacore for easygiro


* Iotacore will be in charge of controlling money transactions. 

* As example we can interact with DEVNET for testing purposes, using a python/go/node/rust? client library 
(this is before we have our own node, that would be terraformed) for this purpose 
we use: 
* https://github.com/iotaledger/iota.lib.py or 
* https://docs.iota.org/docs/iota-go/0.1/README


## Requirements 

To test the interactions with IOTA using Pyota you have to install
the folowing dependencies. 

* pip install pyota
* pip install pyota[ccurl]

But you can also use the go client library, or the node library
for the node library you have to install:

* npm install @iota/core


## Test Workflow for our Iotacore 

* Create a seed an store it

```
cat /dev/urandom |tr -dc A-Z9|head -c${1:-81} 
```
* Make test api requests, for our purpose usign the python client:
```
python iota.lib/hello_world.py
```
Or: 

```
node node_working/test-node.js
```

* Send a test money transaction to a node. 

```
node node_working/data-transaction.js
```

After tests you can be sure that you can use iotacore!. 
We are not sending tokens so a data trasnfer is enough to represent what we want!. 

# Money transfer in iotacore 



