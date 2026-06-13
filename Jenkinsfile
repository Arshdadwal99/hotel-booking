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
        CONTAINER_NAME = 'hotel-booking'
        APP_PORT = '3000'
        PUBLIC_PORT = '80'
        EC2_HOST = '54.158.0.104'
        EC2_INSTANCE_ID = 'i-0bb79df4b2f7419e7'
        AWS_REGION = 'us-east-1'
        HEALTH_URL = 'http://54.158.0.104/'
        DEPLOYMENT_TRANSPORT = 'ssm'
        DOCKER_HUB_CREDENTIALS_ID = 'dockerhub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                    docker compose down --remove-orphans || true
                    docker compose build
                    docker compose up -d
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
