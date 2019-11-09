# Terraform

Terraform recipe for making a IOTA full node for easygiro.

## Minimal requirements

 * 8GB of storage (go for 12GB if you want to use some monitoring such grafana). Space does not have to be larger than 30GB
 * 2 cores (can works with 1 too but not recommended)
 * 4GB of RAM
 
 ## Steps 
 
* Install IRI

git clone https://github.com/iotaledger/iri
cd iri
mvn clean compile && mvn package

* Install neighbors

Install statics neighbors addresses in order to run your full node. you could have up to have 4,5 neighbors on basic configuration (4gb RAM, 1/2 cores), less than 3 and your node will be too slow and not more than 7.

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

 ## References
 * https://github.com/iotaledger/iri
