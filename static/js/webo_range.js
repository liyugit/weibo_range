(function(){
   var input =  W("#input"),
          textarea = W("#input textarea"),//输入框对象
          list = W("#list"),
          rule = W("#rule");
        //可以影响textarea布局的样式
         var styleAttrs =  [
                 'paddingTop',
                 'paddingRight',
                 'paddingBottom',
                 'paddingLeft',
                 'fontSize',
                  'height',
                 'lineHeight',
                 'fontFamily',
                 'width',
                 'fontWeight',
                 'border-top-width',
                 'border-right-width',
                 'border-bottom-width',
                 'border-left-width',
                 'overflow-x',
                 'overflow-y',
                 'borderTopStyle',
                 'borderTopColor',
                 'borderRightStyle',
                 'borderRightColor',
                 'borderBottomStyle',
                 'borderBottomColor',
                 'borderLeftStyle',
                 'borderLeftColor'
             ];
    function _init (){
        var styleJson = {};
        styleAttrs.forEach(function(style){
		    //获取输入框的所有的样式
            var styleValue = textarea.getCurrentStyle(style);
            styleJson[style] = styleValue;
        });
	  //将输入框的所有的样式都复制给了rule
        rule.setStyle(styleJson);
        //输入框绑定事件
       textarea.on("click",_getRange);
       textarea.on("keyup",_getRange);
        //好友列表的点击选择
        var listItems = W("#list li a");
        listItems.forEach(function(el,i){
          W(el).on("click",_insertValue);
        });
        W("body").on("click",_closeList);
    }
	//在“@”后边加上好友名称
    function _insertValue(e){
           var valueStr = textarea.val(),
                 index = textarea.attr("index"),
                 text  = W(e.target).html();
                 textarea.val(valueStr.substring(0,index) + text + valueStr.substring(index));
    }
	//好友列表关闭
    function _closeList(e){
     var target = e.target;
        if(target != textarea[0]){
            list.hide();
        }
    }
	//获得光标的位置
    function _getRange(){
        var textareaDom = textarea[0],
            inputStr = textarea.val(),
            preStr = "",
            start = textareaDom.selectionStart,//非ie获取光标点位置的方法
            selectionObj = document.selection;
			//ie获取光标点位置的方法
            if(selectionObj){
            var rng = selectionObj.createRange();
            textareaDom.select();//光标放到了第一个字符
            rng.setEndPoint("StartToStart", selectionObj.createRange());//新创建的range在第一个字符之前
            var psn = rng.text.length;
            rng.collapse(false);//range向后面的端点合并形成光标
            rng.select();
            }
            start = start ? start : psn;
           if(start > -1){
            preStr = inputStr.substring(start -1 ,start);
            textarea.attr("index",start);
            if(preStr == "@"){
                var beforeStr = inputStr.substring(0,start-1).replace(/\n/g,"<br>"),
                       afterStr = inputStr.substring(start).replace(/\n/g,"<br>");
                var pos = _renderRlue(beforeStr,afterStr);
                list.show();
                list.setStyle({left:pos.left,top:pos.top});
            }
            else{
              list.hide();
            }
        }
    }
	//将输入框的内容填入rule
    function _renderRlue(beforeStr,afterStr){
        var before = W("#rule .before"),
               flag = W("#rule .flag"),
               flagDom = flag[0],
               after =W("#rule .after");
        before.html(beforeStr);
        flag.html("@");
        after.html(afterStr);
        var inputPaddingLeft = parseInt(input.getCurrentStyle("paddingLeft")),
              inputPaddingTop = parseInt(input.getCurrentStyle("paddingTop")),
              textareaLineHeight = parseInt(textarea.getCurrentStyle("lineHeight")),
              scrollTop = textarea[0].scrollTop;
        var flagPos = {left:flagDom.offsetLeft + inputPaddingLeft + "px",top:flagDom.offsetTop + inputPaddingTop + textareaLineHeight - scrollTop + "px"};
        return flagPos;
    }
_init();
})();