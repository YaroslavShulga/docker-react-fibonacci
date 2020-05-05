# How to run!

## Apply configuration
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/cloud/deploy.yaml

## Check activation result
kubectl get svc -n ingress-nginx
