/**
 * 2048 游戏
 * Created by 它山之石 on 14-4-11.
 * email <278500368@qq.com>
 * @param options 
 */


function Game2048(options){
	this.board = [];
	this.height = options.grid.height||100;
	this.width = options.grid.width ||100;
	this.blank = options.grid.blank ||20;
	this.id = options.boardId;
	this.scoreId = options.scoreId;
	this.init();
}


//初始化数据
Game2048.prototype.init = function(){
	var board = this.board;
	var container = document.getElementById(this.id);
	var score = document.getElementById(this.scoreId);
	var grids = container.children;
	this.container = container;
	this.$score = score;
	this.addEvents();
	
	for(var i=0;i<4;i++){
		board[i] = [];
		for(var j=0;j<4;j++){
			board[i][j] = null;
			//生成4 X 4的棋盘格子
			this.layerout(i,j,grids);
		}
	}

	this.start();
}

//开始游戏
Game2048.prototype.start = function(){
	this.score = 0;
	this.cleanGrid();
	this.updateScore(this.score);
	this.randomCell();
	this.randomCell();

}

//初始化视图
Game2048.prototype.layerout = function(i,j,grids){
	var index = 4 * i + j;
	var grid = grids[index];
	this.setGirdStyle(i,j,grid);
}
 

//清理棋盘
Game2048.prototype.cleanGrid = function(){
	var board = this.board;
	var container = this.container;

	for(var i=0;i<4;i++){
		for(var j =0;j<4;j++){
			if(board[i][j]){
				container.removeChild(board[i][j].cell);
				board[i][j] = null;
			}
		}
	}
}

//更新分数
Game2048.prototype.updateScore = function(score){
	this.score += score;
	this.$score.innerHTML = this.score;
}

//刷新格子
Game2048.prototype.updateGirdView = function(i,j){
 
}

//设置格子的样式
Game2048.prototype.setGirdStyle = function(i,j,element){
	var left = this.getLeft(i,j);
	var top = this.getTop(i,j);
	element.style.cssText = "left:"+left+"px;top:"+top+"px";
}

//获取left的值
Game2048.prototype.getLeft = function(i,j){
	return this.blank+(this.width+this.blank) * j;
}

//获取top的值
Game2048.prototype.getTop = function(i,j){
	return this.blank+(this.height+this.blank) * i;
}
 

//随机生成一个格子
Game2048.prototype.randomCell = function(){
	var board = this.board;
	var cells = [];

	//查找可用空间
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(board[i][j] === null){
				cells.push([i,j]);
			}
		}
	}

    var len = cells.length-1;

    if(len < 0) {
    	return false;
    }

	//随机取一个格子
	var n = Math.round(Math.random() * len);
	this.addCell(cells[n][0],cells[n][1]);
}

//添加一个带数字的格子
Game2048.prototype.addCell = function(i,j){
	//创建一个格子
	var cell = document.createElement('li');
	//随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
	cell.className = 'number-cell';
	cell.innerHTML = randNumber;
	this.container.appendChild(cell); 
	this.setGirdStyle(i,j,cell);
 	//保存格子
	this.board[i][j] = {"cell":cell,"num":randNumber};
}

//移除一个格子
Game2048.prototype.delCell = function(i,j){
	var cell = this.board[i][j].cell;
	this.container.removeChild(cell);
	this.board[i][j] = null;
}

//判断竖直方向是否有格子阻挡
Game2048.prototype.noBlockVertical=function( col,row1,row2,board ){
	for(var i=row1+1;i<row2;i++){
		if(board[i][col]){
			return false;
		}
	}
	return true;
}

//判断水平方向是否有格子阻挡
Game2048.prototype.noBlockHorizontal=function(col1,col2,board){
	for(var i=col1+1;i<col2;i++){
		if(board[i]){
			return false;
		}
	}
	return true;
}

//游戏结束
Game2048.prototype.gameOver = function(){
	alert('game over');
}

//延时生成一个格子
Game2048.prototype.delayCreateCell=function(){
	var self = this;
	setTimeout(function(){
		self.randomCell();
	},500)
}

//移动格子动画
Game2048.prototype.moveAnimate = function(from,to){
	var self = this;
	var board = this.board;
	var fi = from[0];
	var fj = from[1];
	var ti = to[0];
	var tj = to[1];
	var x = this.getLeft(ti,tj) - this.getLeft(fi,fj);
	var y = this.getTop(ti,tj) - this.getTop(fi,fj);
	var cell = board[fi][fj].cell;

	cell.style.webkitTransform = 'translate3d('+x+'px,'+y+'px, 0px)';
	cell.style.transform = 'translate3d('+x+'px,'+y+'px, 0px)';

	if(board[ti][tj]){
		var score = board[ti][tj].num*2;
		board[ti][tj].num = score;
		board[fi][fj] = null;
		setTimeout(function(){
			board[ti][tj].cell.innerHTML = score;
			self.updateScore(score);
			self.container.removeChild(cell);
		},520);
	}else{
		board[ti][tj] = board[fi][fj];
		board[fi][fj] = null;
		this.setGirdStyle(ti,tj,cell)
	}
}


//左移
Game2048.prototype.moveLeft = function(){
	var board = this.board;
	var tag = false;
	//扫描每一行
	for(var i = 0;i<4;i++){
		for(var j=1;j<4;j++){
			if(this.board[i][j]){
				for(var k=0;k<j;k++){
					var noBlock = this.noBlockHorizontal(k,j,board[i]);
					var num = this.board[i][j].num;
					if(noBlock && (!board[i][k] ||board[i][k].num == num)){
						this.moveAnimate([i,j],[i,k]);
						tag = true;
						break;
 					} 
				}
			}
		}
	}

	tag && this.delayCreateCell();
}

//右移
Game2048.prototype.moveRight = function(){
	var board = this.board;
	var tag = false;
	for(var i = 0;i<4;i++){
		for(var j =2;j>-1;j--){
			if(board[i][j]){
				for(var k=3;k>j;k--){
					var noBlock = this.noBlockHorizontal(j,k,board[i]);
					var num = this.board[i][j].num;
					if(noBlock && (!board[i][k] || board[i][k].num == num)){
						this.moveAnimate([i,j],[i,k]);
						tag = true;
						break;
					}
				}
			}
		}
	}

	tag && this.delayCreateCell();
}

//上移
Game2048.prototype.moveUp = function(){
	var board = this.board;
	var tag = false;
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(board[i][j]){
				for(var k=0;k<i;k++){
					var noBlock = this.noBlockVertical(j,k,i,board);
					var num = board[i][j].num;
					if(noBlock && (!board[k][j] || board[k][j].num == num)){
						this.moveAnimate([i,j],[k,j]);
						// board[k][j] = board[i][j];
						// board[i][j] = null;
						// this.updateGirdView(k,j);
						tag = true;
						break;
					}
				}
			}
		}
	}	
	
	tag && this.delayCreateCell();
}

//下移
Game2048.prototype.moveDown = function(){
	var board = this.board;
	var tag = false;
	for(var j =0;j<4;j++){
		for(var i=2;i>-1;i--){
			if(board[i][j]){
				for(var k=3;k>i;k--){
					var noBlock = this.noBlockVertical(j,i,k,board);
					var num = board[i][j].num;
					if(noBlock && (!board[k][j] || board[k][j].num == num)){
						this.moveAnimate([i,j],[k,j]);
						tag = true;
						break;
					} 
				}
			}
		}
	}
 	
 	tag && this.delayCreateCell();
}

//监听事件
Game2048.prototype.addEvents = function(){
	var self = this;
	//键盘操作
	document.onkeyup = function(e){
		switch(e.keyCode){
			case 37: // left
				self.moveLeft();
				break;
			case 38: // up
				self.moveUp();
				break;
			case 39: // right
				self.moveRight();
				break;
			case 40: // down
				self.moveDown();
				break;
		}
		//console.log(e)
	}
}

//******************************************

window.onload = function(){
	var game = new Game2048({
		boardId : 'grid-container',
		scoreId : 'grid-score',
		grid : {
			width:100,
			height:100,
			blank:20
		}
	});

	var body = document.body;
	body.onclick = function(e){
		var target = e.target || e.srcElement;
		if(target.className == 'start'){
			game.start();
			return false;
		}
	}
}
