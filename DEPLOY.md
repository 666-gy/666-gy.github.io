# 购货人管理系统 - 部署指南

## 概述
本项目是一个基于Flask的购货人管理系统，支持电脑版和手机版双界面。

## 功能特性
- ✅ 用户认证（注册/登录）
- ✅ 购货人管理（添加/修改/删除）
- ✅ 项目管理（麻绳、豆粕）
- ✅ 付款/送货状态跟踪
- ✅ 多数据库支持（可创建单项目数据库）
- ✅ 电脑版 + 手机版双界面
- ✅ 响应式设计

## 快速部署（推荐：Render.com）

### 步骤1：准备代码
1. 将代码上传到GitHub仓库
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://your-username/customer-control.git
   git push -u origin main
   ```

### 步骤2：部署到Render
1. 访问 https://render.com 注册账号
2. 点击 "New +" → "Web Service"
3. 选择你的GitHub仓库
4. 配置如下：
   - **Name**: customer-management
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. 点击 "Create Web Service"

### 步骤3：配置自定义域名
1. 在Render Dashboard中，点击你的服务
2. 左侧菜单点击 "Custom Domains"
3. 添加你的域名（如：www.yourdomain.com）
4. 按照提示配置DNS记录
5. 等待DNS传播（通常几分钟到几小时）

## 其他PaaS平台部署

### Heroku
```bash
# 安装Heroku CLI
heroku login
heroku create your-app-name
git push heroku main
```

### Railway
1. 访问 https://railway.app 注册账号
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择你的仓库
5. 配置环境变量（如果需要）

## 本地运行
```bash
pip install -r requirements.txt
python app.py
```
访问 http://127.0.0.1:5000

## 项目结构
```
CustomerControl/
├── app.py              # 主应用文件
├── requirements.txt    # Python依赖
├── Procfile           # 部署配置
├── databases/         # 单项目数据库存储
├── instance/          # SQLite数据库存储
├── static/            # 静态文件
│   ├── css/
│   └── js/
├── templates/         # HTML模板
│   ├── home.html      # 电脑版首页
│   ├── phone_home.html # 手机版首页
│   ├── login.html     # 登录页面
│   └── register.html  # 注册页面
└── MD/               # 设计文档
```

## 注意事项

### 1. 数据库持久化
- PaaS平台的免费套餐通常不支持持久化文件系统
- 建议使用 **Render的Persistent Disk** 或 **Railway的Volumes**
- 或者使用 **云数据库服务**（如Render PostgreSQL、Clever Cloud）

### 2. 免费额度
- **Render**: 免费每月750小时，有限存储
- **Railway**: 有限免费额度
- **Heroku**: 免费dyno有休眠限制

### 3. 安全建议
- 生产环境请修改 `SECRET_KEY`
- 启用HTTPS
- 定期备份数据库

## 使用指南

### 电脑版
- 访问主页即可使用完整功能
- 支持所有购货人管理操作

### 手机版
- 访问 `/phone` 路径
- 优化的触摸界面
- 卡片式信息展示

## 技术栈
- **后端**: Flask (Python)
- **数据库**: SQLite
- **前端**: Bootstrap 5 + 自定义CSS
- **部署**: Gunicorn + PaaS平台

## 故障排除

### 1. 部署失败
- 检查 `requirements.txt` 依赖版本
- 查看Build日志定位错误
- 确保Python版本兼容性

### 2. 数据库问题
- 确认数据库文件路径正确
- 检查文件读写权限
- 考虑迁移到云数据库

### 3. 自域名不生效
- 等待DNS传播（最长48小时）
- 检查域名解析是否正确
- 确认域名已备案（如需）

## 维护建议
1. 定期检查日志
2. 监控资源使用情况
3. 及时更新依赖版本
4. 备份重要数据

## 联系方式
如有问题，请检查：
1. 项目GitHub Issues
2. Render官方文档
3. Flask官方文档

---

**提示**: 建议使用 **Render.com** 部署，免费且支持自定义域名，配置简单。
