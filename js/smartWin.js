;(function(){
	function SmartWin(area,minWidth,minheight){
		var _this=this;
		this.area=area;//窗口绘制区域
		this.dragging=false;//是否拖动
		this.startX,this.startY;//鼠标按下时的位置,相对于文档
		this.posX,this.posY;//窗口拖动前的位置，相对于父元素
		this.diffX,this.diffY//鼠标与窗口的差值
		this.hasWin=false;
		this.focusWin;
		this.stauts;
		this.removeFlag=true;
		this.winsdata=new Array()//窗口数据，大小位置
		//area相对于文档的位置
		this.aLeft=this.area.offset().left;
		this.aTop=this.area.offset().top;
		//保存布局初始数据
		this.initWinsData();
		//鼠标按下
		this.area.mousedown(function(e){
			//无窗口，准备创建新窗口
			if($(e.target).is(_this.area)){
				_this.startX=e.pageX;
				_this.startY=e.pageY;
				_this.stauts="create";
				var inner='<div class="smartWin" id="createWin" ondrop="drop(event)" ondragover="allowDrop(event)">\
						   </div>';
				_this.area.append(inner);
				var wl=_this.startX-_this.aLeft;
				var wt=_this.startY-_this.aTop;
				$("#createWin").css({
						"left":wl,
						"top":wt
				})
			}
			//有窗口
			else{
				
				if($(e.target).hasClass("smartWin")){
					_this.focusWin=$(e.target);
				}else{
					_this.focusWin=$(e.target).parents(".smartWin");
				}
				//关闭窗口
				if($(e.target).hasClass("close")){
					console.log(_this.removeFlag)
					if(_this.removeFlag){
						let index = $(e.target).parents(".smartWin").index();
						console.log(index)
						_this.winsdata.splice(index,1);
						$(e.target).parents(".smartWin").remove();
						console.log(_this.winsdata)
					}
					
				}
				//修改大小
				else if($(e.target).hasClass("resize")){
					_this.startX=e.pageX;
					_this.startY=e.pageY;
					_this.stauts="resize";
					_this.posX=_this.focusWin.position().left;
					_this.posY=_this.focusWin.position().top;
					_this.focusWin.attr("id","resizeWin");
				}
				//拖动窗口
				else{
					_this.posX=_this.focusWin.position().left;
					_this.posY=_this.focusWin.position().top;
					//差值
					_this.diffX=e.pageX-_this.aLeft-_this.posX;
					_this.diffY=e.pageY-_this.aTop-_this.posY;
					_this.stauts="drag";
					_this.focusWin.attr("id","dragWin");
				}
			}
		})
		//鼠标移动
		this.area.mousemove(function(e){
			//设置窗口大小位置
			if(_this.stauts=="create"){
				var ht='<p class="winHead"><span class="winName" contenteditable="true">窗口名称</span><span class="close">×</span></p>\
								<div></div>\
								<div class="resize"><span class="point"></span></div>'
				let win=$("#createWin");
				win.html(ht);
				let pos=win.position();
				let left=pos.left;
				let top=pos.top;
				var ww=e.pageX-_this.startX;
				var wh=e.pageY-_this.startY;
				var zindex=$(".smartWin").length;
				let flag;
				if(_this.winsdata.length){
					flag=1;
					_this.winsdata.forEach(function(ele){
						if(!((ww+left)<ele.left||left>(ele.left+ele.width)||(wh+top)<ele.top||top>(ele.top+ele.height))){
							flag=0;
						}
					})
					if(flag){
						$("#createWin").css({
							"width":ww,
							"height":wh,
							"z-index":zindex
						})
					}
				}else{
					$("#createWin").css({
						"width":ww,
						"height":wh,
						"z-index":zindex
					})
				}
				
			}else if(_this.stauts=="drag"){
				let dragwin=$("#dragWin")
				var wl=e.pageX-_this.aLeft-_this.diffX;
				var wt=e.pageY-_this.aTop-_this.diffY;
				var border=parseInt(dragwin.css("border-width").split("px")[0]);
				if(wl<=0){
					wl=0;
				}
				if(wt<=0){
					wt=0;
				}
				if(wl>$(_this.area).width()-dragwin.width()){
					wl=$(_this.area).width()-dragwin.width()-2*border;
				}
				if(wt>$(_this.area).height()-dragwin.height()){
					wt=$(_this.area).height()-dragwin.height()-2*border;
				}
				let flag=1;
				let ww=dragwin.width(),wh=dragwin.height();
				let no=dragwin.index();
				_this.winsdata.forEach(function(ele,index){
					if(no!=index){
						if(!((wl+ww+border)<ele.left||wl>(ele.left+ele.width)||(wh+wt+border)<ele.top||wt>(ele.top+ele.height))){
							flag=0;
						}
					}
				})
				if(flag){
					dragwin.css({
						"left":wl,
						"top":wt
					})
				}
			}else if(_this.stauts=="resize"){
				var ww=e.pageX-_this.aLeft-_this.posX;
				var wh=e.pageY-_this.aTop-_this.posY;
				let resizewin=$("#resizeWin");
				let pos=resizewin.position();
				let wl=pos.left;
				let wt=pos.top;
				let flag=1;
				let border=parseInt(_this.focusWin.css("border-width").split("px")[0]);
				if($(_this.area).width()<(ww+_this.posX)){
					ww=$(_this.area).width()-_this.posX-2*border;
				}
				if($(_this.area).height()<(wh+_this.posY)){
					wh=$(_this.area).height()-_this.posY-2*border;
				}
				let no=resizewin.index();
				_this.winsdata.forEach(function(ele,index){
					if(no!=index){
						if(!((wl+ww+border)<ele.left||wl>(ele.left+ele.width)||(wh+wt+border)<ele.top||wt>(ele.top+ele.height))){
							flag=0;
						}
					}
				})
				if(flag){
					_this.focusWin.css({
						"width":ww,
						"height":wh
					})

				}
				
			}
		})
		$(document).mouseup(function(){
			_this.stauts="";
			_this.dragging=false;
			_this.focusWin=null;
			var no;
			var cwin=$("#createWin");
			var dwin=$("#dragWin");
			var rwin=$("#resizeWin");
			if(cwin.length){
				console.log(cwin.width());
				if(cwin.width()<minWidth||cwin.height()<minheight){
					cwin.remove();
				}else{
					_this.saveData(cwin);
				}
				cwin.removeAttr("id");
			}
			if(dwin.length){
				no=dwin.index();
				let pos=dwin.position();
				_this.winsdata[no].left=pos.left;
				_this.winsdata[no].top=pos.top;
				dwin.removeAttr("id");
			}
			if(rwin.length){
				no=rwin.index();
				_this.winsdata[no].width=rwin.width();
				_this.winsdata[no].height=rwin.height();
				rwin.removeAttr("id");
				console.log(_this.winsdata);
			}

		})
	}
	SmartWin.init=function(objs,minWidth,minheight){
		// objs.each(function(){
		// 	new SmartWin($(this),minWidth,minheight);
		// })
		return new SmartWin(objs,minWidth,minheight);
	}
	SmartWin.prototype={
		saveData:function(obj){
			var pos=obj.position();
			var obj={
						left:pos.left,
						top:pos.top,
						width:obj.width(),
						height:obj.height()
					};
			this.winsdata.push(obj);
		},
		initWinsData:function(){
			var _this=this;
			var wins=$(".smartWin");
			this.winsdata.length=0;
			if(!wins.length){
				return 0;
			}
			wins.each(function(){
				var pos=$(this).position();
				var obj={
					left:pos.left,
					top:pos.top,
					width:$(this).width(),
					height:$(this).height()
				}
				_this.winsdata.push(obj);
			})
		}
	};
	SmartWin.stopRemove=function(){
		//this.removeFlag=false;
	}
	window["SmartWin"]=SmartWin;
})()
