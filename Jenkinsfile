def label = "worker-${UUID.randomUUID().toString()}"
def docker_image = 'tedjohansson/microk8s-tutorial'
def docker_tag = '2'

podTemplate(label: label, containers: [
    containerTemplate(name: 'helm', image: 'lachlanevenson/k8s-helm:v2.14.0', command: 'cat', ttyEnabled: true),
    containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true)
    ],
volumes: [
  hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
], imagePullSecrets: [ 'docker-registry-credentials' ]) {
    node(label) {
        checkout scm
        stage('Push Docker Image') {
			container('docker') {
				withCredentials([[$class: 'UsernamePasswordMultiBinding',
					credentialsId: 'docker',
					usernameVariable: 'USER',
					passwordVariable: 'PASSWORD']]) {
					sh """
					    docker login -u ${USER} -p ${PASSWORD}
					    docker build -t ${docker_image}:${docker_tag} .
					    docker push ${docker_image}
					"""
				}
				sh "docker rmi ${docker_image}:${docker_tag}"
			}
        }
        stage('Deploy') {
            container('helm') {
                dir('charts') {
                    sh "helm upgrade microk8s-tutorial microk8s-tutorial --install"
                }
            }
        }
    }
}
