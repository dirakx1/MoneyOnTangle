# Iotacore for easygiro


* Iotacore will be in charge of controlling money transactions. 

* As example we can interact with DEVNET for testing purposes, using a python or go client library 
(this is before we have our own node, that would be terraformed) for this purpose 
we use: 
* https://github.com/iotaledger/iota.lib.py or 
* https://docs.iota.org/docs/iota-go/0.1/README


## Requirements 

To test the interactions with IOTA using Pyota you have to install
the folowing dependencies. 

* pip install pyota
* pip install pyota[ccurl]

But you can also use the go client library. 


## Test Workflow for our Iotacore 

* Create a seed an store it

```
cat /dev/urandom |tr -dc A-Z9|head -c${1:-81} 
```
* Make test api requests, for our purpose usign the python client:
```
python iota.lib/hello_world.py
```
* Send a transaction to a node. 


After test are donr you can be sure that you can use iotacore. 