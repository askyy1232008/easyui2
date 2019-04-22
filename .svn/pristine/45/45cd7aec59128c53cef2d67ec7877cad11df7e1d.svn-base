// 重写combotree单选
$.extend($.fn.datagrid.defaults.editors, {
    combotree_single: {
        init: function(container, options) {
            var box = $('<input />').appendTo(container);
            box.combotree(options);
            return box;
        },
        getValue: function(target) {
            var t = $(target).combotree('tree', target);
            var n = t.tree('getSelected');
            return n;
        },
        setValue: function(target, value) {
            if (value) {
                $(target).combotree('setValue', value.id);
            }
        },
        resize: function(target, width) {
            var box = $(target);
            box.combotree('resize', width);
        },
        destroy: function(target) {
            $(target).combotree('destroy');
        }
    }
});



// 重写combotree复选
$.extend($.fn.datagrid.defaults.editors, {
	combotree_multiple : {
		init : function(container, options) {
			var box = $('<select multiple />').appendTo(container);
			box.combotree(options);
			return box;
		},
		getValue : function(target) {
			var t = $(target).combotree('tree', target);
			var n = t.tree('getChecked');
      var value = "";
      if(typeof n.length == 'number' && typeof n.splice == 'function'){
        if(n.length>0){
          value += n[0].text;
          for(var i=1;i<n.length;i++){
            value += (","+n[i].text);
          }
        }
      }
			return value;
		},
		setValue : function(target, value) {
			if (value != undefined && value.length > 0) {
				var arrId = new Array();
        var list = value.split(",");
        var tree = [];
        var treeList = [];
        $.ajax({
            /*请求方式*/
            type:"GET",
            cache: false,
            async: false,
            /*json文件位置*/
            url:"json/combotree/insuranceTypes.json",
            /*返回数据格式为json*/
            dataType:"json",
            /*请求成功完成后要执行的方法*/
            success: function (data) {
              tree = data;
            }
        });
				for (var i = 0; i < tree.length; i++) {
          var text = tree[i].text;
          for(var j=0;j<list.length;j++){
            if(text == list[j]){
              tree[i].checked = true;
              treeList.push(tree[i]);
            }
          }
				}
				$(target).combotree('setValues', treeList);
			}
		},
		resize : function(target, width) {
			var box = $(target);
			box.combotree('resize', width);
		},
		destroy : function(target) {
			$(target).combotree('destroy');
		}
	}
});
