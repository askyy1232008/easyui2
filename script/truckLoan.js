function openLoan(){
  if(getLevel() > 3){
    $.messager.alert('信息提示', '您没有权限，请联系管理员.', 'info');
    return;
  }
  if (checkSelectDatagrid()) {
      return;
  }
  $('#openloan-dialog').dialog({
      closed: false,
      iconCls: 'icon-add',
      modal: true,
      title: "请选择凭据类型",
      buttons: [{
          text: '确定',
          iconCls: 'icon-ok',
          handler: function() {
            loan($('#oloantype').combobox('getValue'));
            $('#openloan-dialog').dialog('close');
          }
      }, {
          text: '取消',
          iconCls: 'icon-cancel',
          handler: function() {
              $('#openloan-dialog').dialog('close');
          }
      }]
  });
}
function loan(type){
  var item = $('#dg').datagrid('getSelected');
  $('#loan-form').form('clear');
  var truck  = getTruckByTruckId(item.truckid);
  $('#loanvin').textbox('setValue',truck.vin);
  if(type == "仅挂车"){
    $('#loanvin').textbox('setValue',truck.gvin);
  }
  var data = {};
  data.truckid = item.truckid;
  data.type = type;
  $('#loan-dialog').dialog({
      closed: false,
      iconCls: 'icon-add',
      modal: true,
      title: "新增 "+ item.licenseplate + " 的贷款凭据",
      buttons: [{
          text: '确定',
          iconCls: 'icon-ok',
          handler: function() {
            addLoan(data);
          }
      }, {
          text: '取消',
          iconCls: 'icon-cancel',
          handler: function() {
              $('#loan-dialog').dialog('close');
          }
      }]
  });
}

function addLoan(data){
  var t = $('#loan-form').serializeArray();
  $.each(t, function () {
      data[this.name] = this.value;
  });
  console.log(data);
  $.ajax({
    url:host+'/ssm/loan/addLoan',
    type: "post",
    cache: false,
    async: false,
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(d) {
        if (d == 0) {
            $.messager.alert('信息提示', '提交失败,该车辆已有贷款凭据！', 'error');
        }else if (d == 1) {
            $('#loan-dialog').dialog('close');
            $.messager.alert('信息提示', '提交成功！', 'info');
        }else{
          $.messager.alert('信息提示', '提交失败！新增凭据不成功！', 'error');
        }
    },
    error: function(xhr, ajaxOptions, thrownError) {
        //On error do this
        console.info("addLoan error.");
    }
  });
}

function getTruckByTruckId(id){
  var truck =null;
  $.ajax({
    url:host+'/ssm/truck/getTruck',
    type: "get",
    cache: false,
    async: false,
    data: {
        truckid:id
    },
    success: function(data) {
        if (data.code == 20000) {
          truck =  data.result.truck;
        }
    },
    error: function(xhr, ajaxOptions, thrownError) {
        //On error do this
        console.info("getTruckByTruckId error.");
    }
  });
  return truck;
}

// function loanpayed(){
//   var item = $('#dg').datagrid('getSelected');
//   if(!item){
//     $.messager.alert('信息提示', '请先选中一行.', 'error');
//     return;
//   }
//   if(getLevel() > 3){
//     $.messager.alert('信息提示', '您没有权限，请联系管理员.', 'info');
//     return;
//   }
//   $('#loanpayed-form').form('clear');
//   $('#loanpayed-dialog').dialog({
//       closed: false,
//       iconCls: 'icon-file',
//       modal: true,
//       title: "为 "+ item.licenseplate + " 的贷款进行还款",
//       buttons: [{
//           text: '确定',
//           iconCls: 'icon-ok',
//           handler: function() {
//             payedLoan(item);
//
//           }
//       }, {
//           text: '取消',
//           iconCls: 'icon-cancel',
//           handler: function() {
//               $('#loanpayed-dialog').dialog('close');
//           }
//       }]
//   });
// }
//
// function payedLoan(item){
//   var paydate = $('#paydate').datebox('getValue');
//   var paynumber = $('#paynumber').textbox('getValue');
//   if(paydate == "" || paynumber==""){
//     $.messager.alert('信息提示', '不能为空！', 'error');
//     return;
//   }
//   $.ajax({
//     url:host+'/ssm/loan/payedLoan',
//     type: "post",
//     cache: false,
//     async: false,
//     data: {
//         paydate:paydate,
//         paynumber:paynumber,
//         truckid:item.truckid
//     },
//     success: function(data) {
//         if (data.code == 20000) {
//           $.messager.alert('信息提示', data.result.result, 'info');
//           $('#loanpayed-dialog').dialog('close');
//         }else{
//           $.messager.alert('信息提示', data.result.result, 'error');
//         }
//     },
//     error: function(xhr, ajaxOptions, thrownError) {
//         //On error do this
//         console.info("payedLoan error.");
//     }
//   });
// }
