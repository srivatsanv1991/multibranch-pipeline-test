pipeline{
agent {
docker{
image 'node:6-alpine'
args '-p 3000:3000 -p 5000:5000'
}
}

environment{
CI = 'true'
}
stages{
stage('Hello'){
steps{
echo 'Hello World'
}
}

stage('Build'){
steps{
sh 'npm install'
}
}
stage ('Deploy'){
            steps{
                sh 'HTTPS=true npm start & > log.txt'
                input message: 'If you have finished accessing the wesbite? (click "Proceed")'
            }
        }




}

}
