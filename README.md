sudo snap install microk8s --classic

sudo usermod -aG microk8s ${USER}

sudo apt install docker.io

sudo usermod -aG docker ${USER}

reboot

microk8s.kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/mandatory.yaml

microk8s.enable helm dns ingress

watch microk8s.kubectl get pods -A

microk8s.kubectl create -f service-account-tiller.yaml

microk8s.helm init --service-account tiller --override spec.selector.matchLabels.'name'='tiller',spec.selector.matchLabels.'app'='helm' --output yaml | sed 's@apiVersion: extensions/v1beta1@apiVersion: apps/v1@' | microk8s.kubectl apply -f -

microk8s.helm init --client-only

microk8s.helm repo update

microk8s.helm install --name nginx stable/nginx-ingress

cd backend

docker build . -t tedjohansson/microk8s-tutorial-backend:latest

docker login

docker push tedjohansson/microk8s-tutorial-backend

microk8s.kubectl apply -f pv.yaml

microk8s.kubectl apply -f pvc.yaml

cd charts

microk8s.helm install --name backend backend

watch microk8s.kubectl get pods

cd ../../frontend

docker build . -t tedjohansson/microk8s-tutorial-frontend:latest

docker push tedjohansson/microk8s-tutorial-frontend

cd charts

microk8s.helm install --name frontend frontend

watch microk8s.kubectl get pods

## Monitoring
microk8s.helm install stable/graphite --name graphite --set persistence.enabled=false

microk8s.helm install stable/grafana --name grafana


