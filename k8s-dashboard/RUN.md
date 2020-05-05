# How to run!

#### Apply configuration
kubectl apply -f kubernetes-dashboard.yaml
#### Start server
kubectl proxy
#### Visit
http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/
