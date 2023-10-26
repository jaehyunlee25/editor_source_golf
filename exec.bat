git add -A
git commit -m 'deploy_168'
git push origin main
ssh root@mnemosynesolutions.co.kr -t "cd /var/www/html/app/project/editor_source_golf; git pull origin main"
