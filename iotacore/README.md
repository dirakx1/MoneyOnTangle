# Iotacore for easygiro


* Iotacore will be in charge of controlling money transactions. 

* As example we can interact with DEVNET for testing purposes, using a python/go/node client library 
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
node test_node.js
```


* Send a transaction to a node in our case a money representation transaction. 


After tests you can be sure that you can use iotacore. 