

-----------------
7.11.21

D:\STEP\PHP\OSPanel\domains\srt-test


������ �����������

https://github.com/prokopenkoroman88/srt-test





�or create a new repository on the command line
echo "# srt-test" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/prokopenkoroman88/srt-test.git
git push -u origin main

�or push an existing repository from the command line
git remote add origin https://github.com/prokopenkoroman88/srt-test.git
git branch -M main
git push -u origin main

�or import code from another repository
You can initialize this repository with code from a Subversion, Mercurial, or TFS project.







������ Bash



�����@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test
$ git init
Initialized empty Git repository in D:/STEP/PHP/OSPanel/domains/srt-test/.git/

�����@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git remote add origin https://github.com/prokopenkoroman88/srt-test.git

�����@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git remote -v
origin  https://github.com/prokopenkoroman88/srt-test.git (fetch)
origin  https://github.com/prokopenkoroman88/srt-test.git (push)

�����@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
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

�����@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git add .

�����@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
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

�����@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
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

�����@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$






------------------------------------






































