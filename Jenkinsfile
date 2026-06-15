pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
        timeout(time: 45, unit: 'MINUTES')
        timestamps()
    }

    environment {
        PROJECT_TYPE = 'Node.js'
        REPOSITORY = 'Arshdadwal99/hotel-booking'
        BRANCH_NAME = 'master'
        DOCKER_IMAGE = 'arshdadwal99/hotel-booking'
        DOCKER_IMAGE_LATEST = 'arshdadwal99/hotel-booking:latest'
        CONTAINER_NAME = 'hotel-booking'
        APP_PORT = '8000'
        PUBLIC_PORT = '80'
        EC2_HOST = '3.80.23.25'
        EC2_INSTANCE_ID = 'i-0046f090224c7400c'
        AWS_REGION = 'us-east-1'
        HEALTH_URL = 'http://3.80.23.25/'
        DEPLOYMENT_TRANSPORT = 'ssm'
        DOCKER_HUB_CREDENTIALS_ID = 'dockerhub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """docker build -t "${env.DOCKER_IMAGE}:${env.BUILD_NUMBER}" -t "${env.DOCKER_IMAGE_LATEST}" ."""
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKER_HUB_CREDENTIALS_ID, usernameVariable: 'DOCKERHUB_USR', passwordVariable: 'DOCKERHUB_PSW')]) {
                    sh """
                        echo "\$DOCKERHUB_PSW" | docker login -u "\$DOCKERHUB_USR" --password-stdin
                        curl -fsS "https://hub.docker.com/v2/repositories/\$DOCKERHUB_USR/hotel-booking/" || curl -fsS -X POST "https://hub.docker.com/v2/repositories/" -u "\$DOCKERHUB_USR:\$DOCKERHUB_PSW" -H "Content-Type: application/json" -d '{"namespace":"'"\$DOCKERHUB_USR"'","name":"hotel-booking","description":"Auto-provisioned by DevOps Hub","is_private":false}'
                        docker push "${env.DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                        docker push "${env.DOCKER_IMAGE_LATEST}"
                    """
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                    docker compose -p hotel-booking down --remove-orphans || true
                    docker compose -p hotel-booking build
                    docker compose -p hotel-booking up -d
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    docker compose ps
                    curl -f http://localhost:3035 || exit 1
                    curl -f http://localhost:3034 || exit 1
                    curl -f http://localhost:3033 || exit 1
                '''
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f || true'
        }
        success {
            echo 'Jenkins Pipeline Generated and deployment completed successfully.'
        }
        failure {
            echo 'Jenkins pipeline failed. Review console logs for the failed stage.'
        }
    }
}
