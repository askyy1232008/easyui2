function addNewTruck(){
  $('#truck-form').form('clear');
  $('#truckid').val("");
  $('#truckOwnerid').val("");
  $('#driverid').val("");
  $('#state').combobox('select','');
  $('#truck-dialog').dialog({
      closed: false,
      iconCls: 'icon-add',
      modal: true,
      title: "新增车辆",
      buttons: [{
        text: '加载承租人和驾驶员信息',
        iconCls: 'icon-file',
        handler: function() {
            loadTruckOwnerAndDriver();
        }
      },{
          text: '确定',
          iconCls: 'icon-ok',
          handler: function() {
              addTheTruck("add");
          }
      }, {
          text: '取消',
          iconCls: 'icon-cancel',
          handler: function() {
              $('#truck-dialog').dialog('close');
          }
      }]
  });
}

function addTheTruck(action){
  if(action == "add"){
    $('#truckid').val("");
    $('#truckOwnerid').val("");
    $('#driverid').val("");
  }
  $('#truck-form').form('submit',{
		  onSubmit:function(){
			return $(this).form('enableValidation').form('validate');
		}
	});
  var data = {};
  var t = $('#truck-form').serializeArray();
  $.each(t, function () {
      data[this.name] = this.value;
  });
  data.gsparetire = "无";
  $.ajax({
      url: host + '/ssm/truck/editTruck',
      type: "post",
      cache: false,
      async: false,
      data: data,
      success: function(data) {
        if (data.code == 20000) {
            $('#truck-dialog').dialog('close');
            $('#dg').datagrid('reload');
            if (data.result.action == "add") {
                $.messager.alert('信息提示', '数据保存成功,保存操作为 新增.', 'info');
            } else if (data.result.action == "update") {
                $.messager.alert('信息提示', '数据保存成功,保存操作为 修改.', 'info');
            }
        } else {
            $.messager.alert('信息提示', '数据保存失败,是否已经存在此车辆.', 'error');
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
          //On error do this
          console.info("editTruck error.");
      }
  });
}

function editThisTruck(){
  $('#truck-form').form('clear');
  loadThisTruck();
}

function loadThisTruck(){
  var item = $('#dg').datagrid('getSelected');
  var truckid = item.truckid;
  $.ajax({
      url: host + '/ssm/truck/getTruck',
      type: "post",
      cache: false,
      async: false,
      data: {truckid:truckid},
      success: function(data) {
        if (data.code == 20000) {
            $('#truck-form').form('load', data.result.truck);
            $('#truck-form').form('load', data.result.truckOwner);
            $('#truck-form').form('load', data.result.driver);
            $('#truck-form').form('load', {driverid:data.result.driverid});
            $('#truck-form').form('load', {truckOwnerid:data.result.truckOwnerid});
            openEditThisTruck();
        } else {
            $.messager.alert('信息提示', '数据获取失败.', 'error');
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
          //On error do this
          console.info("getTruck error.");
      }
  });
}

function openEditThisTruck(){
  $('#truck-dialog').dialog({
      closed: false,
      iconCls: 'icon-edit',
      modal: true,
      title: "编辑车辆",
      buttons: [{
        text: '加载承租人和驾驶员信息',
        iconCls: 'icon-file',
        handler: function() {
            loadTruckOwnerAndDriver();
        }
      },{
          text: '确定',
          iconCls: 'icon-ok',
          handler: function() {
              addTheTruck("edit");
          }
      }, {
          text: '取消',
          iconCls: 'icon-cancel',
          handler: function() {
              $('#truck-dialog').dialog('close');
          }
      }]
  });
}

function loadTruckOwnerAndDriver(){
  $.ajax({
    url:host+'/ssm/truckOwner/getTruckOwnerAndDriver',
    type: 'get',
    cache: false,
    async: false,
    success: function(d) {
        if (d.code == 20000) {
            var truckOwner = d.result.truckOwner;
            var driver = d.result.driver;
            $('#truckOwner').combobox('loadData',truckOwner);
            $('#driver').combobox('loadData',driver);
            $('#truckOwner').combobox({
              onSelect:function(param){
                onSelectTruckOwner(param.id);
              }
            });
            $('#driver').combobox({
              onSelect:function(param){
                onSelectDriver(param.id);
              }
            });
            $('#truckOwner').combobox('setValue','请选择...');
            $('#driver').combobox('setValue','请选择...');
        }else{
          $.messager.alert('信息提示', 'getTruckOwnerAndDriver fall.', 'error');
        }
    },
    error: function() {
        console.info("getTruckOwnerAndDriver error.");
    }
  });
}

function onSelectTruckOwner(id){
  $.ajax({
    url:host+'/ssm/truckOwner/getTruckOwnerAndDriverByIdCard',
    type: 'get',
    cache: false,
    async: false,
    data:{
      action:'truckOwner',
      id:id,
      truckid:$('#truckid').val()
    },
    success:function(data){
        if(data.code == 20000) {
            var truckOwner = data.result.truckOwner;
            $('#truck-form').form('load', truckOwner);
        }
    },
    error:function(){
      console.info("getTruckOwnerAndDriverByIdCard error.");
    }
  });
}

function onSelectDriver(id){
  $.ajax({
    url:host+'/ssm/truckOwner/getTruckOwnerAndDriverByIdCard',
    type: 'get',
    cache: false,
    async: false,
    data:{
      action:'driver',
      id:id,
      truckid:$('#truckid').val()
    },
    success:function(data){
      if(data.code == 20000) {
          var driver = data.result.driver;
          $('#truck-form').form('load', driver);
      }
    },
    error:function(){
      console.info("getTruckOwnerAndDriverByIdCard error.");
    }
  });
}


function sreachTruck1(){
  var list = [{
    name:"中国重汽/智能通",
    value:"http://www.sinotruksfs.com/default.aspx"
  },{
    name:"G7智能互联",
    value:"https://g7s.ucenter.huoyunren.com/app/ucenter/login.html?referer=http%3A//g7s.huoyunren.com/%23truck/truck/index.html"
  },{
    name:"航天科技车联网企业运用平台",
    value:"http://59.53.213.186:8097/htyagis/login.jsp"
  },{
    name:"位置信息服务平台",
    value:"http://jxhypt.cn:89/mygpsonline/gpsonline/jsp/login.jsp"
  },{
    name:"车旺大卡/手机端",
    value:""
  },{
    name:"爱车在线",
    value:"http://www.aichezaixian.com/index.jsp;JSESSIONID=7fae5ed6-3055-4095-8820-569044f2bdbf"
  }];
  var htmlStr = "";

  for(var i=0;i<list.length;i++){
    htmlStr += "<a href=\"javascript:void(0)\" class=\"easyui-linkbutton\" data-options=\"iconCls:'icon-file',plain:true\" onclick=\"returnIt('"+ list[i].value +"')\">"+ list[i].name +"</a><br />";
  }
  $('#hezuo-dialog').html(htmlStr);
  $('#hezuo-dialog').dialog({
      closed: false,
      iconCls: 'icon-file',
      modal: true,
      title: "合作商车辆轨迹查询",
      buttons: [{
          text: '取消',
          iconCls: 'icon-cancel',
          handler: function() {
              $('#hezuo-dialog').dialog('close');
          }
      }]
  });
}

function returnIt(value){
  window.open(value);
}
