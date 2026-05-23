pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

        stage('Execute Tests & Coverage') {
            steps {
                bat 'npm run test:coverage' 
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    bat '''
                    npx sonar-scanner ^
                    -Dsonar.projectKey=react-app ^
                    -Dsonar.sources=src ^
                    -Dsonar.tests=cypress ^
                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }
    }
}