// Jenkinsfile
pipeline {
    agent any // 讓 Jenkins 在任何可用的代理上執行

    environment {
        // 設定 Node.js 版本，確保 Jenkins 的 Node.js 外掛有安裝並正確配置
        // 如果您的 Jenkins 環境中 Node.js 工具是手動安裝或通過其他方式設置，可以移除這行
        // 通常在 Jenkins -> Manage Jenkins -> Global Tool Configuration -> NodeJS 中配置
        NODE_HOME = tool 'node' // 'Node.js 20.19.1' 是您在 Jenkins 配置的 Node.js 安裝名稱
        PATH = "${NODE_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                // 從 Git 倉庫拉取程式碼
                git branch: 'main', url: 'https://github.com/Andygggg/react_shoppingstore'
                // 如果是私有倉庫，需要加入 credentialsId: 'your-git-credentials-id'
                // git branch: 'main', credentialsId: 'your-git-credentials-id', url: 'https://github.com/your-username/your-vue-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // 確保在 Vue 專案的根目錄下執行 npm install
                    // 如果您的 package.json 不在 Git 倉庫根目錄，請調整 cd 命令
                    sh 'npm install'
                }
            }
        }

        stage('Build Vue Project') {
            steps {
                script {
                    sh 'npm run build' // 執行 Vue 專案的打包命令
                    // 打包後的檔案通常會在專案目錄下的 'dist' 資料夾
                }
            }
        }

        stage('Deploy to Local Webserver') {
            steps {
                // 部署策略：使用共享 Docker Volume (推薦且符合您的 Docker Compose 設定)
                // 1. 確認您的 docker-compose.yml 已經有類似下面的共享 volume 配置：
                //    volumes:
                //      static_data:
                //
                //    services:
                //      nginx:
                //        volumes:
                //          - static_data:/usr/share/nginx/html # Nginx 從這個 volume 讀取
                //
                //      jenkins:
                //        volumes:
                //          - static_data:/var/jenkins_home/workspace/webserver_output # Jenkins 寫入到這裡
                //
                // 2. 如果您沒有重新啟動 Docker Compose，請執行 `docker-compose down && docker-compose up -d` 讓 Volume 生效。
                // 3. 確保 /var/jenkins_home/workspace/webserver_output 是 Jenkins 容器內共享 Volume 的掛載點。
                sh 'cp -r dist/* /var/jenkins_home/workspace/webserver_output/'
                sh 'chmod -R 755 /var/jenkins_home/workspace/webserver_output/' // 設定正確權限讓 Nginx 可以讀取
            }
        }
    }

    post {
        always {
            cleanWs() // 清理 Jenkins Workspace，釋放空間 (可選，但建議)
        }
        success {
            echo 'Vue project built and deployed successfully!'
        }
        failure {
            echo 'Vue project build or deployment failed!'
        }
    }
}