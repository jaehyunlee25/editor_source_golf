git add -A
git commit -m 'deploy_dev_169'
git push origin main
ssh root@mnemosynesolutions.co.kr -t "cd /var/www/html/app/project/editor_source_golf; git pull origin main"
