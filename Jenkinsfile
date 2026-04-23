pipeline {
  agent any

  options {
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        sh 'npx playwright install'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npx playwright test --project=general'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**, test-results/**', allowEmptyArchive: true
    }
  }
}
