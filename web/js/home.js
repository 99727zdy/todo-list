axios.defaults.baseURL = 'http://localhost:3000/api/v1';
new Vue({
  el: '#app',
  data() {
    return {
      dialogTableVisible: false,
      dialogFormVisible: true,
      statusL:false,
      // 登录表单
      loginForm: {
        user: 'zy3280',
        pwd: '123456'
      },
      // 登录验证
      loginRules: {
        // required 是否为空
        // trigger  验证触发的方式
        user: [
          { required: true, trigger: 'blur', min: 4, message: "用户名不能小于4位" }
        ],
        pwd: [
          { required: true, trigger: 'blur', min: 6, max: 10, message: "用户名不能小于6位" }
        ]
      },
      // 标签
      tagList:
        [{ tag: '学习' }, { tag: '工作' }, { tag: '娱乐' }],
      // 添加
      formInline: {
        tag: '',
        content: '',
        planTime: ''
      },
      // 用户list
      userForm: [],
      listRules: {
        tag: [
          { required: true, trigger: 'blur', message: "不能为空" }
        ],
        content: [
          { required: true, trigger: 'blur', message: "不能为空" }
        ],
        planTime: [
          { required: true, trigger: 'blur', message: "不能为空" }
        ]
      }
    }
  },

  methods: {
    // warn(){
    //   while(localStorage.getItem("error")){
    //     this.$message({
    //       message: localStorage.getItem("error"),
    //       type: 'warning'
    //     });
    //   }
    // },
    getList() {
      axios.get('/read', {
        params: {
          status:this.statusL,
          createUser:this.loginForm.user
        }
      }).then((response) => {
        this.userForm = response.data.data
      })
    },
    login(loginForm) {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          axios.post('/login', {
            user: loginForm.user,
            pwd: loginForm.pwd
          }).then((response) => {
            if (response.data.meta.status == 200) {
              localStorage.setItem("token",response.data.data.token)
              this.$message({
                message: response.data.meta.msg,
                type: 'success'
              });
              this.dialogFormVisible = false
              document.getElementById('main').style.display = "block"
              this.statusL='false'
              this.getList()
            } else {
              this.$message({
                message: response.data.meta.msg,
                type: 'warning'
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    exit() {
      this.dialogFormVisible = true
      document.getElementById('main').style.display = "none"
      localStorage.clear();
    },

    onAdd(postData) {
      if(this.formInline.tag&&this.formInline.content&&this.formInline.planTime){
        this.$refs.loginForm.validate((valid) => {
        if (valid) {
          postData.createUser = this.loginForm.user;
          console.log(postData);
          // 请求方法('请求地址'，参数)
          axios.post('/add', postData)
            .then((response) => {
              console.log(response.data);
              if (response.data.meta.status == 200) {
                this.$message({
                  message: response.data.meta.msg,
                  type: 'success'
                });
                this.formInline = {}
                this.getList()
              } else {
                this.$message({
                  message: response.data.meta.msg,
                  type: 'warning'
                });
              }
            })
        } else {
          return false;
        }
      });
      }else{
        this.$message({
          message: "请填写完整",
          type: 'warning'
        });
      }

    },
    finish(ListItem) {
      axios.put('/up', {
        _id:ListItem._id,
        status:'true'
      })
      .then((response) => {
        if (response.status === 200) {
          this.$message({
            message:'已完成',
            type:'success'
          });
          this.getList()
        }
      })
  },
    handleClick(tab, event) {
      if(tab.name=='unfinished'){
        this.statusL='false'
      }
      if(tab.name=='finish'){
        this.statusL='true'
      }
      this.getList()
    },
    delList(listItem){
      axios.delete('/del',{
        params: {
          _id:listItem._id
        }
      }).then((response) =>{
        if (response.status === 200){
          this.$message({
            message:'已删除',
            type:'warning'
          });
          this.getList()
        }
      })
    },
    upData(listItem){
      axios.put('/up',{
        _id:listItem._id,
        tag:listItem.tag,
        content:listItem.content,
        planTime:listItem.planTime
      }).then((response) =>{
        if(response.status == 200){
          this.$message({
            message:'已更新',
            type:'success'
          })
        }
      })
    },
    echarts(){
      var myChart = echarts.init(document.getElementById('week'));
        // 指定图表的配置项和数据
        option = {
          legend: {},
          tooltip: {
              trigger: 'axis',
              showContent: false
          },
          dataset: {
              source: [
                  ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                  ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
                  ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
                  ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
                  ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
              ]
          },
          xAxis: {type: 'category'},
          yAxis: {gridIndex: 0},
          grid: {top: '55%'},
          series: [
              {type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
              {type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
              {type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
              {type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
              {
                  type: 'pie',
                  id: 'pie',
                  radius: '30%',
                  center: ['50%', '25%'],
                  emphasis: {focus: 'data'},
                  label: {
                      formatter: '{b}: {@2012} ({d}%)'
                  },
                  encode: {
                      itemName: 'product',
                      value: '2012',
                      tooltip: '2012'
                  }
              }
          ]
      };
  
      myChart.on('updateAxisPointer', function (event) {
          var xAxisInfo = event.axesInfo[0];
          if (xAxisInfo) {
              var dimension = xAxisInfo.value + 1;
              myChart.setOption({
                  series: {
                      id: 'pie',
                      label: {
                          formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                      },
                      encode: {
                          value: dimension,
                          tooltip: dimension
                      }
                  }
              });
          }
      });
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
  },
  mounted() {
    this.echarts();
  },
})