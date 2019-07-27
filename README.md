# EasyGiro

Distributed ledger for money transfer between clients. 
<img src="./EasyGiro.png">


## IOTA ledger

* IOTA ledger makes possible to do real time transactions, 
in our case money transfers!.  
* IOTA ledger use is docummented in [[iotacore]]

## Interaction API

The interaction api is in charge of making calculations to change hard currency to 
iota and viceverza, also it makes posible communication with banks services.  

### The Interaction API is Python based

* The interaction api is documented on [[apicore]]

### Infrastructure considerations 

* Microservice oriented arquitecture on k8s (GCP or AWS).
* The microservices convert IOTA /to hardcurrency or hardcurrency to IOTA 
and connect to banks APIs


## Notes
* Clients can be any IOT devices. 
