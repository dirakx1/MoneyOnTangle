# This recipe is used for deploying
# a microservice distributed arquitecture for the easygiro apicore on GCP
#terraform {
#  backend "gcs" {
#    bucket = "" # CHANGE between environments
#  }
#}

locals {
  all_apis  = "${var.apis}"
  bucket_id = "${var.bucket_id}"
}

# [START] APIs definition - ENABLE all_apis

resource "google_project_service" "enabling_api" {
  count              = "${length(local.all_apis)}"
  project            = "${var.project_name}"
  service            = "${element(local.all_apis, count.index)}"
  disable_on_destroy = false
}

# [END] APIs definition

# [START] Bucket definition

resource "google_storage_bucket" "easygiro_project_bucket" {
  name          = "terraform-${local.bucket_id}"
  project       = "${var.project_name}"
  depends_on    = ["google_project_service.enabling_api"]
  force_destroy = "true"

  versioning = {
    enabled = "true"
  }
}

# [END] Bucket definition

# [START] GKE definiton

resource "google_container_cluster" "primary" {
  name                     = "${var.cluster_name}"
  project                  = "${var.project_name}"
  location                 = "us-east1"
  min_master_version       = "1.13.6-gke.6"
  remove_default_node_pool = true

  initial_node_count = 3

  # Setting an empty username and password explicitly disables basic auth
  master_auth {
    username = ""
    password = ""
  }
}

resource "google_container_node_pool" "primary_preemptible_nodes" {
  name       = "easygiro-dev-node-pool"
  project    = "${var.project_name}"
  location   = "us-east1"                                 # TODO Should be multizone for PROD
  cluster    = "${google_container_cluster.primary.name}"
  node_count = 1

  node_config {
    preemptible  = true
    machine_type = "${var.machine_type}"

    metadata {
      disable-legacy-endpoints = "true"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write", # TODO could be on vars - oauth scopes for cluster
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}

# [END] GKE definiton

# [START] Cloud sql definition

resource "google_sql_database_instance" "master" {
  name             = "sql-instance-easygiro-dev" # TODO could be on vars
  project          = "${var.project_name}"
  database_version = "MYSQL_5_6"

  region = "us-east1" # NOTE could be changing depending on dev/qa/etc

  settings {
    tier = "${var.db_machine_type}"
  }
}

# [END] Cloud sql definition