echo "Deploy EKS cluster!"
cd aws\eks\default
terraform init
terraform apply -target="module.vpc" -auto-approve
terraform apply -target="module.eks" -auto-approve
terraform apply -auto-approve

echo "Deploy done!"