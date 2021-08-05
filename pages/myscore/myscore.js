// pages/index/lookrecord/lookrecord.js
import * as echarts from '../../ec-canvas/echarts';
import { Config } from '../main/config';

var wxCharts = require('../../utils/wxcharts.js'); //引入wxChart文件
var util = require('../../utils/util.js');
const DB = wx.cloud.database().collection("data_date1")
const DB_week = wx.cloud.database().collection("week")


var app = getApp();


let chart_bar = null;
let chart_line = null;
let chart_radar = null;

var temp1 = []

function initChart_bar(canvas, width, height, dpr) {
  chart_bar = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart_bar);
  var labelRight = {
    position: 'right'
  };
  var option = {
    color: ['#37a2da', '#32c5e9'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    legend: {
      data: ['碳排放量', '碳减排量']
    },
    grid: {
      left: 30,
      right: 20,
      bottom: 30,
      top: 35,
      containLabel: false
    },
    xAxis: [{
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#000000'
        }
      },
      axisLabel: {
        color: '#000000'
      }
    }],
    yAxis: [{
      show: false,
      data: temp1[0],

      // type: 'category',
      // axisTick: {
      //   show: true,
      // },
      
      // axisLine: {
      //   lineStyle: {
      //     color: '#ffffff'
      //   }
      // },
      // axisLabel: {
      //   color: '#ffffff'
      // }
    }],
    series: [{
        name: '碳排放量',
        type: 'bar',
        label: {
          show: true,
          formatter: '{b}'
        },
        data: temp1[1],
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '碳减排量',
        type: 'bar',
        stack: '总量',
        label: {
          show: true,
          formatter: '{b}'
        },
        data: temp1[2],
        itemStyle: {
          // emphasis: {
          //   color: '#67e0e3'
          // }
        }
      }
    ]
  };

  chart_bar.setOption(option);
  return chart_bar;
}

function initChart_line(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    // title: {
    //     text: '周排放量/减排量',
    // },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['碳排放量', '碳减排量'],
        top: 20,
    },
    color: ['#37a2da', '#32c5e9'],
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
        type: 'value',
        // axisLabel: {
        //     formatter: '{value} °C'
        // }
    },
    series: [
        {
            name: '碳排放量',
            type: 'line',
            data: app.globalData.week_discharge,
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            }
        },
        {
            name: '碳减排量',
            type: 'line',
            data: app.globalData.week_reduce,
            markPoint: {
                data: [
                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'},
                    [{
                        symbol: 'none',
                        x: '90%',
                        yAxis: 'max'
                    }, {
                        symbol: 'circle',
                        label: {
                            position: 'start',
                            formatter: '最大值'
                        },
                        type: 'max',
                        name: '最高点'
                    }]
                ]
            }
        }
    ]
  };
  chart.setOption(option);
  return chart;
}

function initChart_radar(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    radius: 60,
    color: ["#37A2DA", "#FF9F7F"],
    xAxis: {
      show: false
    },
    yAxis: {
      show: false
    },
    radar: {
      color: '#ffffff',
      // shape: 'circle',
      indicator: [
      {
        name: '办公·学习',
        max: 100
      },
      {
        name: '居家·寝室',
        max: 100
      },
      {
        name: '交通',
        max: 100
      },
      {
        name: '衣物',
        max: 100
      },
      {
        name: '饮食',
        max: 100
      },
      ]
    },
    series: [{
      name: '碳排放量',
      type: 'radar',
      data: [{
        value: [31.3, 21.0,6,4,36.9],
        name: '碳排放量'
      }
      ]
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({

  data: {
    time: null,
    value: 142,
    view_value: [0,0,0,0,0],
    display: 1,


    ec_bar: {
      onInit: initChart_bar
    },

    ec_line: {
      onInit: initChart_line
    },

    ec_radar: {
      onInit: initChart_radar
    }

  },

  get_bit: function(e) {
    var that = this
    var number = this.data.value
    number = number + Math.random() * 10
    var temmm = number
    var bit = [0,0,0,0,0]
    var t = 10000
    for (var i = 0; i<5; i++){
      bit[i] = number / t
      bit[i] = bit[i] - (bit[i] % 1)
      console.log(t)
      console.log(bit[i])
      number = number % t
      t = t / 10
    }
    console.log(bit)
    that.setData({
      view_value: bit,
      v1: (temmm * 3.3).toFixed(2),
      v2: (temmm * 0.056).toFixed(2),
    })
  },

  changetable: function (e) {
    var temp = e.currentTarget.dataset.key
    this.setData({
      display: temp,
    })
    if(temp == 1){
      this.setData({
        border1: "3px solid white" ,
        border2: "" ,
        border3: "" ,
      })
    }
    if(temp == 2){
      this.setData({
        border1: "" ,
        border2: "3px solid white" ,
        border3: "" ,
      })
    }
    if(temp == 3){
      this.setData({
        border1: "" ,
        border2: "" ,
        border3: "3px solid white" ,
      })
    }
  },

  changebar: function (e) {
    var that = this
    var key = e.currentTarget.dataset.key
    if(key == 1){
      this.setData({
        Iborder1: "3px solid grey",
        Iborder2: "",
        Iborder3: "",
        Iborder4: "",
        Iborder5: "",
      })
      temp1 = that.getsum(app.globalData.bangong_record)
      var option = chart_bar.getOption()
      option.series[0].data = temp1[1]
      option.series[1].data = temp1[2]
      option.yAxis[0].data = temp1[0]
      chart_bar.setOption(option, true);
      console.log(temp1)
    }
    if(key == 2){
      this.setData({
        Iborder1: "",
        Iborder2: "3px solid grey",
        Iborder3: "",
        Iborder4: "",
        Iborder5: "",
      })
      temp1 = that.getsum(app.globalData.jujia_record)
      var option = chart_bar.getOption()
      option.series[0].data = temp1[1]
      option.series[1].data = temp1[2]
      option.yAxis[0].data = temp1[0]
      chart_bar.setOption(option, true);
    }
    if(key == 3){
      this.setData({
        Iborder1: "",
        Iborder2: "",
        Iborder3: "3px solid grey",
        Iborder4: "",
        Iborder5: "",
      })
      temp1 = that.getsum(app.globalData.jiaotong_record)
      var option = chart_bar.getOption()
      option.series[0].data = temp1[1]
      option.series[1].data = temp1[2]
      option.yAxis[0].data = temp1[0]
      chart_bar.setOption(option, true);
    }
    if(key == 4){
      this.setData({
        Iborder1: "",
        Iborder2: "",
        Iborder3: "",
        Iborder4: "3px solid grey",
        Iborder5: "",
      })
      temp1 = that.getsum(app.globalData.yiwu_record)
      var option = chart_bar.getOption()
      option.series[0].data = temp1[1]
      option.series[1].data = temp1[2]
      option.yAxis[0].data = temp1[0]
      chart_bar.setOption(option, true);
    }
    if(key == 5){
      this.setData({
        Iborder1: "",
        Iborder2: "",
        Iborder3: "",
        Iborder4: "",
        Iborder5: "3px solid grey",
      })
      temp1 = that.getsum(app.globalData.yingshi_record)
      var option = chart_bar.getOption()
      option.series[0].data = temp1[1]
      option.series[1].data = temp1[2]
      option.yAxis[0].data = temp1[0]
      chart_bar.setOption(option, true);
    }
  },


  getsum: function(data){
    var sum = []
    var rdc_sum = []
    for(var i = 0; i<data.length; i++){
      var name = data[i][0]
      console.log(name)
      if(sum[name] > 0 ){
        sum[name] = sum[name] + data[i][1]
        rdc_sum[name] = rdc_sum[name] + data[i][2]
      }
      else{
        sum[name] = 0
        rdc_sum[name] = 0
        sum[name] = sum[name] + data[i][1]
        rdc_sum[name] = rdc_sum[name] + data[i][2]
      }
      // console.log(sum[name])
    }
    console.log(sum)
    var label = []
    var dsc_data = []
    var rdc_data = []
    for(var k in sum){
      // console.log(k)
      label.push(k)
      dsc_data.push(sum[k])
      rdc_data.push(rdc_sum[k])
    }
    return [label,dsc_data,rdc_data]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

    this.setData({
      border1: "3px solid white" ,
      Iborder1: "3px solid grey",
    })
    var that = this
    that.get_bit()
    /////////////////////查询周折线图数据//////////////////////////
    DB_week.where({
      user: app.globalData.user,
    })
    .get({
      success(res) {
        console.log('导入数据成功',res.data)
        for(var i = 12; i < 19; ++i ){
          app.globalData.week_discharge[i-12] = res.data[i].discharge + Math.random() * 3
          app.globalData.week_discharge[i-12] = app.globalData.week_discharge[i-12] - app.globalData.week_discharge[i-12] % 0.01
          app.globalData.week_reduce[i-12] = res.data[i].reduce + Math.random() * 3
          app.globalData.week_reduce[i-12] = app.globalData.week_reduce[i-12] - app.globalData.week_reduce[i-12] % 0.01
        }
        // console.log(app.globalData.week_discharge)
        // console.log(app.globalData.week_reduce)
      },
      fail(){
        console.log('失败')
      }
    })

    /////////////////////统计日柱状图数据//////////////////////////
    temp1 = that.getsum(app.globalData.bangong_record)
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

    // console.log(temp1)
    // var option = chart_bar.getOption();
    // option.yAxis[0].data = temp1[0]
    // option.series[0].data = temp1[1]
    // option.series[1].data = app.globalData.reduce_date;
    
    // chart_bar.setOption(option, true);

    // var option2 = chart_line.getOption();
    // option2.series[0].data = app.globalData.week_discharge;
    // option2.series[1].data = app.globalData.week_reduce;
    // chart_line.setOption(option2, true);


    // var that = this
    // DB.where({
    //   _openid: 'user-open-id',
    //   user: app.globalData.userInfo.nickName,
    //   date: app.globalData.time,
    // })
    // .get({
    //   success(res) {
    //     console.log('导入数据成功', res.data)
    //     // var xuexi = 0   //办公学习
    //     // var jujia = 0   //居家寝室
    //     // var jiaotong = 0    //交通
    //     // var yiwu = 0    //衣物
    //     // var yinshi = 0   //饮食

    //     discharge_data = [0,0,0,0,0] //办公学习 居家寝室 交通 衣物 饮食
    //     reduce_date = [0,0,0,0,0]
    //     for(var index in res.data){
    //       var theId = res.data[index].data_ID
    //       if( theId>=0 && theId<=17 ){
    //         discharge_data[1] = discharge_data[1] + res.data[index].discharge
    //         reduce_date[1] = reduce_date[1] - res.data[index].reduce
    //       }
    //       if( theId>=18 && theId<=27 ){
    //         discharge_data[0] = discharge_data[0] + res.data[index].discharge
    //         reduce_date[0] = reduce_date[0] - res.data[index].reduce
    //       }
    //       if( theId>=28 && theId<=45 ){
    //         discharge_data[2] = discharge_data[2] + res.data[index].discharge
    //         reduce_date[2] = reduce_date[2] - res.data[index].reduce
    //       }
    //       if( theId>=46 && theId<=57 ){
    //         discharge_data[3] = discharge_data[3] + res.data[index].discharge
    //         reduce_date[3] = reduce_date[3] - res.data[index].reduce
    //       }
    //       if( theId>=58 && theId<=72 ){
    //         discharge_data[4] = discharge_data[4] + res.data[index].discharge
    //         reduce_date[4] = reduce_date[4] - res.data[index].reduce
    //       }

    //       var option = chart.getOption();
    //       option.series[0].data = discharge_data;
    //       option.series[1].data = reduce_date;
    //       chart.setOption(option, true);
    //     }
    //   },
    //   fail(){
    //     console.log("无上次记录")
    //   }
    // })
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

  },
})