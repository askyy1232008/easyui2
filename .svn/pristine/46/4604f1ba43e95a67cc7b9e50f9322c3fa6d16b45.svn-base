//验证用户信息
if (!checkToken()) {
    window.location.href = "login.html";
}
// 顶部模块单击事件
$('.quick-item').live('click', function() {
    var treeTarget = $(this).attr('tree-target');
    var targetName = $(this).find('.quick-item-name').html();
    // 导航栏名称变更
    // $('#easyui-nav').layout('panel','west').panel('setTitle',targetName);
    $('.layout-panel-west .panel-title').text(targetName);
    //菜单权限控制
    var level = getLevel();
    if(level > 1 ){
      if(targetName == '用户管理'){
        $.messager.alert('信息提示', '您没有该菜单权限,请联系管理员.', 'info');
        return ;
      }
    }
    $(this).addClass('quick-item-selected');
    $('.quick-item').not(this).removeClass('quick-item-selected');

    // 重新渲染tree
    $('#left-menu-tree').tree({
        animate: true,
        method: 'get',
        url: treeTarget,
        lines: true,
        onSelect: function(node) {
            if (node.url) {
                $.easyuiExt.openTab({
                    id: 'tabs-test',
                    inIFrame: false,
                    title: node.text,
                    href: node.url,
                    iconCls: 'icon-file',
                    closable: true
                });
            }
        },
        onLoadError: onNoTreeData,
        onLoadSuccess: function(node, data) {
            if (!data || data.length == 0) {
                onNoTreeData();
            }
        }
    });
});

// 当左侧菜单下没有数据时展示
var onNoTreeData = function() {
    $('#left-menu-tree').html("<center style='margin-top:15px;color: #666;'>该模块下暂时没有子菜单.</center>");
}

// 执行初始化工作
window.onload = function() {
    // 1. 默认点击第一个菜单模块
    $('.quick-item').first().trigger('click');

    // 2 .绑定tabs右键菜单
    $.easyuiExt.bindTabsContextMenu($.easyuiExt.getMainTab());

    $('#easyui-header').fadeIn(300);
    $('#easyui-footer').fadeIn(300);

    $('#loginOut').click(function(){
      $.messager.confirm("操作提示", "您确定要退出吗？", function (data) {
            if (data) {
              localStorage.removeItem(tokenName);
              window.location.href = "login.html";
            }
        });
    });
}

//载入用户信息
$('#username').text(getUserName());
