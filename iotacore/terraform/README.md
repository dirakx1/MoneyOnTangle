# Terraform

Terraform recipe for making a IOTA full node for easygiro.

## Minimal requirements

 * 8GB of storage (go for 12GB if you want to use some monitoring such grafana). Space does not have to be larger than 30GB
 * 2 cores (can works with 1 too but not recommended)
 * 4GB of RAM
 
 ## Steps 
 
* Install IRI

```
git clone https://github.com/iotaledger/iri
cd iri
mvn clean compile && mvn package
```

* Install neighbors

Install statics neighbors addresses in order to run your full node. you could have up to have 4,5 neighbors on basic configuration (4gb RAM, 1/2 cores), less than 3 and your node will be too slow and not more than 7 (based on your computation capacity).

```
cat << "EOF" | sudo tee iota.ini
[IRI]
PORT = 14265
UDP_RECEIVER_PORT = 14600
TCP_RECEIVER_PORT = 15600
API_HOST = 0.0.0.0
IXI_DIR = ixi
HEADLESS = true
DEBUG = false
TESTNET = false
DB_PATH = mainnetdb
RESCAN_DB = false

REMOTE_LIMIT_API = "removeNeighbors, addNeighbors, interruptAttachingToTangle, attachToTangle, getNeighbors, setApiRateLimit"

NEIGHBORS = 
EOF
```
* Search for neighbors
* Start IRI (replace y.y.y.y for iri version)
```
java -jar iri-y.y.y.y.jar -c iota.ini
```

* Install IRI tools
* Install CarrIOTA nelson https://github.com/SemkoDev/nelson.cli
Carriota nelson is “Nelson is a tool meant to be used with IOTA’s IRI Node. It automatically manages neighbors of your full node, negotiating connections, finding new neighbors and protecting against bad actors.”

* Install and start a nelson node. 

* Install CArrIOTA bolero node
CarrIOTA Bolero is a cross-platform desktop application (Windows, Mac & Linux) that lets you start an IOTA full node with a single click (using IRI & Nelson P2P). In other words, if it wasn’t “user-friendly” for people so far, it’s now basically just pressing a single button to launch your full node through bolero application

* If you need statistics and aditional security features install CarrIOTA field


 ## References
 * https://github.com/iotaledger/iri
 * https://iri-playbook.readthedocs.io/en/master/getting-started-quickly.html
 * https://iota.partners/
 
 
