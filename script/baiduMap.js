initMap();

function searchRajectory() {
    if(getLevel() > 1){
      $.messager.alert('信息提示', '您没有权限，请联系管理员.', 'info');
      return;
    }
    var licensePlate = $('#licensePlate5').textbox('getValue');
    var dtStart = $('#dtStart').datetimebox('getValue');
    var dtEnd = $('#dtEnd').datetimebox('getValue');
    var license = "";
    if (licensePlate == "") {
        $.messager.alert('信息提示', '车牌号不能为空.', 'error');
        return;
    }
    if (dtStart == "" || dtEnd == "") {
        $.messager.alert('信息提示', '开始时间和结束时间不能为空.', 'error');
        return;
    }
    if (licensePlate != "") {
        license = licensePlate;
    }
    var rajectoryData = null;
    $.ajax({
        url: host+'/ssm/openAPI/rajectory',
        type: 'get',
        data: {
            license: license,
            dtStart: dtStart,
            dtEnd: dtEnd
        },
        cache: false,
        async: false,
        success: function(data) {
            console.log(data);
            if (data.status == 1001 ) {
                rajectoryData = data;
                if (rajectoryData != null) {
                    rajectory(license, rajectoryData);
                }
            }
        },
        error: function() {
            console.log("rajectory fall.");
        }
    });
}

function rajectory(license, rajectoryData) {
    var data = convertData(rajectoryData);
    var startLong, startLat, endLong, endLat;
    var myIcon = new BMap.Icon("images/kache.png", new BMap.Size(37,25), {imageOffset: new BMap.Size(0, 0)});//卡车
    startLong = data[0].lon;
    startLat = data[0].lat;

    //创建地图
    var map = new BMap.Map("container");
    map.centerAndZoom(new BMap.Point(startLong, startLat), 15); // 设置中心点
    // map.setCurrentCity("北京"); //设置
    map.addControl(new BMap.MapTypeControl());
    map.enableScrollWheelZoom(true);
    map.addControl(new BMap.NavigationControl()); //添加平移缩放控件
    map.addControl(new BMap.ScaleControl()); //添加比例尺控件

    var len = data.length;
    for(var i=0;i<len;i++){
      var point = new BMap.Point(data[i].lon, data[i].lat); //将标注点转化成地图上的点
      var marker = new BMap.Marker(point,{icon:myIcon}); //将点转化成标注点
      map.addOverlay(marker); //将标注点添加到地图上
      //添加监听事件
      (function() {
          var thePoint = data[i];
          marker.addEventListener("click",
              function() {
                  showInfo(this, thePoint,license);
              });
      })();
    }
    for(var i=1;i<len;i++){
      endLong = data[i].lon;
      endLat = data[i].lat;
      drawGreenLine(map, startLong, startLat, endLong, endLat);
      startLong = data[i].lon;
      startLat = data[i].lat;
    }
}

function showInfo(thisMarker, point,license) {
    //获取点的信息
    var sContent =
        '<ul style="margin:0 0 5px 0;padding:0.2em 0">' +
        '<li style="color:red;line-height: 26px;font-size: 15px;">' +
        '车牌号:      ' + license + '</li>' +
        '<li style="line-height: 26px;font-size: 12px;">' +
        '采集时间:    ' + point.gtm + '</li>' +
        '<li style="line-height: 26px;font-size: 12px;">' +
        '车辆速度:    ' + point.spd + '</li>' +
        '<li style="line-height: 26px;font-size: 12px;">' +
        '里程数量:    ' + point.mlg + '</li>' +
        '<li style="line-height: 26px;font-size: 12px;">' +
        '海拔高度:    ' + point.hgt + '</li>' +
        '<li style="line-height: 26px;font-size: 12px;">' +
        '车辆朝向:    ' + point.agl + '</li>' +
        '</ul>';
    var infoWindow = new BMap.InfoWindow(sContent); //创建信息窗口对象
    thisMarker.openInfoWindow(infoWindow); //图片加载完后重绘infoWindow
}

function drawGreenLine(myMap, startLong, startLat, endLong, endLat) {
    var polyline = new BMap.Polyline([
        new BMap.Point(startLong, startLat), //起始点的经纬度
        new BMap.Point(endLong, endLat) //终止点的经纬度
    ], {
        strokeColor: "green", //设置颜色
        strokeWeight: 6, //宽度
        strokeOpacity: 1
    }); //透明度
    myMap.addOverlay(polyline);
}

function convertData(rajectoryData) {
    var data = rajectoryData.result;
    var len = data.length;
    for (var i = 0; i < len; i++) {
        data[i].lat = numDiv(parseFloat(data[i].lat), 600000.0);
        data[i].lon = numDiv(parseFloat(data[i].lon), 600000.0);
        var arr = data[i].gtm.split("/");
        var year = arr[0].substring(0, 4);
        var month = arr[0].substring(4, 6);
        var day = arr[0].substring(6, 8);
        var hour = arr[1].substring(0, 2);
        var min = arr[1].substring(2, 4);
        var second = arr[1].substring(4, 6);
        data[i].gtm = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + second;
        data[i].spd = numDiv(parseFloat(data[i].spd), 10.0) + "km/h";
        if (parseFloat(data[i].mlg) > 0) {
            data[i].mlg = numMulti(parseFloat(data[i].mlg), 0.1) + "km";
        } else {
            data[i].mlg = parseFloat(data[i].mlg) + "km";
        }
        data[i].hgt = parseFloat(data[i].hgt) + "m";
        data[i].agl = "正北向东" + parseInt(data[i].agl) + "°";
    }
    return data;
}


function initMap() {
    //新建三个地图上点
    var points = [{
        "lng": 115.374164,
        "lat": 28.45917,
        "url": "",
        "address": "江西省高安市瑞阳新区财富中心6楼",
        "name": "行者物流科技有限公司"
    }];
    //创建标注点并添加到地图中
    function addMarker(points) {
        //循环建立标注点
        for (var i = 0, pointsLen = points.length; i < pointsLen; i++) {
            var point = new BMap.Point(points[i].lng, points[i].lat); //将标注点转化成地图上的点
            var marker = new BMap.Marker(point); //将点转化成标注点
            map.addOverlay(marker); //将标注点添加到地图上
            //添加监听事件
            // (function() {
            //     var thePoint = points[i];
            //     marker.addEventListener("click",
            //         function() {
            //             showInfo(this, thePoint);
            //         });
            // })();
            var thePoint = points[i];
            showInfo1(marker, thePoint);
        }
    }

    function showInfo1(thisMarker, point) {
        //获取点的信息
        var sContent =
            '<ul style="margin:0 0 5px 0;padding:0.2em 0">' +
            '<li style="line-height: 26px;font-size: 15px;">' +
            '' + point.name + '</li>' +
            '<li style="line-height: 26px;font-size: 12px;">' +
            '' + point.address + '</li>' +
            '</ul>';
        var infoWindow = new BMap.InfoWindow(sContent); //创建信息窗口对象
        thisMarker.openInfoWindow(infoWindow); //图片加载完后重绘infoWindow
    }
    //创建地图
    var map = new BMap.Map("container");
    map.centerAndZoom(new BMap.Point(115.374164, 28.45917), 15); // 设置中心点
    // map.centerAndZoom("高安");
    map.setCurrentCity("高安"); //设置为高安
    map.addControl(new BMap.MapTypeControl());
    map.enableScrollWheelZoom(true);
    map.addControl(new BMap.NavigationControl()); //添加平移缩放控件
    map.addControl(new BMap.ScaleControl()); //添加比例尺控件
    addMarker(points);
}

function sreachTruck(){
  $('#dlg').dialog({
      closed: false
  });
}
