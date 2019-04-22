//封装过期控制代码
/**
 * 设置 localStorage
 * params
 *      key
 *      value
 */
function setLocalStorage(key, value) {
    var curTime = new Date().getTime();
    localStorage.setItem(key, JSON.stringify({
        data: value,
        time: curTime
    }));
}
/**
 * 获取 localStorage
 * params
 *      key
 *      exp  毫秒（1秒等于1000毫秒）
 */
function getLocalStorage(key, exp) {
    var data = localStorage.getItem(key);
    if (data == null) {
        console.log('key:' + key + '不存在');
        return null;
    } else {
        var dataObj = JSON.parse(data);
        if (new Date().getTime() - dataObj.time > exp) {
            localStorage.removeItem(key);
            console.log('key:' + key + '已过期');
            return null;
        } else {
            // console.log("data="+dataObj.data);
            // console.log(JSON.parse(dataObj.data));
            var dataObjDatatoJson = dataObj.data;
            return dataObjDatatoJson;
        }
    }
}
/*
 * token 检查
 */
function checkToken() {
    var token = getLocalStorage(tokenName, 100000 * 60 * 30);
    if (token == null) {
        return false;
    } else {
        return true;
    }
}

/*
 * 获取 level
 */
function getLevel() {
    var result = getLocalStorage(tokenName, 100000 * 60 * 30);
    var age = JSON.parse(result).age;
    return parseInt(age, 10);
}


/*
 * 获取 userName
 */
function getUserName() {
    var result = getLocalStorage(tokenName, 100000 * 60 * 30);
    var userName = JSON.parse(result).userName;
    return userName;
}

//获取window的高和宽
var winWidth = 0;
var winHeight = 0;

function findDimensions() { //函数：获取尺寸
    //获取窗口宽度
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    //获取窗口高度
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    //通过深入Document内部对body进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
}

//数字滚动
/**
 * 滚动的数字
 * params
 *      dom  html dom
 *      number  需要显示的数值
 */
function setNumber(dom, number) {
    var n = String(number),
        len = n.length;

    //如果新的数字短于当前的，要移除多余的i
    if (dom.find("i").length > len) {
        dom.find("i:gt(" + (len - 1) + ")").remove();
    }

    //移除千分位分隔符
    dom.find("b").remove();

    //开始填充每一位
    for (var i = 0; i < len; ++i) {
        //位数不足要补
        if (dom.find("i").length < len) {
            dom.append("<i></i>");
        }

        var obj = dom.find("i").eq(i);
        var y = -40 * parseInt(n.charAt(i), 10);

        //加分隔符
        // if (i < len - 1 && (len - i - 1) % 3 == 0)
        //     $("<b></b>").insertAfter(obj);

        //利用动画变换数字
        obj.animate({
            backgroundPositionY: y + "px"
        }, 2000);
    }
};

/**
 * Name datebox formatter   时间戳转换成2019-03-04
 */
function dateboxFormatter(date) {
    var myDate = new Date(date);
    var y = myDate.getFullYear();
    var m = myDate.getMonth() + 1;
    var d = myDate.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
/*
 * Name 获取系统当前日期
 */
function getNowDate() {
    var myDate = new Date();
    var y = myDate.getFullYear();
    var m = myDate.getMonth() + 1;
    var d = myDate.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
//加法
function numAdd(num1, num2) {
   var baseNum, baseNum1, baseNum2;
   try {
      baseNum1 = num1.toString().split(".")[1].length;
   } catch (e) {
     baseNum1 = 0;
   }
   try {
       baseNum2 = num2.toString().split(".")[1].length;
   } catch (e) {
     baseNum2 = 0;
   }
   baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
   var precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;//精度
   return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(precision);;
}
//减法
function numSub(num1, num2) {
	var baseNum, baseNum1, baseNum2;
	try {
		baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
		baseNum1 = 0;
	}
	try {
		baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
		baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	var precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
	return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};

// 乘法运算

function numMulti(num1, num2) {
	var baseNum = 0;
	try {
		baseNum += num1.toString().split(".")[1].length;
	} catch (e) {
	}
	try {
	baseNum += num2.toString().split(".")[1].length;
	} catch (e) {
	}
	return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
};

// 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
function numDiv(num1, num2) {
	var baseNum1 = 0, baseNum2 = 0;
	var baseNum3, baseNum4;
	try {
		baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
		baseNum1 = 0;
	}
	try {
		baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
		baseNum2 = 0;
	}
	with (Math) {
		baseNum3 = Number(num1.toString().replace(".", ""));
		baseNum4 = Number(num2.toString().replace(".", ""));
		return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1);
	}
};

/*
 * Name 计算2个日期相差的天数
 */
function getDays(strDateStart, strDateEnd) {
    var strSeparator = "-"; //日期分隔符
    var oDate1;
    var oDate2;
    var iDays;
    oDate1 = strDateStart.split(strSeparator);
    oDate2 = strDateEnd.split(strSeparator);
    var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
    var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
    iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
    // iDays = parseInt((strDateS - strDateE) / 1000 / 60 / 60 / 24);
    var days = iDays;
    if(((strDateS - strDateE)/1000/60/60/24)>0){
      days = days - 2*iDays;
    }
    if(strDateEnd == "1899-11-30"){
      return 31;
    }
    return days;
}

//计算日期之间的月数
function datemonth(date1,date2){
    // 拆分年月日
    var newdate1 = date1.split('-');
    // 得到月数
    var month1 = parseInt(newdate1[0]) * 12 + parseInt(newdate1[1]);
    // 拆分年月日
    var newdate2 = date2.split('-');
    // 得到月数
    var month2 = parseInt(newdate2[0]) * 12 + parseInt(newdate2[1]);
    var m = month2 - month1;
    return m;
}

/*
 * Name 导出datagrid数据为Excel
 */
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) :
        JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/*
* 四舍五入 保留1位小数
*/
function keepTwoDecimal(sum){
  var result = parseFloat(sum);
  if(isNaN(result)){
    alert('参数传递错误,请检查!');
    return false;
  }
  result = Math.round(sum*10)/10; //1位10 2位100 3位1000
  return result;
}
