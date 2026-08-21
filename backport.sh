git reset HEAD~1
rm ./backport.sh
git cherry-pick a4eb75df3abf57660c3ac1ccca57c3e93c64d0bd
echo 'Resolve conflicts and force push this branch.\n\nTo backport translations run: bin/i18n/merge-translations <release-branch>'
