#!/bin/groovy
def config = [
        applicationName: "lambda-to-clean-cognito",
        buildCommand   : "yarn && yarn build && yarn package",
]

pipeline {

    agent { label "docker" }

    stages {
        stage('Build Code/Packages: Test') {
            steps {
                script {
                    checkout scm
                    sh config.buildCommand
                }
            }
        }

    }
}