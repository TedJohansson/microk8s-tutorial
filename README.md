sudo snap install microk8s --classic
sudo usermod -aG microk8s ${USER}

sudo apt install docker.io
sudo usermod -aG docker ${USER}

reboot
microk8s.enable helm dns

microk8s.kubectl create -f service-account-tiller.yaml

microk8s.helm init --service-account tiller --override spec.selector.matchLabels.'name'='tiller',spec.selector.matchLabels.'app'='helm' --output yaml | sed 's@apiVersion: extensions/v1beta1@apiVersion: apps/v1@' | microk8s.kubectl apply -f -

microk8s.helm init --client-only

microk8s.helm repo update

docker build . --tag tedjohansson/microk8s-tutorial:1

docker login

docker push tedjohansson/microk8s-tutorial:1

microk8s.kubectl port-forward svc/jenkins 8000:80



