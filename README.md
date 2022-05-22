# NewsSystem
新闻发布管理后台系统

项目介绍：
   pc端项目，核心模块是用户登录 数据分析 权限管理 角色管理 用户管理 新闻管理 审核管理 发布管理 
   
技术栈：
   vite、react、antD
   react用的是17和hooks
   
后台：
   json-server
   
操作注意：

   1.项目克隆到本地后，需在项目文件夹终端中下载依赖
   
   2.后台数据使用json-server进行模拟，后台数据存放与db.json文件中，启动项目前需输入以下命令  json-server --watch db.json --port <端口号>，默认端口号为8001，若需更改，则需更改命令且将 axios.js文件中axios.defaults.baseURL = 'http://localhost:8001' 的8001改为新端口号
   
   3.管理员账号为admin，密码为123456，其他用户账号密码详见db.json文件中的“users”信息的username及password
   
   4.身份识别令牌依靠localstorage的token，登录后若有需要，请手动删除
