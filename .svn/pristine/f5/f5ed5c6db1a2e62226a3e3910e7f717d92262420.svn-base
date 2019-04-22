//form submit
$('#form').submit(function() {
  var flag = login($('input[id=username]').val().trim(), $('input[id=password]').val().trim());
  if (!flag) {
    $('.error-tip').fadeIn(200);
    return false;
  }
  return true;
});
//登录ajax
var login = function(userName, password) {
    var flag = false;
    $.ajax({
        url: host + "/ssm/user/login",
        type: "Get",
        cache: false,
        async: false,
        data: {
            'userName': userName,
            'password': password
        },
        success: function(data) {
            //On ajax success do this
            console.info("login success. get token success.");
            if (data != 'login') {
              setLocalStorage(tokenName, JSON.stringify(data.result));
              flag = true;
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            //On error do this
            console.info("login fall. get token error.");
            // if (xhr.status == 200) {
            //     console.info(ajaxOptions);
            // } else {
            //     console.info(xhr.status);
            //     console.info(thrownError);
            // }
        }
    });
    return flag;
};

//验证用户信息
if (checkToken()) {
  window.location.href = "index.html";
}
