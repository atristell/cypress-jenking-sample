// Example Jenkins pipeline with Cypress end-to-end tests running in parallel on 2 workers
// Pipeline syntax from https://jenkins.io/doc/book/pipeline/

// Setup:
//  before starting Jenkins, I have created several volumes to cache
//  Jenkins configuration, NPM modules and Cypress binary

// docker volume create jenkins-data
// docker volume create npm-cache
// docker volume create cypress-cache

// Start Jenkins command line by line:
//  - run as "root" user (insecure, contact your admin to configure user and groups!)
//  - run Docker in disconnected mode
//  - name running container "blue-ocean"
//  - map port 8080 with Jenkins UI
//  - map volumes for Jenkins data, NPM and Cypress caches
//  - pass Docker socket which allows Jenkins to start worker containers
//  - download and execute the latest BlueOcean Docker image

// docker run \
//   -u root \
//   -d \
//   --name blue-ocean \
//   -p 8080:8080 \
//   -v jenkins-data:/var/jenkins_home \
//   -v npm-cache:/root/.npm \
//   -v cypress-cache:/root/.cache \
//   -v /var/run/docker.sock:/var/run/docker.sock \
//   jenkinsci/blueocean:latest

// If you start for the very first time, inspect the logs from the running container
// to see Administrator password - you will need it to configure Jenkins via localhost:8080 UI
//    docker logs blue-ocean

pipeline {
  agent {
    // this image provides everything needed to run Cypress
    docker {
      image 'cypress/base:10'
    }
  }
  
  environment { 
    CI = 'true'
  }

  stages {
    // first stage installs node dependencies and Cypress binary
    stage('build') {
      steps {
        // there a few default environment variables on Jenkins
        // on local Jenkins machine (assuming port 8080) see
        // http://localhost:8080/pipeline-syntax/globals#env
        echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
        sh 'wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb'
        sh 'dpkg -i google-chrome-stable_current_amd64.deb'
        sh 'apt-get install fonts-liberation libappindicator3-1 lsb-release xdg-utils'
        sh 'google-chrome --version'

        
        sh 'node --version'
        sh 'npm install'
        sh 'node_modules/.bin/cypress verify'
        sh 'node_modules/.bin/cypress --version'
        sh 'node_modules/.bin/ember -v'
      }
    }

    stage('test ember') {
      steps {
        sh 'node_modules/.bin/ember test'
      }
    }    
    
    stage('test e2e') {
      steps {
        sh 'npm run teste2e:ci'
      }
    }    
  }

  post {
    always {
      echo 'One way or another, I have finished'
        //junit 'build/reports/**/*.xml'
        //deleteDir() /* clean up our workspace */
    }
    success {
      echo 'I succeeeded!'
       mail to: 'agarciat@eprinsa.es',
        subject: "Correct Pipeline: ${currentBuild.fullDisplayName}",
        body: "Todo OK ${env.BUILD_URL}"
    }
    unstable {
      echo 'I am unstable :/'
    }
    failure {
      echo 'I failed :('
    }
    changed {
      echo 'Things were different before...'
    }
  }

}
