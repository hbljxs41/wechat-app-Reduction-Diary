// pages/records/records.js

const app = getApp();
const DB = wx.cloud.database().collection("data_date1")
var table =  [
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
] 


Page({
  data: {
    time: app.globalData.time
  },

  bindViewTap: function(e) {
    var u = e.currentTarget.dataset.key
    wx.navigateTo({
      url: '../everyrecords/'+ u +"/"+ u
    })
  },
  

  //选择日期后触发
  changeDate(e) {
    var that = this
    app.globalData.time = e.detail.value
    console.log(app.globalData.time)
    this.setData({
      time: e.detail.value
    })
    that.loadTotal(app.globalData.time)

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      time: app.globalData.time
    })
  },

    //读取当天最后一次记录的数据
    loadTotal: function(e){
      var that = this
      // console.log(app.globalData.userInfo)
      console.log(e)
      DB.where({
        // _openid: 'user-open-id',
        user: app.globalData.userInfo.nickName,
        date: e,
      })
      .get({
        //查不到数据会返回空列表 也会success 不是fail
        success(res) {
          console.log('导入数据成功', res.data)
          //查到当日记录
          if(res.data.length > 0){
            app.globalData.bangong_record = []
            app.globalData.jujia_record = []
            app.globalData.jiaotong_record = []
            app.globalData.yiwu_record = []
            app.globalData.yingshi_record = []

            var ind = res.data.length - 1 
            app.globalData.total_discharge = res.data[ind].Total
  
            var discharge_data = [0,0,0,0,0] //办公学习 居家寝室 交通 衣物 饮食
            var reduce_date = [0,0,0,0,0]
            for(var index = 0; index < ind + 1; ++index){
              var theId = res.data[index].data_ID
              console.log(theId)
              var name = table[theId][0]
              var total = res.data[index].discharge
              var subvaule = res.data[index].reduce
              var temp = [name, total, subvaule]
  
              if( theId>=0 && theId<=17 ){
                // discharge_data[1] = discharge_data[1] + res.data[index].discharge
                // reduce_date[1] = reduce_date[1] - res.data[index].reduce
                app.globalData.jujia_record.push(temp)
              }
              if( theId>=18 && theId<=27 ){
                // discharge_data[0] = discharge_data[0] + res.data[index].discharge
                // reduce_date[0] = reduce_date[0] - res.data[index].reduce
                app.globalData.bangong_record.push(temp)
              }
              if( theId>=28 && theId<=45 ){
                // discharge_data[2] = discharge_data[2] + res.data[index].discharge
                // reduce_date[2] = reduce_date[2] - res.data[index].reduce
                app.globalData.jiaotong_record.push(temp)
              }
              if( theId>=46 && theId<=57 ){
                // discharge_data[3] = discharge_data[3] + res.data[index].discharge
                // reduce_date[3] = reduce_date[3] - res.data[index].reduce
                app.globalData.yiwu_record.push(temp)
              }
              if( theId>=58 && theId<=72 ){
                // discharge_data[4] = discharge_data[4] + res.data[index].discharge
                // reduce_date[4] = reduce_date[4] - res.data[index].reduce
                app.globalData.yingshi_record.push(temp)
              }
  
            }
            app.globalData.discharge_data = discharge_data
            app.globalData.reduce_date = reduce_date
            console.log(app.globalData.today_record)
          }
          //无当日记录，总排量从零计
          //对昨日记录进行统计
          else
          {
            app.globalData.total_discharge = 0
          }
        },
        fail(){
          console.log("导入数据失败")
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
      console.log(app.globalData)
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