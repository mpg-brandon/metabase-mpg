git reset HEAD~1
rm ./backport.sh
git cherry-pick abf7c47f3c5302fbb55577a944f63909d484d0ad
echo 'Resolve conflicts and force push this branch.\n\nTo backport translations run: bin/i18n/merge-translations <release-branch>'
