echo "Deploy EKS cluster!"
cd aws/eks/default
terraform init
terraform apply -target="module.vpc" -auto-approve
terraform apply -target="module.eks" -auto-approve
terraform apply -auto-approve
aws eks update-kubeconfig --name infra-kubernetes-prd --region us-east-1
kubectl create ns argocd
kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml -n argocd
kubectl port-forward -n argocd svc/argocd-server 8080:80 &
argocd login localhost:8080 --insecure --username admin --password $(kubectl get secrets argocd-initial-admin-secret -n argocd --template="{{index .data.password | base64decode}}")
argocd app create self-service --repo https://github.com/cloud-burger/self-service.git --path infrastructure/gitops/argocd/workloads/self-service --dest-server https://kubernetes.default.svc --dest-namespace argocd
echo "Deploy done!"