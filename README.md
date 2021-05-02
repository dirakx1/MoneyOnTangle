# MoneyOnTangle

Transfer stable coins  on the tangle. 
<img src="./EasyGiro.png">


Money transactions can be represented as data transfer into the tangle,
the real world use of the data depends on the interaction api. 

## IOTA 

* IOTA makes possible to do real time transactions, 
in our case stable coin transfers!. (these transactions are "feeless" and can be "microtransactions") 
* IOTA ledger use and specifics are docummented in [iotacore](/iotacore/README.md)

## Interaction API

The interaction api is in charge of exposing MoneyOnTangle features to other kinds of applications.  

* The interaction api specifics are documented on [apicore](https://github.com/jcortes/easygiro-server)

### Infrastructure considerations 

* Microservice oriented arquitecture on k8s (GCP or AWS or others).

## Clients
* Clients can be any IOT devices (smartphones, smartwatch, laptops..) 

## Use cases. 
* International stable coin transfers
* Local stable coin transfers 
* [business case](bussiness-case-study.md)





