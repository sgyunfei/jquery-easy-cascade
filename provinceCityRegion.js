/*省市区联动*/
function provinceCityRegion(province, city, region) {
    //接收参数数组
    let arrayList = arguments
    let arrayLength = arrayList.length - 1 //总长度
    let isClear = false
    //第一级为字典配置  dic.province
    $.each(arrayList, function (index, item) {
        //第一个省份有设置字典 后面的需要自定义值
        if (index > 0) {
            item.combobox({
                valueField: 'id',
                textField: 'name',
            })
        }
        //触发下拉
        item.combobox({
            onChange: function (res) {
                //如果点击后面的删除图标 触发清空事件
                if (!res && isClear) {
                    clearNextData(arrayList, index)
                }
            },
            onSelect: function (res) {
                if (index < arrayLength) {
                    //允许清空条件下
                    if (isClear) {
                        clearNextData(arrayList, index)
                    }
                    loadNextData(arrayList[index + 1], res.id, index)
                }
            },
            onLoadSuccess: function () {
                if (!isClear && index == arrayLength) {
                    setTimeout(function () {
                        isClear = true //单组省市区没有什么问题 多组不行 会导致后面的几组渲染不出来
                    }, 3000)
                }
            }
        })
    })
}

//加载下一级数据
function loadNextData(tag, res, index) {
    //接口接收级别因为从0 开始 所以加2
    var level = index + 2
    var url = $.ext.getContextPath() + '/flow/gwm/ext/getRegionCombo?level=' + level + '&pId=' + res;
    //下一级重新加载下拉数据
    $(tag).combobox('reload', url)
}

//清空下一级数据
function clearNextData(clearArray, currentIndex) {
    $.each(clearArray, function (index, item) {
        if (index > currentIndex) {
            item.combobox('clear').combobox('loadData', [{}])
        }
    })
}


//TMS 省市区联动
function TMSProvinceCityRegion($province, $city, $region) {
    //省和市下拉选初始化
    $.ext.ajax({
        url: $.ext.getContextPath() + '/flow/gwm/ext/getTmsRegionCombo?level=省级',
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (result) {

            $province.combobox({
                data: result,
                valueField: 'addname',
                textField: 'addname',
                onSelect: function (record) {

                    /*第二级*/
                    if (typeof (record) != 'undefined' && typeof ($city) != "undefined") {
                        $.ext.ajax({
                            url: $.ext.getContextPath() + '/flow/gwm/ext/getTmsRegionCombo?level=地级市&pId=' + record.code,
                            type: 'get',
                            dataType: 'json',
                            success: function (data) {
                                $city.combobox({
                                    data: data,
                                    valueField: 'addname',
                                    textField: 'addname',
                                    onSelect: function (second) {

                                        /*第三级*/
                                        if (typeof (second) != 'undefined' && typeof ($region) != "undefined") {
                                            $.ext.ajax({
                                                url: $.ext.getContextPath() + '/flow/gwm/ext/getTmsRegionCombo?level=县&pId=' + second.code,
                                                type: 'get',
                                                dataType: 'json',
                                                success: function (data) {
                                                    $region.combobox({
                                                        data: data,
                                                        valueField: 'addname',
                                                        textField: 'addname',
                                                    })
                                                }
                                            })
                                        }
                                    },
                                    onChange: function (res) {
                                        if (!res) {
                                            if (typeof ($region) != "undefined") {
                                                $region.combobox('clear')
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                },
                onChange: function (res) {
                    if (!res) {
                        if (typeof ($city) != "undefined") {
                            $city.combobox('clear')
                        }
                        if (typeof ($region) != "undefined") {
                            $region.combobox('clear')
                        }
                    }
                }
            });
        }
    });
}
