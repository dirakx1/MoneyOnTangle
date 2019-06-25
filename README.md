# EasyGiro

Distributed ledger for money transfer between clients. 
<img src="./EasyGiro.png">


## IOTA ledger

* The iota ledger makes possible to do real time transactions, 
in this case money transfering.  
* The iota ledger use is docummented in iotacore

## Interaction API

The interaction api is in charge of making calculations to change hard currency to 
iota and viceverza, also it makes posible comminication with banks services.  

### Python based API

* The interaction api will be documented on apicore

### Infrastructure considerations 

Microservice oriented arquitecture on k8s (GCP or AWS).
the microservices convert IOTA /to hardcurrency or hardcurrency to IOTA 
and connect to banks APIs


## Notes
* Clients can be any IOT devices. 
