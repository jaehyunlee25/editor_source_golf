git add -A
git commit -m 'writer_error_mod'
git push origin main
ssh root@mnemosynesolutions.co.kr -t "cd /var/www/html/app/project/editor_source_golf; git pull origin main"
