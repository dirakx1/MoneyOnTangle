# EasyGiro

Distributed ledger for money transfer between clients. 
<img src="./EasyGiro.png">


Money transacions are represented as data transfer into the tangle,
the real world use of the data depends on the interaction api. 

## IOTA ledger

* IOTA ledger makes possible to do real time transactions, 
in our case money transfers!.  
* IOTA ledger use and specifics are docummented in [[iotacore]]

## Interaction API

The interaction api is in charge of making calculations to change hard currency to 
iota and viceverza, also it makes posible communication with banks services.  

### The Interaction API is Python based

* The interaction api specifics are documented on [[apicore]]

### Infrastructure considerations 

* Microservice oriented arquitecture on k8s (GCP or AWS).
* The microservices can convert IOTA /to hardcurrency or hardcurrency to IOTA 
and connect to banks APIs

## Contact

If you wish invest/found this project please contact dirakx@gmail.com

## Clients
* Clients can be any IOT devices (smartphones, smartwatch, latops..)  

