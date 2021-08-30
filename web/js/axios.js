// axios拦截器
// 请求拦截：所有的网络请求都会先经过这个方法 
axios.interceptors.request.use(
  (config) => {
    if (localStorage.token) {
      console.log(localStorage.token);
      // 给每个请求的请求头位置添加token
      config.headers["Authorization"] = `Bearer ${localStorage.token}`;
      console.log(config);
    }
    return config;//这是必须返回的
  },
  (err) => {
    return Promise.reject(err);
  }
);
// 响应拦截：所有的网络请求返回数据之后都会先执行此方法
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
      alert("请退出重新登录")
    // if (error.response.status === 401) {
    //   //输出授权失败错误信息
    // } else {
    //   //输出其他错误信息
    // }
    return Promise.reject(error);
  }
);
