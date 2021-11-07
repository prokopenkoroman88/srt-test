

-----------------
7.11.21

D:\STEP\PHP\OSPanel\domains\srt-test


создал репозиторий

https://github.com/prokopenkoroman88/srt-test





…or create a new repository on the command line
echo "# srt-test" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/prokopenkoroman88/srt-test.git
git push -u origin main

…or push an existing repository from the command line
git remote add origin https://github.com/prokopenkoroman88/srt-test.git
git branch -M main
git push -u origin main

…or import code from another repository
You can initialize this repository with code from a Subversion, Mercurial, or TFS project.







открыл Bash



Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test
$ git init
Initialized empty Git repository in D:/STEP/PHP/OSPanel/domains/srt-test/.git/

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git remote add origin https://github.com/prokopenkoroman88/srt-test.git

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git remote -v
origin  https://github.com/prokopenkoroman88/srt-test.git (fetch)
origin  https://github.com/prokopenkoroman88/srt-test.git (push)

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git status
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        css/
        images/
        index.html
        js/
        srt-readme.txt

nothing added to commit but untracked files present (use "git add" to track)

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git add .

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git commit -m "create classes for work with canvas"
[master (root-commit) 9a674ee] create classes for work with canvas
 13 files changed, 842 insertions(+)
 create mode 100644 css/style.css
 create mode 100644 images/favicon.png
 create mode 100644 images/units/man.bmp
 create mode 100644 images/z0.bmp
 create mode 100644 images/z1.bmp
 create mode 100644 images/z2.bmp
 create mode 100644 index.html
 create mode 100644 js/canvas/CustomCanvas.js
 create mode 100644 js/canvas/RealCanvas.js
 create mode 100644 js/canvas/VirtualCanvas.js
 create mode 100644 js/script.js
 create mode 100644 js/system.js
 create mode 100644 srt-readme.txt

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git push -u origin master
Enumerating objects: 20, done.
Counting objects: 100% (20/20), done.
Delta compression using up to 2 threads
Compressing objects: 100% (17/17), done.
Writing objects: 100% (20/20), 44.76 KiB | 1.60 MiB/s, done.
Total 20 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (2/2), done.
To https://github.com/prokopenkoroman88/srt-test.git
 * [new branch]      master -> master
Branch 'master' set up to track remote branch 'master' from 'origin'.

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$





Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   js/canvas/CustomCanvas.js
        modified:   js/canvas/RealCanvas.js
        modified:   srt-readme.txt

no changes added to commit (use "git add" and/or "git commit -a")

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git add .

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git commit -m "changes with canvas"
[master 9a9b207] changes with canvas
 3 files changed, 96 insertions(+), 1 deletion(-)

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git push -u origin master
Enumerating objects: 13, done.
Counting objects: 100% (13/13), done.
Delta compression using up to 2 threads
Compressing objects: 100% (7/7), done.
Writing objects: 100% (7/7), 1.88 KiB | 964.00 KiB/s, done.
Total 7 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To https://github.com/prokopenkoroman88/srt-test.git
   9a674ee..9a9b207  master -> master
Branch 'master' set up to track remote branch 'master' from 'origin'.

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$




------------------------------------






































