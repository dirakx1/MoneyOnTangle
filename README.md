# EasyGiro -Libra

Distributed ledger for money transfer between clients, 
using libra framework  
<img src="./EasyGiro.png">


## Libra ledger

* Libra ledger makes possible to do real time transactions, 
in our case money transfers!.  
* Libra ledger use and specifics are docummented in [[libracore]]

## Interaction API

The interaction api is in charge of making calculations to change hard currency to 
iota and viceverza, also it makes posible communication with banks services.  

### The Interaction API is Python based

* The interaction api specifics are documented on [[apicore]]

### Infrastructure considerations 

* Microservice oriented arquitecture on k8s (GCP or AWS).
* The microservices convert Libra /to hardcurrency or hardcurrency to Libra 
and connect to banks APIs


## Notes
* Clients can be any devices. 
