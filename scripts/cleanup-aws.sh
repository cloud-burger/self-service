#!/bin/bash
set -xe

cd ../iac/aws/eks/default
terraform destroy -auto-approve
rm -rf .terraform*
rm -rf terraform.tfstate*
rm -rf aws
cd ../../../../scripts