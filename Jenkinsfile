pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
        timeout(time: 45, unit: 'MINUTES')
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Services') {
            steps {
                sh '''
                    docker compose build
                '''
            }
        }

        stage('Start Services') {
            steps {
                sh '''
                    docker compose up -d
                    sleep 60
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
            echo 'Deployment completed successfully.'
        }

        failure {
            echo 'Pipeline failed.'
        }
    }
}
