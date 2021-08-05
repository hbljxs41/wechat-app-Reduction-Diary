// pages/everyrecords/jujia/main/main.js
const app = getApp();
var util = require('../../utils/util.js');
const DB = wx.cloud.database().collection("data_date1")
const db = wx.cloud.database().collection("date")
var amapFile = require('amap-wx.js');

Page({
  data: {
    time: null,
    theId: null,
    userInfo: null,
    Ti: 0,
    LastTi: 0,
    today: 0,
    num: [0, 0],
    sum: [0, 0],
    start: [
      0, 0
    ],
    dest: [
      0, 0
    ],
    distance: '',
    cost: '',
    polyline: [],

    table: [
      ['洗浴', '6', '分钟', '11'],
      ['水龙头使用', '0', '分钟', '11'],
      ['空调使用', '1', '小时', '621'],
      ['电梯使用', '2', '次', '218'],
      ['电灯使用', '0', '小时/个', '11'],
      ['电脑使用', '3', '小时', '13'],
      ['电冰箱使用', '0', '小时', '650'],
      ['洗衣机使用', '4', '小时', '399'],
      ['饮水机使用', '0', '小时', '52'],
      ['手机使用', '0', '小时', '9.6'],
      ['打印机使用', '5', '小时', '276'],
      ['燃气灶使用', '0', '小时', '1085'],
      ['塑料袋', '0', '个', '97'],
      ['塑料瓶', '0', '个', '40'],
      ['一次性筷子', '0', '双', '20'],
      ['洗衣液', '0', '千克', '600'],
      ['洗护用品', '0', '千克', '720'],
      ['垃圾制造', '0', '千克', '2100'],
      ['水龙头使用', '0', '分钟', '11'],
      ['空调使用', '1', '小时', '621'],
      ['电梯使用', '2', '次', '218'],
      ['电灯使用', '0', '小时/个', '11'],
      ['电脑使用', '3', '小时', '13'],
      ['饮水机使用', '0', '小时', '52'],
      ['手机使用', '0', '小时', '9.6'],
      ['打印机使用', '5', '小时', '276'],
      ['纸张', '0', '张', '12'],
      ['垃圾制造', '0', '千克', '2100'],
      ['步行', '9', '千米', '0'],
      ['自行车', '9', '千米', '0'],
      ['电瓶车', '9', '千米', '12'],
      ['地铁', '9', '次', '60'],
      ['公交车', '9', '千米', '37'],
      ['摩托车', '9', '千米', '75'],
      ['小汽车', '9', '千米', '270'],
      ['步行', '9', '千米', '0'],
      ['自行车', '9', '千米', '0'],
      ['电瓶车', '9', '千米', '12'],
      ['地铁', '9', '次', '60'],
      ['公交车', '9', '千米', '37'],
      ['摩托车', '9', '千米', '75'],
      ['小汽车', '9', '千米', '270'],
      ['飞机', '9', '千米', '180'],
      ['火车', '9', '千米', '62'],
      ['高铁', '9', '千米', '50'],
      ['长途大巴', '9', '千米', '19'],
      ['上衣', '7', '件', '6500'],
      ['裤子', '7', '件', '8700'],
      ['夹克外套', '7', '件', '13300'],
      ['连衣裙', '7', '件', '14900'],
      ['手套', '7', '件', '1100'],
      ['其他配饰', '7', '件', '1800'],
      ['上衣', '7', '件', '6500'],
      ['裤子', '7', '件', '8700'],
      ['夹克外套', '7', '件', '13300'],
      ['连衣裙', '7', '件', '14900'],
      ['手套', '7', '件', '1100'],
      ['其他配饰', '7', '件', '1800'],
      ['肉类', '8', '千克', '26000'],
      ['主食', '8', '千克', '2700'],
      ['奶制品', '8', '千克', '1250'],
      ['蛋类', '8', '千克', '3360'],
      ['果蔬', '8', '千克', '450'],
      ['酒水', '0', '个', '220'],
      ['饮料', '8', '千克', '4060'],
      ['香烟', '0', '支', '1'],
      ['肉类', '8', '千克', '26000'],
      ['主食', '8', '千克', '2700'],
      ['奶制品', '8', '千克', '1250'],
      ['蛋类', '8', '千克', '3360'],
      ['果蔬', '8', '千克', '450'],
      ['酒水', '8', '千克', '1800'],
      ['饮料', '8', '千克', '4060'],
    ],
    //massage为可量化记录，数组，其索引与table[1]的值对应
    massage: [
      [{
          action: '夏季空调温度调至27℃',
          rate: 57,
          unit: '台/天',
        },
        {
          action: '出门前3分钟关空调',
          rate: 13,
          unit: '台/天',
        }
      ],
      [{
        action: '较低楼层以走楼梯代替乘电梯',
        rate: 218,
        unit: '次',
      }],
      [{
          action: '不用电脑时以待机代替屏幕保护（笔记本）',
          rate: 4,
          unit: '天',
        },
        {
          action: '不用电脑时以待机代替屏幕保护（台式机）',
          rate: 14,
          unit: '天',
        }
      ],
      [{
          action: '衣物较少时（2.3件），手洗代替机洗',
          rate: 300,
          unit: '次',
        },
        {
          action: '不用洗衣机甩干，自然晾干',
          rate: 2300,
          unit: '次',
        }
      ],
      [{
        action: '纸张双面打印、复印',
        rate: 12,
        unit: '张',
      }],
      [{
        action: '将淋浴温度调低1℃',
        rate: 35,
        unit: '人/次',
      }],
      [{
        action: '衣物捐赠、二手衣物交易、废物利用',
        rate: 3560,
        unit: '件',
      }]
      // [
      //   {
      //     action:'剩余菜品打包、减少食物浪费',
      //     rate :35,
      //     unit:'人/次',
      //     num:0
      //   }
      // ]

    ]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        T: app.globalData.total_discharge,
        theId: options.id - 1,
        time: app.globalData.time,
        userInfo: app.globalData.userInfo,
      })
      that.getTiAndLastTi(this.data.time)
    }
    // else
    // {
    // }
  },

  //轻松计算昨日日期的牛逼函数
  getDateStr: function(today, addDayCount) {
    var date;
    if(today) {
      date = new Date(today);
    }else{
      date = new Date();
    }
    date.setDate(date.getDate() + addDayCount);//获取AddDayCount天后的日期 
      var y = date.getFullYear();
      var m = date.getMonth() + 1;//获取当前月份的日期 
      var d = date.getDate();
      if(m < 10){
        m = '0' + m;
      };
      if(d < 10) {
        d = '0' + d;
      };
      console.log( y + "-" + m + "-" + d)
      return y + "-" + m + "-" + d;
    },


  //选择日期后触发
  changeDate(e) {
    app.globalData.time = e.detail.value
    var that = this
    that.getTiAndLastTi(e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  getTiAndLastTi (date){

    var that = this
    var temp = date
    temp = that.getDateStr(temp,-1)
    // console.log(temp)

    //查今天的总量
    DB.where({
      _openid: 'user-open-id',
      user: app.globalData.userInfo.nickName,
      date: date,
      data_ID: this.data.theId,
    })
    .get({
      success(res) {
        console.log(res)
        var total = 0
        for(var index in res.data){
          total = total + res.data[index].discharge
        }
        that.setData({
          Ti: total
        })
      },
      fail(res) {}
    })

    //查昨天的总量
    DB.where({
      _openid: 'user-open-id',
      user: app.globalData.userInfo.nickName,
      date: temp,
      data_ID: this.data.theId,
    })
    .get({
      success(res) {
        console.log(res)
        var total = 0
        for(var index in res.data){
          total = total + res.data[index].discharge
        }
        that.setData({
          LastTi: total
        })
      },
      fail(res) {}
    })
  },

  // 输入框更新函数
  handleChange1({detail}) {
    this.setData({
      today: detail.value,
    })
  },

  handleChange(e) {
    //这里写的很臃肿， 只是为了传参数
    var ind = e.currentTarget.dataset.key
    var k = e.currentTarget.dataset.rate
    var temp = this.data.num
    temp[ind] = e.detail.value
    var temp2 = this.data.sum
    temp2[ind] = (temp[ind] * k / 1000)
    // console.log(e)
    // console.log(e.currentTarget.dataset.key)
    this.setData({
      num: temp,
      sum: temp2,
    })
  },

  //移动选点
  //modified
  onChangeAddress: function (e) {
    var _page = this
    wx.getSetting({
      success(res) {
        // 判断定位的授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              var point = e.currentTarget.dataset.key
              var temp = _page.data[point]
              wx.chooseLocation({
                success: function (res) {
                  console.log(res)
                  temp[0] = res.latitude
                  temp[1] = res.longitude
                  if (point == 'start') {
                    _page.setData({
                      point: temp,
                      startname: res.name,
                    });
                  } else {
                    _page.setData({
                      point: temp,
                      destname: res.name,
                    });
                  }

                },
                fail: function (err) {
                  console.log(err)
                }
              });
            },
            fail(errMsg) {
              wx.showToast({
                title: JSON.stringify(errMsg),
                icon: 'none'
              })
            }
          })
        } else {
          var point = e.currentTarget.dataset.key
          var temp = _page.data[point]
          wx.chooseLocation({
            success: function (res) {
              console.log(res)
              temp[0] = res.latitude
              temp[1] = res.longitude
              if (point == 'start') {
                _page.setData({
                  point: temp,
                  startname: res.name,
                });
              } else {
                _page.setData({
                  point: temp,
                  destname: res.name,
                });
              }

            },
            fail: function (err) {
              console.log(err)
            }
          });
        }
      }
    })
  },

  //计算两地路程函数
  route: function () {
    var that = this;
    // var key = '3e49ceec74d406c857e4255ac18a090b';
    var myAmapFun = new amapFile.AMapWX({
      key: '3e49ceec74d406c857e4255ac18a090b'
    });
    myAmapFun.getDrivingRoute({
      origin: this.data.start[1].toString() + ',' + this.data.start[0].toString(),
      destination: this.data.dest[1].toString() + ',' + this.data.dest[0].toString(),
      success: function (data) {
        console.log("请求成功")
        console.log(data)
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          console.log(data.paths[0].distance)
          var temp = data.paths[0].distance
          temp = temp - (temp % 100)
          console.log(temp)
          that.setData({
            // today 即为distance， 为了传值方便，统一为 today
            today: temp / 1000
          });
        }

      },
      fail: function (info) {
        that.setData({
          errorinfo: info
        })
        console.log(info)
      }
    })
  },


  //统计数据，并向云服务器上添加记录
  addData() {

    var theId = this.data.theId
    var total = this.data.today * this.data.table[this.data.theId][3] / 1000 //在本页面下记录的碳排放量
    var subvaule = this.data.sum[0] + this.data.sum[1] //在本页面下记录的可量化减排量

    var name = this.data.table[this.data.theId][0]

    var temp = [name, total, subvaule]
    // var temp = app.globalData.today_record[name]
    // console.log(temp)
    // temp['total'] = temp['total'] + total
    // temp['subvaule'] = temp['subvaule'] + subvaule
    // console.log(temp)

    // app.globalData.today_record[name] = temp
    // console.log(app.globalData.today_record)
 
  
    // var discharge_data = app.globalData.discharge_data //办公学习 居家寝室 交通 衣物 饮食
    // var reduce_date = app.globalData.reduce_date       
    
    if (theId >= 0 && theId <= 17) {
      // discharge_data[1] = discharge_data[1] + total
      // reduce_date[1] = reduce_date[1] - subvaule
      app.globalData.jujia_record.push(temp)
    }
    if (theId >= 18 && theId <= 27) {
      // discharge_data[0] = discharge_data[0] + total
      // reduce_date[0] = reduce_date[0] - subvaule
      app.globalData.bangong_record.push(temp)
    }
    if (theId >= 28 && theId <= 45) {
      // discharge_data[2] = discharge_data[2] + total
      // reduce_date[2] = reduce_date[2] - subvaule
      app.globalData.jiaotong_record.push(temp)
    }
    if (theId >= 46 && theId <= 57) {
      // discharge_data[3] = discharge_data[3] + total
      // reduce_date[3] = reduce_date[3] - subvaule
      app.globalData.yiwu_record.push(temp)
    }
    if (theId >= 58 && theId <= 72) {
      // discharge_data[4] = discharge_data[4] + total
      // reduce_date[4] = reduce_date[4] - subvaule
      app.globalData.yingshi_record.push(temp)
    }

    // app.globalData.discharge_data = discharge_data
    // app.globalData.reduce_date = reduce_date

    app.globalData.total_discharge = app.globalData.total_discharge + total

    this.setData({
      T: app.globalData.total_discharge,
    })

    //向服务器中上传数据
    DB.add({
      data: {
        user: this.data.userInfo.nickName,
        date: this.data.time,
        data_ID: this.data.theId,
        //今日总排放量
        discharge: total,
        //可量化的减排量
        reduce: subvaule,
        //到目前为止的今日排放总量
        //这样读取用户一天最后的记录中的Total即为当日总排放量
        Total: app.globalData.total_discharge,

      },
      success(res) {
        console.log("添加数据成功", res)
        wx.showModal({
          title: '导入日记成功！'
        })
      },
      fail(res) {
        console.log("添加数据失败", res)
        wx.showModal({
          title: '导入日记失败！'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})