#!/bin/bash
set -xe

echo "Deploying EKS cluster!"
cd ../infrastructure/aws/eks/default
terraform init
terraform apply -auto-approve
echo "Deploying ArgoCD!"
aws eks update-kubeconfig --name infra-kubernetes-prd --region us-east-1
kubectl create ns argocd
kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml -n argocd
sleep 120
kubectl port-forward -n argocd svc/argocd-server 8080:80 > /dev/null 2>&1 &
sleep 15
argocd login localhost:8080 --insecure --username admin --password $(kubectl get secrets argocd-initial-admin-secret -n argocd --template="{{index .data.password | base64decode}}")
echo "Deploying self-service workload!"
argocd app create self-service --repo https://github.com/cloud-burger/self-service.git --revision main --path infrastructure/gitops/argocd/self-service --dest-server https://kubernetes.default.svc --dest-namespace argocd --directory-recurse --sync-policy automated --sync-option ApplyOutOfSyncOnly=true
kubectl rollout restart deployment istio-ingress -n istio-ingress
sleep 5
echo "Deploy done!"
dns=$(kubectl get svc -n istio-ingress istio-ingress -o jsonpath="{.status.loadBalancer.ingress[*].hostname}")
echo " 
################################################################
################################################################

###  UTILIZE OS DADOS ABAIXO PARA REALIZAR CHAMADAS Á API:
###  ENDEREÇO: $dns
###  HOST: api.cloudburger.com.br

################################################################
################################################################
"