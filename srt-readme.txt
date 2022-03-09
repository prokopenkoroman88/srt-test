

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
8.11.21


Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   index.html
        modified:   js/canvas/CustomCanvas.js
        modified:   js/canvas/RealCanvas.js
        modified:   js/script.js
        modified:   js/system.js

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        js/Main.js
        js/canvas/PixelColor.js

no changes added to commit (use "git add" and/or "git commit -a")

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git add .

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   index.html
        new file:   js/Main.js
        modified:   js/canvas/CustomCanvas.js
        new file:   js/canvas/PixelColor.js
        modified:   js/canvas/RealCanvas.js
        modified:   js/script.js
        modified:   js/system.js


Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git commit -m "PixelColor {r,g,b,a} Main - contains all elements"
[master 47235f2] PixelColor {r,g,b,a} Main - contains all elements
 7 files changed, 514 insertions(+), 125 deletions(-)
 create mode 100644 js/Main.js
 create mode 100644 js/canvas/PixelColor.js

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git push -u origin master
Enumerating objects: 19, done.
Counting objects: 100% (19/19), done.
Delta compression using up to 2 threads
Compressing objects: 100% (11/11), done.
Writing objects: 100% (11/11), 4.37 KiB | 1.46 MiB/s, done.
Total 11 (delta 4), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (4/4), completed with 4 local objects.
To https://github.com/prokopenkoroman88/srt-test.git
   9bbe080..47235f2  master -> master
Branch 'master' set up to track remote branch 'master' from 'origin'.

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$


-----------------------------------
17.11.21

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git remote -v
origin  https://github.com/prokopenkoroman88/srt-test.git (fetch)
origin  https://github.com/prokopenkoroman88/srt-test.git (push)

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   index.html
        modified:   js/Main.js
        modified:   js/canvas/CustomCanvas.js
        modified:   js/system.js
        modified:   srt-readme.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        js/pict-script.js
        pages/

no changes added to commit (use "git add" and/or "git commit -a")

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git add .

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git commit -m "+pict-editor & Bezier"



-------------------------------------------------------
4.12.21


R(t) = (1-t)^3*P0 + 3*t*(1-t)^2*P1 + 3*t^2*(1-t)*P2 + t^3*P3



R(t) = (1-t)^3*P0 + 3*t*(1-t)^2*P1 + 3*t^2*(1-t)*P2 + t^3*P3


(1-t)^3 = 1 -3*t + 3*t^2 - t^3

(1-t)^2 = 1 + t^2 -2*t



R(t) = P0 -3*P0*t + 3*P0*t^2 - P0*t^3

+ 3*P1*t +  3*P1*t^3  -6*P1*t^2

+ 3*P2*t^2 - 3*P2*t^3

+ t^3*P3


R(t) =

 - P0*t^3 +  3*P1*t^3 - 3*P2*t^3  + P3*t^3

+ 3*P0*t^2  -6*P1*t^2  + 3*P2*t^2 

-3*P0*t + 3*P1*t  

+ P0 



------------


 (P3 - 3*P2 + 3*P1 - P0)*t^3

+(3*P2 - 6*P1 + 3*P0)*t^2 

+(3*P1 - 3*P0)*t  

+ P0 - (cX|cY)

= 0

t in [0..1]




https://www.mathros.net.ua/kryvi-bezje.html




https://naurok.com.ua/kubichni-rivnyannya-metod-kardano-metod-vieta-89259.html


---------------------------------
15.12.21




D:\STEP\PHP\OSPanel\domains\srt-test\js\canvas\BezierFigure.js

class BezierCanvas extends RealCanvas{

	static cnv=null;

	init(selector){
		super.init(selector);
		this.canvas.addEventListener('mousemove', function(event){
			BezierCanvas.cnv.onMouse(event,0);
		});
		this.canvas.addEventListener('mousedown', function(event){
			BezierCanvas.cnv.onMouse(event,1);
		});
		this.canvas.addEventListener('mouseup', function(event){
			BezierCanvas.cnv.onMouse(event,2);
		});

		this.iter=0;
		this.args=[{},{},{}];
	}

	onMouse(event,kak){
		console.log('kak'+kak);
		console.log(event);


		let x=event.offsetX;
		let y=event.offsetY;
		console.log(x,y);


		if(kak==1){
			this.args[this.iter]={x:x,y:y};
			this.iter = (this.iter+1)%3;

			if(this.iter==0){
			    this.ctx.bezierCurveTo(this.args[0].x, this.args[0].y,  this.args[1].x, this.args[1].y,   this.args[2].x, this.args[2].y  );

  
	this.ctx.fillStyle='rgb(255,255,0)';
	this.ctx.fill();

      // line color
    this.ctx.strokeStyle = 'red';
    this.ctx.stroke();


	this.refreshImageData();

			};
		};


	}
...
}


D:\STEP\PHP\OSPanel\domains\srt-test\js\pict-script.js

let cnv1 = new BezierCanvas('#cnv1');
BezierCanvas.cnv=cnv1;




this.canvas.ctx.bezierCurveTo(this.args[0].x, this.args[0].y,  this.args[1].x, this.args[1].y,   this.args[2].x, this.args[2].y  );


-------------------------------------------------------
16.12.21


Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   js/pict-script.js
        modified:   pages/pict-editor.html
        modified:   srt-readme.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        js/BezierEditor.js
        js/canvas/BezierFigure.js
        js/common/

no changes added to commit (use "git add" and/or "git commit -a")

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$


----------------------
24.2.22

срочно коммитил JPG-Analyzer

----------------------
9.3.22

PixelVector.calc()

вычмсление степени принадлежности
 mu_Equal	ровной плоскости
 mu_Grad	градиента





Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   css/style.css
        modified:   js/canvas/CustomCanvas.js
        modified:   js/canvas/PixelColor.js
        modified:   js/cogn/ColorArea.js
        modified:   js/cogn/JPG-Analyzer.js
        modified:   js/cogn/PixelVector.js
        modified:   js/pict-script.js
        modified:   pages/pict-editor.html
        modified:   srt-readme.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        js/cogn/ColorBorder.js

no changes added to commit (use "git add" and/or "git commit -a")

Роман@User-PC MINGW64 /d/STEP/PHP/OSPanel/domains/srt-test (master)
$




















