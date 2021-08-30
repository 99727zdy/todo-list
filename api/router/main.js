const express = require(`express`);
const router = express.Router();
const mainController = require("../Controllers/main");
const jwtAuth = require("../jwt");

router.use(jwtAuth);

router.use((req, res, next) => {
  next();
});

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/doc' + '/index.html')
})

router.post('/api/v1/login', mainController.initUser)

router.post('/api/v1/add', mainController.addList)
router.delete('/api/v1/del', mainController.delList)
router.put('/api/v1/up', mainController.upList)
router.get('/api/v1/read', mainController.readList)

module.exports = router;