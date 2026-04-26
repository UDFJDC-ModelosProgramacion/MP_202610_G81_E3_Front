pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    npx sonar-scanner \
                    -Dsonar.projectKey=react-app \
                    -Dsonar.sources=src
                    '''
                }
            }
        }
    }
}