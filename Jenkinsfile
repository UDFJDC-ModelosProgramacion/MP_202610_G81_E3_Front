pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    bat '''
                    npx sonar-scanner ^
                    -Dsonar.projectKey=react-app ^
                    -Dsonar.sources=src
                    '''
                }
            }
        }
    }
}