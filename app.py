from flask import Flask, render_template, redirect, url_for, request, flash, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import InputRequired, Length, Email, Regexp, EqualTo
import re
import os
import json
import sqlite3
from datetime import datetime

# 确保databases文件夹存在
DATABASES_DIR = 'databases'
if not os.path.exists(DATABASES_DIR):
    os.makedirs(DATABASES_DIR)

def get_current_db_path():
    """获取当前数据库路径"""
    return session.get('current_db', 'customer.db')

def get_db_connection(db_path=None):
    """获取数据库连接"""
    if db_path is None:
        db_path = get_current_db_path()
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def query_customers(db_path=None):
    """查询所有购货人"""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM customer ORDER BY id DESC')
    customers = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return customers

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///customer.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_BINDS'] = {}  # 用于动态数据库连接

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    phone = db.Column(db.String(20), unique=True, nullable=True)
    password = db.Column(db.String(80), nullable=False)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    purchase_time = db.Column(db.String(20), nullable=False)
    purchase_items = db.Column(db.String(200), nullable=False)
    balance = db.Column(db.Integer, nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class RegisterForm(FlaskForm):
    username = StringField('用户名', validators=[InputRequired(), Length(min=4, max=20)])
    email = StringField('邮箱', validators=[Length(max=120)])
    phone = StringField('手机号')
    password = PasswordField('密码', validators=[InputRequired(), Length(min=6, max=80)])
    confirm_password = PasswordField('确认密码', validators=[InputRequired(), EqualTo('password')])
    submit = SubmitField('注册')
    
    def validate(self, **kwargs):
        if not super().validate(**kwargs):
            return False
        if not self.email.data and not self.phone.data:
            flash('请提供邮箱或手机号', 'danger')
            return False
        # 只有当邮箱有值时才验证邮箱格式
        if self.email.data:
            from wtforms.validators import Email, ValidationError
            email_validator = Email()
            try:
                email_validator(self, self.email)
            except ValidationError:
                flash('邮箱格式不正确', 'danger')
                return False
        # 只有当手机号有值时才验证手机号格式
        if self.phone.data:
            import re
            if not re.match(r'^1[3-9]\d{9}$', self.phone.data):
                flash('手机号格式不正确', 'danger')
                return False
        return True

class LoginForm(FlaskForm):
    identifier = StringField('用户名/邮箱/手机号', validators=[InputRequired()])
    password = PasswordField('密码', validators=[InputRequired(), Length(min=6, max=80)])
    remember = BooleanField('记住我')
    submit = SubmitField('登录')

@app.route('/phone')
def phone_home():
    """手机版首页"""
    # 获取当前数据库信息
    current_db = session.get('current_db', 'customer.db')
    current_project = session.get('current_project', '默认')
    
    # 从数据库获取购货人列表
    customers = query_customers()
    return render_template('phone_home.html', customers=customers, current_db=current_db, current_project=current_project)

@app.route('/')
def home():
    # 获取当前数据库信息
    current_db = session.get('current_db', 'customer.db')
    current_project = session.get('current_project', '默认')
    
    # 从数据库获取购货人列表
    customers = query_customers()
    return render_template('home.html', customers=customers, current_db=current_db, current_project=current_project)

@app.route('/clear_database', methods=['POST'])
@login_required
def clear_database():
    # 清空数据库
    try:
        db_path = get_current_db_path()
        conn = get_db_connection(db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM customer')
        conn.commit()
        conn.close()
        flash('数据库已清空', 'success')
    except Exception as e:
        flash('清空数据库失败: ' + str(e), 'danger')
    return redirect(url_for('home'))

@app.route('/delete_customer/<int:customer_id>', methods=['POST'])
@login_required
def delete_customer(customer_id):
    # 删除指定购货人
    try:
        db_path = get_current_db_path()
        conn = get_db_connection(db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM customer WHERE id = ?', (customer_id,))
        conn.commit()
        conn.close()
        flash('购货人信息已删除', 'success')
    except Exception as e:
        flash('删除失败: ' + str(e), 'danger')
    return redirect(url_for('home'))

@app.route('/add_customer', methods=['POST'])
@login_required
def add_customer():
    # 添加购货人
    try:
        nickname = request.form.get('nickname')
        phone = request.form.get('phone')
        purchase_time = request.form.get('purchaseTime')
        purchase_items = request.form.get('purchaseItems', '无')
        balance = request.form.get('balance', 0)
        
        db_path = get_current_db_path()
        conn = get_db_connection(db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO customer (nickname, phone, purchase_time, purchase_items, balance)
            VALUES (?, ?, ?, ?, ?)
        ''', (nickname, phone, purchase_time, purchase_items, int(balance)))
        conn.commit()
        conn.close()
        flash('购货人添加成功', 'success')
    except Exception as e:
        flash('添加失败: ' + str(e), 'danger')
    return redirect(url_for('home'))

@app.route('/edit_customer', methods=['POST'])
@login_required
def edit_customer():
    """修改购货人信息"""
    try:
        customer_id = request.form.get('customer_id')
        nickname = request.form.get('nickname')
        phone = request.form.get('phone')
        purchase_time = request.form.get('purchaseTime')
        purchase_items = request.form.get('purchaseItems', '无')
        balance = request.form.get('balance', 0)
        
        db_path = get_current_db_path()
        conn = get_db_connection(db_path)
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE customer 
            SET nickname = ?, phone = ?, purchase_time = ?, purchase_items = ?, balance = ?
            WHERE id = ?
        ''', (nickname, phone, purchase_time, purchase_items, int(balance), customer_id))
        conn.commit()
        conn.close()
        flash('购货人信息已修改', 'success')
    except Exception as e:
        flash('修改失败: ' + str(e), 'danger')
    return redirect(url_for('home'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        # 检查用户名是否已存在
        if User.query.filter_by(username=form.username.data).first():
            flash('用户名已存在', 'danger')
            return redirect(url_for('register'))
        # 检查邮箱是否已存在
        if form.email.data and User.query.filter_by(email=form.email.data).first():
            flash('邮箱已存在', 'danger')
            return redirect(url_for('register'))
        # 检查手机号是否已存在
        if form.phone.data and User.query.filter_by(phone=form.phone.data).first():
            flash('手机号已存在', 'danger')
            return redirect(url_for('register'))
        # 创建新用户
        new_user = User(
            username=form.username.data,
            email=form.email.data,
            phone=form.phone.data,
            password=form.password.data  # 注意：实际应用中应该哈希密码
        )
        db.session.add(new_user)
        db.session.commit()
        flash('注册成功！请登录', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        identifier = form.identifier.data
        # 尝试通过用户名、邮箱或手机号查找用户
        user = User.query.filter_by(username=identifier).first()
        if not user:
            user = User.query.filter_by(email=identifier).first()
        if not user:
            user = User.query.filter_by(phone=identifier).first()
        
        if user and user.password == form.password.data:  # 注意：实际应用中应该验证哈希密码
            login_user(user, remember=form.remember.data)
            return redirect(url_for('home'))
        else:
            flash('登录失败，请检查您的用户名/邮箱/手机号或密码', 'danger')
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

# 确保databases文件夹存在
DATABASES_DIR = 'databases'
if not os.path.exists(DATABASES_DIR):
    os.makedirs(DATABASES_DIR)

@app.route('/create_database', methods=['POST'])
@login_required
def create_database():
    """创建新的单项目数据库"""
    try:
        data = request.get_json()
        project = data.get('project')
        db_name = data.get('db_name')
        
        if not project or not db_name:
            return jsonify({'success': False, 'message': '项目和数据库名称不能为空'})
        
        # 清理数据库名称（移除非法字符）
        db_name = re.sub(r'[^\w\-_.]', '_', db_name)
        if not db_name.endswith('.db'):
            db_name += '.db'
        
        # 构建数据库文件路径
        db_path = os.path.join(DATABASES_DIR, db_name)
        
        # 检查数据库是否已存在
        if os.path.exists(db_path):
            return jsonify({'success': False, 'message': '数据库已存在'})
        
        # 创建新的SQLite数据库
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # 创建客户表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS customer (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nickname VARCHAR(50) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                purchase_time VARCHAR(20) NOT NULL,
                purchase_items VARCHAR(200) NOT NULL,
                balance INTEGER NOT NULL
            )
        ''')
        
        conn.commit()
        conn.close()
        
        # 保存数据库元数据
        metadata = {
            'project': project,
            'created_at': datetime.now().isoformat(),
            'created_by': current_user.username
        }
        metadata_path = db_path + '.json'
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)
        
        # 切换到新创建的数据库
        session['current_db'] = db_path
        session['current_project'] = project
        
        return jsonify({'success': True, 'message': '数据库创建成功'})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/list_databases', methods=['GET'])
@login_required
def list_databases():
    """列出所有单项目数据库"""
    try:
        databases = []
        if os.path.exists(DATABASES_DIR):
            for filename in os.listdir(DATABASES_DIR):
                if filename.endswith('.db'):
                    db_name = filename[:-3]  # 移除.db后缀
                    metadata_path = os.path.join(DATABASES_DIR, filename + '.json')
                    project = '未知'
                    if os.path.exists(metadata_path):
                        try:
                            with open(metadata_path, 'r', encoding='utf-8') as f:
                                metadata = json.load(f)
                                project = metadata.get('project', '未知')
                        except:
                            pass
                    databases.append({'name': db_name, 'project': project})
        return jsonify({'success': True, 'databases': databases})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/open_database', methods=['POST'])
@login_required
def open_database():
    """打开选中的单项目数据库"""
    try:
        data = request.get_json()
        db_name = data.get('db_name')
        
        if not db_name:
            return jsonify({'success': False, 'message': '数据库名称不能为空'})
        
        # 确保添加.db后缀
        if not db_name.endswith('.db'):
            db_name_with_ext = db_name + '.db'
        else:
            db_name_with_ext = db_name
        
        # 优先检查databases文件夹
        db_path = os.path.join(DATABASES_DIR, db_name_with_ext)
        
        # 如果在databases文件夹中不存在，检查根目录
        if not os.path.exists(db_path):
            db_path = db_name_with_ext
        
        if not os.path.exists(db_path):
            return jsonify({'success': False, 'message': '数据库不存在: ' + db_path})
        
        # 读取数据库元数据
        metadata_path = db_path + '.json'
        project = '默认'
        if os.path.exists(metadata_path):
            try:
                with open(metadata_path, 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
                    project = metadata.get('project', '默认')
            except:
                pass
        
        # 切换到选中的数据库
        session['current_db'] = db_path
        session['current_project'] = project
        
        return jsonify({'success': True, 'message': '数据库打开成功', 'project': project})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

if __name__ == '__main__':
    # 确保默认数据库存在
    default_db_path = 'customer.db'
    if not os.path.exists(default_db_path):
        conn = sqlite3.connect(default_db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS customer (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nickname VARCHAR(50) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                purchase_time VARCHAR(20) NOT NULL,
                purchase_items VARCHAR(200) NOT NULL,
                balance INTEGER NOT NULL
            )
        ''')
        conn.commit()
        conn.close()
        print('默认数据库已创建')
    
    app.run(debug=True)