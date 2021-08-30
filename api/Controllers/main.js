const jwt = require("jsonwebtoken");
// 引入模型
const {
  createU, createM, listM, delM, upM
} = require(process.cwd() + '/Models/main')

/**
 * @api {post} /login  登录或注册
 * @apiName initUser
 * @apiGroup login
 * @apiParam {String} user   用户名
 * @apiParam {String} pwd    密码
 * @apiSuccess {String} meta  状态码&提示信息
 * @apiSuccess {String} data  用户
 */
// 注册登录 
const initUser = async (req, res) => {
  // 1.接收 post 数据
  let postData = req.body;
  // console.log(postData);
  // 2.过滤
  // 3.操作数据库
  if (postData.user != '' && postData.pwd != '') {
    let rs = await createU(postData)
    // 4.判断返回
    if (rs) {
      if (rs.pwd == postData.pwd) {
        const token = jwt.sign(
          {
            _id: rs._id,
            user: postData.user,
          },
          "yousecret",
          {
            expiresIn: 3600 * 24 * 3,
          }
        );
        res.json({
          meta: { status: 200, msg: '登录成功' },
          data: { 
            user: postData.user,
            token: token,
          }
        })
      } else {
        res.send({
          meta: { status: 500, msg: '用户名相同或密码错误' },
          data: { user: postData.user }
        })
      }
    } else {
      res.send({
        meta: { status: 200, msg: '注册成功' },
      })
    }
  } else {
    res.send({
      meta: { status: 302, msg: '用户名或密码不可为空' },
    })
  }
}
/**
 * @api {post} /add  新增list
 * @apiName addList
 * @apiGroup main
 * @apiParam {String} tag   标签
 * @apiParam {String} content    内容
 * @apiParam {String} planTime    计划时间
 * @apiParam {Boolean} status 完成状态 
 * @apiParam {String} createUser   用户名
 * @apiSuccess {String} meta  状态码&提示信息
 * @apiSuccess {String} data  新增list
 */
// 增
const addList = async (req, res) => {
  let postData = req.body;
  let rs = await createM(postData)
  if (rs) {
    // console.log(rs);
    // 发送到浏览器
    res.send({
      meta: { status: 200, msg: '添加成功' },
      data: rs
    })
  } else {
    res.send({
      meta: { status: 500, msg: '添加失败' },
      data: null
    })
  }
}
/**
 * @api {delete} /del  删除list
 * @apiName delList
 * @apiGroup main
 * @apiParam {Number} _id   id
 * @apiSuccess {String} meta  状态码&提示信息
 * @apiSuccess {String} data  信息
 */
// 删
const delList = async (req, res) => {
  let getData = req.query
  console.log(getData);
  let data = await delM(getData)
  if (data) {
    res.send({
      meta: { status: 200, msg: '删除成功' },
      data: data
    })
  } else {
    res.send({
      meta: { status: 500, msg: '删除失败' },
      data: null
    })
  }
}
/**
 * @api {put} /up  修改list
 * @apiName upList
 * @apiGroup main
 * @apiParam {Number} _id   id
 * @apiParam {String} tag   标签
 * @apiParam {String} content    内容
 * @apiParam {String} planTime    计划时间
 * @apiSuccess {String} meta  状态码&提示信息
 * @apiSuccess {String} data  信息
 */
// 改
const upList = async (req, res) => {
  let postData = req.body
  // console.log(getData);
  let data = await upM(postData)
  if (data) {
    res.send({
      meta: { status: 200, msg: '修改成功' },
      data: data
    })
  } else {
    res.send({
      meta: { status: 500, msg: '修改失败' },
      data: null
    })
  }
}
/**
 * @api {get} /read  查询list
 * @apiName readList
 * @apiGroup main
 * @apiParam {String} createUser   用户名
 * @apiParam {String} tag   标签
 * @apiParam {String} content    内容
 * @apiParam {String} planTime    计划时间
 * 
 * @apiSuccess {String} meta  状态码&提示信息
 * @apiSuccess {String} data  查询结果
 */
// 查
const readList = async (req, res) => {
  let getData = req.query
  let data = await listM(getData)
  if (data) {
    res.send({
      meta: { status: 200, msg: '查询成功' },
      data: data
    })
  } else {
    res.send({
      meta: { status: 500, msg: '查询失败' },
      data: null
    })
  }
}
// 导出
module.exports = {
  initUser,
  addList,
  delList,
  upList,
  readList
}