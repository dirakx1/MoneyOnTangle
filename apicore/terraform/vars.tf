# variables for easygiro apicore terraform GCP recipe

variable "project_id" {
  default = ""
}

variable "billing_account_id" {
  default = ""
}

variable "environment" {
  default = "dev"
}

variable "network" {
  default = "" # NETWORK name
}

variable "routing_mode" {
  default = "GLOBAL"
}

variable "project_network_id" {
  default = ""
}

variable "shared_vpc_host" {
  default = "true"
}

variable "subnetwork" {
  default = ""
}

variable "project_name" {
  default = ""
}

variable "cluster_name" {
  default = "easygiro-cluster-dev"
}

variable "description" {
  default = "Easygiro apicore"
}

variable "apis" {
  default = ["bigquery-json.googleapis.com",
    "pubsub.googleapis.com",
    "cloudfunctions.googleapis.com",
    "dataflow.googleapis.com",
  ]
}

variable "bucket_id" {
  default = "easygiro_dev"
}

variable "machine_type" {
  default = "n1-standard-1"
} # cluster machine_type

variable "db_machine_type" {
  default = "db-n1-standard-1"
} # cloud sql machine_type
