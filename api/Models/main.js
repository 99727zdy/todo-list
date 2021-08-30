const mongoose = require("mongoose");
// 连接数据库
const db = mongoose.createConnection(
  "mongodb://zytdl:zytol@localhost:27017/todolist",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    }
    console.log("连接成功");
  }
);

// 创建用户注册模型：用户名、创建日期
const loginModel = db.model("Users", {
  date: { type: Date, default: Date.now },
  user: { type: String },
  pwd: { type: String },
});

// 创建用户个人模型 , 隐性：创建时间、创建人 显性：内容、计划时间、标签
const listModel = db.model("List", {
  // 创建时间
  createTime: { type: Date, default: Date.now },
  createUser: String,
  tag: String,
  content: String,
  planTime: String,
  status: { type: Boolean, default: false },
});

// 注册登录
const createU = (postData) => {
  fUser = { user: postData.user };
  // 检查是否存在
  return loginModel.findOne(fUser, "pwd", (err, res) => {
    if (err) {
      console.log(err);
      return false;
    }
    // 存在 -> 直接返回
    else if (res) {
      // console.log(res);
      return res;
    } else {
      // 不存在 -> 注册用户
      return new loginModel(postData)
        .save()
        .then((data) => {
          // console.log(data);
          return data;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    }
  });
};
// 增
const createM = (postData) => {
  // 实例化
  const insertObj = new listModel(postData);
  // 添加到数据库
  return insertObj
    .save()
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
// 查
const listM = (getData) => {
  // console.log(getData);
  return listModel
    .find(getData)
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};
// 删
const delM = (getData) => {
  console.log(getData);
  return listModel.deleteMany(getData, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("删除成功");
  });
};
// 改
const upM = (postData) => {
  id = { _id: postData._id };
  // console.log(postData);
  return listModel.updateOne(id, postData, {}, (err, data) => {
    if (err) {
      console.log(err);
    }
    if (data) {
      // console.log(data);
    }
  });
};

// 导出模型方法
module.exports = {
  createU,
  createM,
  listM,
  delM,
  upM,
};


