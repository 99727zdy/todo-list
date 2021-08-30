const jwt = require("express-jwt");

// JWT 中间件
const jwtAuth = jwt({
  //关键，设为false就不进行效验，游客也可以访问
  credentialsRequired: true,
  //加密密钥，可换
  secret: "yousecret",
  // 设置jwt算法
  algorithms: ["HS256"],
}).unless({
  //添加不需要token验证的路由
  path: ["/api/v1/login"],
});

module.exports = jwtAuth;
