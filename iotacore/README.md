# Iotacore for Easygiro


* Iotacore will be in charge of controlling money transactions. 

* As example we can interact with DEVNET for testing purposes, using a python/go/node/rust? client library 
(this is before we have our own node, that would be terraformed) for this purpose 
we can use: 
* https://github.com/iotaledger/iota.lib.py or 
* https://docs.iota.org/docs/iota-go/0.1/README or the lenguage of your preference.


## Requirements 

To test the interactions with IOTA using Pyota you have to install
the folowing dependencies. 

```
pip install pyota
pip install pyota[ccurl]
```

Also you can use the go client library, or the node library
for the node library you have to install:

```
npm install @iota/core
```

## Test Workflow for our Iotacore 

* Create a seed an store it

```
cat /dev/urandom |tr -dc A-Z9|head -c${1:-81} 
```
* Make test api requests, for our purpose using the python client:

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
also you can look into your unique transaction on the tangle explorer (https://devnet.thetangle.org/)
We are not sending tokens so a data transfer is enough to represent what we want!. 

# Example of money transfer in iotacore 

## Sending 10 usd.
 
## Recieving 10 usd. 


### Next steps

* Take a look at [apicore](/apicore/README.md), to interact with your bank or finantial institution services. 


