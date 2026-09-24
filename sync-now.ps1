$env:PATH = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:PATH

git config user.name "MaxShap98"
git config user.email "MaxShap98@users.noreply.github.com"
gh auth setup-git

# Check if origin exists, else add it
$existingRemote = git remote
if ($existingRemote -notcontains "origin") {
    git remote add origin https://github.com/MaxShap98/travel-website.git
} else {
    git remote set-url origin https://github.com/MaxShap98/travel-website.git
}

# Ensure branch is master
git branch -M master

# Stage all files
git add -A

# Commit
git commit -m "Update travel planner: interactive itinerary, places builder, Firebase sync"

# Push to master
git push -u origin master --force
