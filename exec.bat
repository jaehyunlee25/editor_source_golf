git add -A
git commit -m 'renew'
git push origin main
ssh root@mnemosynesolutions.co.kr -t "cd /var/www/html/app/project/editor_source_golf; git pull origin main"
