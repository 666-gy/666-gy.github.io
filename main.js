// 添加表单提交动画
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '处理中...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
});

// 添加输入框焦点动画
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// 鼠标交互背景效果
window.addEventListener('load', function() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 粒子数组
    const particles = [];
    const particleCount = 50;
    
    // 鼠标位置
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    // 监听鼠标移动
    window.addEventListener('mousemove', function(e) {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    // 创建粒子
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = 'rgba(255, 255, 255, 0.8)';
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 边界检测
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
            
            // 鼠标交互
            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    this.x -= forceDirectionX * force * 2;
                    this.y -= forceDirectionY * force * 2;
                }
            }
        }
    }
    
    // 初始化粒子
    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // 连接粒子
    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance/150)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        connect();
        requestAnimationFrame(animate);
    }
    
    // 初始化
    initParticles();
    animate();
    
    // 鼠标离开时重置鼠标位置
    window.addEventListener('mouseout', function() {
        mouse.x = null;
        mouse.y = null;
    });
});

// 个人信息弹窗功能
window.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const avatar = document.querySelector('.avatar');
    const modal = document.getElementById('profileModal');
    const closeModal = document.querySelector('.close');
    const passwordModal = document.getElementById('passwordModal');
    const closePasswordModal = document.querySelector('.close-password');
    const checkInfoBtn = document.getElementById('checkInfoBtn');
    const passwordForm = document.getElementById('passwordForm');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const passwordChangeForm = document.getElementById('passwordChangeForm');
    
    // 新增元素
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    const changeUsernameBtn = document.getElementById('changeUsernameBtn');
    const usernameChangeSection = document.getElementById('usernameChangeSection');
    const usernameChangeForm = document.getElementById('usernameChangeForm');
    const changePhoneBtn = document.getElementById('changePhoneBtn');
    const phoneChangeSection = document.getElementById('phoneChangeSection');
    const phoneChangeForm = document.getElementById('phoneChangeForm');
    const changeEmailBtn = document.getElementById('changeEmailBtn');
    const emailChangeSection = document.getElementById('emailChangeSection');
    const emailChangeForm = document.getElementById('emailChangeForm');
    
    // 打开个人信息弹窗
    if (avatar) {
        avatar.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }
    
    // 关闭个人信息弹窗
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            // 关闭所有子菜单
            document.getElementById('changePasswordSection').style.display = 'none';
            if (usernameChangeSection) usernameChangeSection.style.display = 'none';
            if (phoneChangeSection) phoneChangeSection.style.display = 'none';
            if (emailChangeSection) emailChangeSection.style.display = 'none';
        });
    }
    
    // 点击弹窗外部关闭
    window.addEventListener('click', function(e) {
        if (e.target == modal) {
            modal.style.display = 'none';
            // 关闭所有子菜单
            document.getElementById('changePasswordSection').style.display = 'none';
            if (usernameChangeSection) usernameChangeSection.style.display = 'none';
            if (phoneChangeSection) phoneChangeSection.style.display = 'none';
            if (emailChangeSection) emailChangeSection.style.display = 'none';
        }
        if (e.target == passwordModal) {
            passwordModal.style.display = 'none';
        }
    });
    
    // 打开密码验证弹窗
    if (checkInfoBtn) {
        checkInfoBtn.addEventListener('click', function() {
            passwordModal.style.display = 'block';
        });
    }
    
    // 关闭密码验证弹窗
    if (closePasswordModal) {
        closePasswordModal.addEventListener('click', function() {
            passwordModal.style.display = 'none';
        });
    }
    
    // 密码验证表单提交
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里可以添加密码验证逻辑
            // 验证成功后显示手机号和邮箱
            document.getElementById('phoneField').style.display = 'block';
            document.getElementById('emailField').style.display = 'block';
            passwordModal.style.display = 'none';
        });
    }
    
    // 切换修改密码表单显示/隐藏
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            const changePasswordSection = document.getElementById('changePasswordSection');
            if (changePasswordSection.style.display === 'none') {
                changePasswordSection.style.display = 'block';
            } else {
                changePasswordSection.style.display = 'none';
            }
        });
    }
    
    // 密码修改表单提交
    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里可以添加密码修改逻辑
            showSuccess('密码修改成功！');
            document.getElementById('changePasswordSection').style.display = 'none';
        });
    }
    
    // 头像修改功能
    if (changeAvatarBtn && avatarInput) {
        changeAvatarBtn.addEventListener('click', function() {
            avatarInput.click();
        });
        
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // 这里可以添加文件上传逻辑
                showSuccess('头像修改功能已触发，实际项目中需要实现文件上传');
                // 示例：显示上传的头像预览
                const reader = new FileReader();
                reader.onload = function(e) {
                    const avatarElements = document.querySelectorAll('.avatar');
                    avatarElements.forEach(avatarElement => {
                        if (avatarElement) {
                            // 实际项目中可以设置头像为上传的图片
                            avatarElement.style.backgroundImage = `url(${e.target.result})`;
                            avatarElement.style.backgroundSize = 'cover';
                            avatarElement.style.backgroundPosition = 'center';
                            avatarElement.style.backgroundRepeat = 'no-repeat';
                            avatarElement.textContent = '';
                        }
                    });
                    showSuccess('头像修改成功！');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // 用户名修改功能
    const usernameInput = document.getElementById('usernameInput');
    const saveUsernameBtn = document.getElementById('saveUsernameBtn');
    const cancelUsernameBtn = document.getElementById('cancelUsernameBtn');
    let originalUsername = '';
    
    if (usernameInput) {
        originalUsername = usernameInput.value;
        
        // 输入框焦点事件
        usernameInput.addEventListener('focus', function() {
            saveUsernameBtn.style.display = 'inline-block';
            cancelUsernameBtn.style.display = 'inline-block';
        });
        
        // 保存按钮点击事件
        if (saveUsernameBtn) {
            saveUsernameBtn.addEventListener('click', function() {
                const newUsername = usernameInput.value.trim();
                if (newUsername && newUsername !== originalUsername) {
                    // 这里可以添加用户名修改逻辑
                    // 示例：发送请求到服务器修改用户名
                    showSuccess('用户名修改成功！');
                    originalUsername = newUsername;
                }
                saveUsernameBtn.style.display = 'none';
                cancelUsernameBtn.style.display = 'none';
            });
        }
        
        // 取消按钮点击事件
        if (cancelUsernameBtn) {
            cancelUsernameBtn.addEventListener('click', function() {
                usernameInput.value = originalUsername;
                saveUsernameBtn.style.display = 'none';
                cancelUsernameBtn.style.display = 'none';
            });
        }
        
        // 点击页面其他地方关闭保存/取消按钮
        window.addEventListener('click', function(e) {
            if (!usernameInput.contains(e.target) && !saveUsernameBtn.contains(e.target) && !cancelUsernameBtn.contains(e.target)) {
                saveUsernameBtn.style.display = 'none';
                cancelUsernameBtn.style.display = 'none';
                usernameInput.value = originalUsername;
            }
        });
    }
    
    // 手机号修改功能
    if (changePhoneBtn && phoneChangeSection) {
        changePhoneBtn.addEventListener('click', function() {
            if (phoneChangeSection.style.display === 'none') {
                phoneChangeSection.style.display = 'block';
            } else {
                phoneChangeSection.style.display = 'none';
            }
        });
        
        if (phoneChangeForm) {
            phoneChangeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // 这里可以添加手机号修改逻辑
                showSuccess('手机号修改成功！');
                phoneChangeSection.style.display = 'none';
            });
        }
    }
    
    // 邮箱修改功能
    if (changeEmailBtn && emailChangeSection) {
        changeEmailBtn.addEventListener('click', function() {
            if (emailChangeSection.style.display === 'none') {
                emailChangeSection.style.display = 'block';
            } else {
                emailChangeSection.style.display = 'none';
            }
        });
        
        if (emailChangeForm) {
            emailChangeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // 这里可以添加邮箱修改逻辑
                showSuccess('邮箱修改成功！');
                emailChangeSection.style.display = 'none';
            });
        }
    }
    
    // 密码显示/隐藏切换
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁️' : '🙈';
        });
    });
    
    // 自定义确认弹窗功能
    const confirmModal = document.getElementById('confirmModal');
    const closeConfirm = document.querySelector('.close-confirm');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmOk = document.getElementById('confirmOk');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    
    let confirmCallback = null;
    
    // 打开确认弹窗
    function showConfirm(title, message, callback) {
        confirmTitle.textContent = title;
        confirmMessage.textContent = message;
        confirmCallback = callback;
        confirmModal.style.display = 'block';
    }
    
    // 关闭确认弹窗
    function closeConfirmModal() {
        confirmModal.style.display = 'none';
        confirmCallback = null;
    }
    
    // 关闭按钮点击事件
    if (closeConfirm) {
        closeConfirm.addEventListener('click', closeConfirmModal);
    }
    
    // 取消按钮点击事件
    if (confirmCancel) {
        confirmCancel.addEventListener('click', closeConfirmModal);
    }
    
    // 确认按钮点击事件
    if (confirmOk) {
        confirmOk.addEventListener('click', function() {
            if (confirmCallback) {
                confirmCallback();
            }
            closeConfirmModal();
        });
    }
    
    // 点击弹窗外部关闭
    window.addEventListener('click', function(e) {
        if (e.target == confirmModal) {
            closeConfirmModal();
        }
    });
    
    // 自定义成功弹窗功能
    const successModal = document.getElementById('successModal');
    const closeSuccess = document.querySelector('.close-success');
    const successOk = document.getElementById('successOk');
    const successMessage = document.getElementById('successMessage');
    
    // 打开成功弹窗
    function showSuccess(message) {
        successMessage.textContent = message;
        successModal.style.display = 'block';
        
        // 3秒后自动关闭弹窗
        setTimeout(closeSuccessModal, 3000);
    }
    
    // 关闭成功弹窗
    function closeSuccessModal() {
        successModal.style.display = 'none';
    }
    
    // 关闭按钮点击事件
    if (closeSuccess) {
        closeSuccess.addEventListener('click', closeSuccessModal);
    }
    
    // 确定按钮点击事件
    if (successOk) {
        successOk.addEventListener('click', closeSuccessModal);
    }
    
    // 点击弹窗外部关闭
    window.addEventListener('click', function(e) {
        if (e.target == successModal) {
            closeSuccessModal();
        }
    });
    
    // 移除部分付款/送货的链接功能，直接在文本中显示完整信息
    
    // 计算器功能
    function initCalculator() {
        const calculatorBtn = document.getElementById('calculatorBtn');
        const calculatorModal = document.getElementById('calculatorModal');
        const closeCalculator = document.querySelector('.close-calculator');
        
        // 打开计算器弹窗
        if (calculatorBtn) {
            calculatorBtn.addEventListener('click', function() {
                calculatorModal.style.display = 'block';
            });
        }
        
        // 关闭计算器弹窗
        if (closeCalculator) {
            closeCalculator.addEventListener('click', function() {
                calculatorModal.style.display = 'none';
            });
        }
        
        // 点击弹窗外部关闭
        if (calculatorModal) {
            window.addEventListener('click', function(e) {
                if (e.target == calculatorModal) {
                    calculatorModal.style.display = 'none';
                }
            });
        }
    }
    
    // 初始化计算器
    if (document.getElementById('calculatorBtn')) {
        initCalculator();
    }
    
    // 查询未付款购货人功能
    function initUnpaidCustomerFilter() {
        const unpaidBtn = document.getElementById('unpaidBtn');
        const customerRows = document.querySelectorAll('tbody tr');
        let showAllBtn = null;
        
        // 检查是否已存在显示全部按钮
        if (!document.getElementById('showAllBtn')) {
            // 创建显示全部按钮
            showAllBtn = document.createElement('button');
            showAllBtn.id = 'showAllBtn';
            showAllBtn.className = 'btn btn-secondary mr-4';
            showAllBtn.style.minWidth = '180px';
            showAllBtn.style.padding = '10px 15px';
            showAllBtn.textContent = '显示全部购货人';
            showAllBtn.style.display = 'none';
            
            // 添加到按钮容器，替换未付款按钮的位置
            const buttonContainer = unpaidBtn.parentElement;
            buttonContainer.insertBefore(showAllBtn, unpaidBtn);
        } else {
            showAllBtn = document.getElementById('showAllBtn');
        }
        
        // 点击查询未付款按钮
        if (unpaidBtn) {
            unpaidBtn.addEventListener('click', function() {
                let hasUnpaid = false;
                
                // 隐藏所有行
                customerRows.forEach(row => {
                    const purchaseItems = row.querySelector('td:nth-child(4)').textContent;
                    // 检查是否未付款或部分付款
                    if (purchaseItems.includes('未付款') || purchaseItems.includes('部分付款')) {
                        row.style.display = '';
                        hasUnpaid = true;
                    } else {
                        row.style.display = 'none';
                    }
                });
                
                // 显示显示全部按钮，隐藏未付款按钮
                if (showAllBtn) {
                    showAllBtn.style.display = 'inline-block';
                    unpaidBtn.style.display = 'none';
                }
                
                // 显示提示
                if (!hasUnpaid) {
                    showSuccess('没有未付款的购货人');
                }
            });
        }
        
        // 点击显示全部按钮
        if (showAllBtn) {
            showAllBtn.addEventListener('click', function() {
                // 显示所有行
                customerRows.forEach(row => {
                    row.style.display = '';
                });
                
                // 隐藏显示全部按钮，显示未付款按钮
                this.style.display = 'none';
                if (unpaidBtn) {
                    unpaidBtn.style.display = 'inline-block';
                }
            });
        }
    }
    
    // 初始化未付款购货人过滤
    if (document.getElementById('unpaidBtn')) {
        initUnpaidCustomerFilter();
    }
    
    // 搜索功能
    function initSearchFunction() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const customerRows = document.querySelectorAll('tbody tr');
        let showAllBtn = null;
        
        // 检查是否已存在显示全部按钮
        if (!document.getElementById('showAllSearchBtn')) {
            // 创建显示全部按钮
            showAllBtn = document.createElement('button');
            showAllBtn.id = 'showAllSearchBtn';
            showAllBtn.className = 'btn btn-secondary';
            showAllBtn.style.marginLeft = '10px';
            showAllBtn.style.display = 'none';
            showAllBtn.textContent = '显示全部';
            
            // 添加到搜索栏容器
            const searchContainer = searchBtn.parentElement.parentElement;
            searchContainer.appendChild(showAllBtn);
        } else {
            showAllBtn = document.getElementById('showAllSearchBtn');
        }
        
        // 搜索功能
        function performSearch() {
            const keyword = searchInput.value.trim().toLowerCase();
            let hasMatch = false;
            
            // 过滤行
            customerRows.forEach(row => {
                const nickname = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
                if (nickname.includes(keyword)) {
                    row.style.display = '';
                    hasMatch = true;
                } else {
                    row.style.display = 'none';
                }
            });
            
            // 显示显示全部按钮
            if (showAllBtn) {
                showAllBtn.style.display = keyword ? 'inline-block' : 'none';
            }
            
            // 显示提示
            if (keyword && !hasMatch) {
                showSuccess('没有找到匹配的购货人');
            }
        }
        
        // 点击搜索按钮
        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }
        
        // 回车键搜索
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
        
        // 点击显示全部按钮
        if (showAllBtn) {
            showAllBtn.addEventListener('click', function() {
                // 显示所有行
                customerRows.forEach(row => {
                    row.style.display = '';
                });
                
                // 清空搜索框
                if (searchInput) {
                    searchInput.value = '';
                }
                
                // 隐藏显示全部按钮
                this.style.display = 'none';
            });
        }
    }
    
    // 初始化搜索功能
    if (document.getElementById('searchBtn')) {
        initSearchFunction();
    }
    
    // 价位设置功能
    function initPriceSetting() {
        const priceModal = document.getElementById('priceModal');
        const closePriceModal = document.querySelector('.close-price');
        const priceForm = document.getElementById('priceForm');
        const priceInput = document.getElementById('priceInput');
        const priceType = document.getElementById('priceType');
        const priceModalTitle = document.getElementById('priceModalTitle');
        
        // 价位按钮
        const hempPriceBtn = document.getElementById('麻绳价位Btn');
        const soybeanPriceBtn = document.getElementById('豆粕价位Btn');
        
        // 打开价位输入弹窗
        function openPriceModal(type, title) {
            priceType.value = type;
            priceModalTitle.textContent = title;
            
            // 获取原价位并显示
            const originalPriceElement = document.getElementById('originalPrice');
            const currentPrice = localStorage.getItem(`${type}价位`) || 0;
            if (originalPriceElement) {
                originalPriceElement.textContent = `原价位：${currentPrice}元`;
            }
            
            priceInput.value = '';
            priceModal.style.display = 'block';
        }
        
        // 关闭价位输入弹窗
        function closePriceModalFunc() {
            priceModal.style.display = 'none';
        }
        
        // 为按钮添加点击事件
        if (hempPriceBtn) {
            hempPriceBtn.addEventListener('click', function() {
                openPriceModal('麻绳', '设置今日麻绳价位');
            });
        }
        
        if (soybeanPriceBtn) {
            soybeanPriceBtn.addEventListener('click', function() {
                openPriceModal('豆粕', '设置今日豆粕价位');
            });
        }
        
        // 关闭按钮点击事件
        if (closePriceModal) {
            closePriceModal.addEventListener('click', closePriceModalFunc);
        }
        
        // 点击弹窗外部关闭
        if (priceModal) {
            window.addEventListener('click', function(e) {
                if (e.target == priceModal) {
                    closePriceModalFunc();
                }
            });
        }
        
        // 表单提交事件
        if (priceForm) {
            priceForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const type = priceType.value;
                const price = parseFloat(priceInput.value);
                
                if (!isNaN(price) && price >= 0) {
                    // 存储价位到localStorage
                    localStorage.setItem(`${type}价位`, price);
                    console.log(`${type}价位已设置为:`, price);
                    showSuccess(`${type}价位设置成功！`);
                    closePriceModalFunc();
                    
                    // 重新计算应付钱数
                    calculateTotalAmounts();
                } else {
                    showSuccess('请输入有效的价位！');
                }
            });
        }
    }
    
    // 数据库操作功能
    function initDatabaseOperations() {
        // 新建数据库弹窗元素
        const createDbModal = document.getElementById('createDbModal');
        const createDbBtn = document.getElementById('createDbBtn');
        const closeCreateDb = document.querySelector('.close-create-db');
        const createDbForm = document.getElementById('createDbForm');
        
        // 打开数据库弹窗元素
        const openDbModal = document.getElementById('openDbModal');
        const openDbBtn = document.getElementById('openDbBtn');
        const closeOpenDb = document.querySelector('.close-open-db');
        const openDbForm = document.getElementById('openDbForm');
        const dbSelect = document.getElementById('dbSelect');
        
        // 打开新建数据库弹窗
        if (createDbBtn) {
            createDbBtn.addEventListener('click', function() {
                createDbModal.style.display = 'block';
            });
        }
        
        // 关闭新建数据库弹窗
        if (closeCreateDb) {
            closeCreateDb.addEventListener('click', function() {
                createDbModal.style.display = 'none';
            });
        }
        
        // 点击弹窗外部关闭
        if (createDbModal) {
            createDbModal.addEventListener('click', function(e) {
                if (e.target === createDbModal) {
                    createDbModal.style.display = 'none';
                }
            });
        }
        
        // 新建数据库表单提交
        if (createDbForm) {
            createDbForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // 获取选中的项目
                const selectedProject = document.querySelector('input[name="dbProject"]:checked');
                const project = selectedProject ? selectedProject.value : '';
                
                // 获取数据库名称
                const dbName = document.getElementById('dbNameInput').value.trim();
                
                if (project && dbName) {
                    // 发送请求创建数据库
                    fetch('/create_database', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            project: project,
                            db_name: dbName
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            showSuccess('数据库创建成功！');
                            createDbModal.style.display = 'none';
                            createDbForm.reset();
                            // 刷新页面以显示新数据库
                            window.location.reload();
                        } else {
                            showSuccess(data.message || '数据库创建失败！');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showSuccess('数据库创建失败！');
                    });
                } else {
                    showSuccess('请选择项目并输入数据库名称！');
                }
            });
        }
        
        // 打开打开数据库弹窗
        if (openDbBtn) {
            openDbBtn.addEventListener('click', function() {
                // 加载数据库列表
                loadDatabaseList();
                openDbModal.style.display = 'block';
            });
        }
        
        // 关闭打开数据库弹窗
        if (closeOpenDb) {
            closeOpenDb.addEventListener('click', function() {
                openDbModal.style.display = 'none';
            });
        }
        
        // 点击弹窗外部关闭
        if (openDbModal) {
            openDbModal.addEventListener('click', function(e) {
                if (e.target === openDbModal) {
                    openDbModal.style.display = 'none';
                }
            });
        }
        
        // 加载数据库列表
        function loadDatabaseList() {
            if (dbSelect) {
                fetch('/list_databases')
                    .then(response => response.json())
                    .then(data => {
                        dbSelect.innerHTML = '<option value="">请选择数据库</option>';
                        if (data.databases && data.databases.length > 0) {
                            data.databases.forEach(db => {
                                const option = document.createElement('option');
                                option.value = db.name;
                                option.textContent = `${db.name} (${db.project})`;
                                dbSelect.appendChild(option);
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        }
        
        // 打开数据库表单提交
        if (openDbForm) {
            openDbForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const selectedDb = dbSelect.value;
                
                if (selectedDb) {
                    // 发送请求打开数据库
                    fetch('/open_database', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            db_name: selectedDb
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            showSuccess('数据库打开成功！');
                            openDbModal.style.display = 'none';
                            // 刷新页面显示新数据库的数据
                            window.location.reload();
                        } else {
                            showSuccess(data.message || '数据库打开失败！');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showSuccess('数据库打开失败！');
                    });
                } else {
                    showSuccess('请选择要打开的数据库！');
                }
            });
        }
    }
    
    // 修改购货人功能
    function initEditCustomer() {
        const editCustomerModal = document.getElementById('editCustomerModal');
        const closeEditCustomer = document.querySelector('.close-edit-customer');
        const editCustomerForm = document.getElementById('editCustomerForm');
        
        // 为所有修改按钮添加点击事件
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const customerId = this.getAttribute('data-id');
                
                // 获取当前行数据
                const row = this.closest('tr');
                const purchaseItemsElement = row.querySelector('.purchase-items');
                const nickname = row.cells[0].textContent;
                const phone = row.cells[1].textContent;
                const purchaseTime = row.cells[2].textContent;
                
                // 设置基本信息
                document.getElementById('editCustomerId').value = customerId;
                document.getElementById('editNickname').value = nickname;
                document.getElementById('editPhone').value = phone;
                document.getElementById('editPurchaseTime').value = purchaseTime;
                
                // 解析购买项目数据
                const purchaseItems = purchaseItemsElement.textContent;
                parsePurchaseItemsForEdit(purchaseItems);
                
                // 显示弹窗
                editCustomerModal.style.display = 'block';
            });
        });
        
        // 关闭弹窗
        if (closeEditCustomer) {
            closeEditCustomer.addEventListener('click', function() {
                editCustomerModal.style.display = 'none';
            });
        }
        
        // 点击弹窗外部关闭
        if (editCustomerModal) {
            editCustomerModal.addEventListener('click', function(e) {
                if (e.target === editCustomerModal) {
                    editCustomerModal.style.display = 'none';
                }
            });
        }
        
        // 表单提交
        if (editCustomerForm) {
            editCustomerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // 收集购买项目信息
                let itemInfo = '';
                
                // 麻绳
                if (document.getElementById('edit麻绳').checked) {
                    const hempTons = document.getElementById('edit麻绳吨数').value;
                    itemInfo += `麻绳 ${hempTons}吨`;
                    
                    // 获取付款状态
                    const paymentRadios = document.getElementsByName('edit麻绳付款状态');
                    for (const radio of paymentRadios) {
                        if (radio.checked) {
                            if (radio.id === 'edit麻绳已付款') {
                                itemInfo += ' 已付款';
                            } else if (radio.id === 'edit麻绳未付款') {
                                itemInfo += ' 未付款';
                            } else if (radio.id === 'edit麻绳部分付款') {
                                const paymentAmount = document.getElementById('edit麻绳部分付款金额输入').value;
                                itemInfo += ` 部分付款${paymentAmount}元`;
                            }
                            break;
                        }
                    }
                    
                    // 获取送货状态
                    const deliveryRadios = document.getElementsByName('edit麻绳送货状态');
                    for (const radio of deliveryRadios) {
                        if (radio.checked) {
                            if (radio.id === 'edit麻绳已送货') {
                                itemInfo += ' 已送货';
                            } else if (radio.id === 'edit麻绳未送货') {
                                itemInfo += ' 未送货';
                            } else if (radio.id === 'edit麻绳部分送货') {
                                const deliveryAmount = document.getElementById('edit麻绳部分送货数量输入').value;
                                itemInfo += ` 部分送货${deliveryAmount}吨`;
                            }
                            break;
                        }
                    }
                    
                    itemInfo += ',';
                }
                
                // 豆粕
                if (document.getElementById('edit豆粕').checked) {
                    const soybeanTons = document.getElementById('edit豆粕吨数').value;
                    itemInfo += `豆粕 ${soybeanTons}吨`;
                    
                    // 获取付款状态
                    const paymentRadios = document.getElementsByName('edit豆粕付款状态');
                    for (const radio of paymentRadios) {
                        if (radio.checked) {
                            if (radio.id === 'edit豆粕已付款') {
                                itemInfo += ' 已付款';
                            } else if (radio.id === 'edit豆粕未付款') {
                                itemInfo += ' 未付款';
                            } else if (radio.id === 'edit豆粕部分付款') {
                                const paymentAmount = document.getElementById('edit豆粕部分付款金额输入').value;
                                itemInfo += ` 部分付款${paymentAmount}元`;
                            }
                            break;
                        }
                    }
                    
                    // 获取送货状态
                    const deliveryRadios = document.getElementsByName('edit豆粕送货状态');
                    for (const radio of deliveryRadios) {
                        if (radio.checked) {
                            if (radio.id === 'edit豆粕已送货') {
                                itemInfo += ' 已送货';
                            } else if (radio.id === 'edit豆粕未送货') {
                                itemInfo += ' 未送货';
                            } else if (radio.id === 'edit豆粕部分送货') {
                                const deliveryAmount = document.getElementById('edit豆粕部分送货数量输入').value;
                                itemInfo += ` 部分送货${deliveryAmount}吨`;
                            }
                            break;
                        }
                    }
                    
                    itemInfo += ',';
                }
                
                // 移除末尾逗号
                if (itemInfo.endsWith(',')) {
                    itemInfo = itemInfo.slice(0, -1);
                }
                
                // 设置隐藏字段
                document.getElementById('editPurchaseItems').value = itemInfo || '无';
                
                // 提交表单
                this.submit();
            });
        }
        
        // 解析购买项目数据用于编辑
        function parsePurchaseItemsForEdit(purchaseItems) {
            // 重置所有复选框
            document.getElementById('edit麻绳').checked = false;
            document.getElementById('edit豆粕').checked = false;
            document.getElementById('edit麻绳-details').style.display = 'none';
            document.getElementById('edit豆粕-details').style.display = 'none';
            
            // 解析麻绳
            const hempMatch = purchaseItems.match(/麻绳[^\d]*([\d.]+)[^\d]*吨/);
            if (hempMatch) {
                document.getElementById('edit麻绳').checked = true;
                document.getElementById('edit麻绳-details').style.display = 'block';
                document.getElementById('edit麻绳吨数').value = hempMatch[1];
                
                // 付款状态
                if (purchaseItems.includes('麻绳 已付款') || purchaseItems.includes('麻绳已付款')) {
                    document.getElementById('edit麻绳已付款').checked = true;
                } else if (purchaseItems.includes('麻绳 未付款') || purchaseItems.includes('麻绳未付款')) {
                    document.getElementById('edit麻绳未付款').checked = true;
                } else if (purchaseItems.includes('麻绳 部分付款') || purchaseItems.includes('麻绳部分付款')) {
                    document.getElementById('edit麻绳部分付款').checked = true;
                    const paymentMatch = purchaseItems.match(/部分付款(\d+)元/);
                    if (paymentMatch) {
                        document.getElementById('edit麻绳部分付款金额输入').value = paymentMatch[1];
                    }
                }
                
                // 送货状态
                if (purchaseItems.includes('麻绳 已送货') || purchaseItems.includes('麻绳已送货')) {
                    document.getElementById('edit麻绳已送货').checked = true;
                } else if (purchaseItems.includes('麻绳 未送货') || purchaseItems.includes('麻绳未送货')) {
                    document.getElementById('edit麻绳未送货').checked = true;
                } else if (purchaseItems.includes('麻绳 部分送货') || purchaseItems.includes('麻绳部分送货')) {
                    document.getElementById('edit麻绳部分送货').checked = true;
                    const deliveryMatch = purchaseItems.match(/部分送货(\d.?\d*)吨/);
                    if (deliveryMatch) {
                        document.getElementById('edit麻绳部分送货数量输入').value = deliveryMatch[1];
                    }
                }
            }
            
            // 解析豆粕
            const soybeanMatch = purchaseItems.match(/豆粕[^\d]*([\d.]+)[^\d]*吨/);
            if (soybeanMatch) {
                document.getElementById('edit豆粕').checked = true;
                document.getElementById('edit豆粕-details').style.display = 'block';
                document.getElementById('edit豆粕吨数').value = soybeanMatch[1];
                
                // 付款状态
                if (purchaseItems.includes('豆粕 已付款') || purchaseItems.includes('豆粕已付款')) {
                    document.getElementById('edit豆粕已付款').checked = true;
                } else if (purchaseItems.includes('豆粕 未付款') || purchaseItems.includes('豆粕未付款')) {
                    document.getElementById('edit豆粕未付款').checked = true;
                } else if (purchaseItems.includes('豆粕 部分付款') || purchaseItems.includes('豆粕部分付款')) {
                    document.getElementById('edit豆粕部分付款').checked = true;
                    const paymentMatch = purchaseItems.match(/部分付款(\d+)元/);
                    if (paymentMatch) {
                        document.getElementById('edit豆粕部分付款金额输入').value = paymentMatch[1];
                    }
                }
                
                // 送货状态
                if (purchaseItems.includes('豆粕 已送货') || purchaseItems.includes('豆粕已送货')) {
                    document.getElementById('edit豆粕已送货').checked = true;
                } else if (purchaseItems.includes('豆粕 未送货') || purchaseItems.includes('豆粕未送货')) {
                    document.getElementById('edit豆粕未送货').checked = true;
                } else if (purchaseItems.includes('豆粕 部分送货') || purchaseItems.includes('豆粕部分送货')) {
                    document.getElementById('edit豆粕部分送货').checked = true;
                    const deliveryMatch = purchaseItems.match(/部分送货(\d.?\d*)吨/);
                    if (deliveryMatch) {
                        document.getElementById('edit豆粕部分送货数量输入').value = deliveryMatch[1];
                    }
                }
            }
        }
    }
    
    // 计算应付钱数
    function calculateTotalAmounts() {
        console.log('开始计算应付钱数和差货');
        const customerRows = document.querySelectorAll('tbody tr');
        console.log('找到', customerRows.length, '行数据');
        
        customerRows.forEach((row, index) => {
            console.log('处理第', index + 1, '行');
            const purchaseItemsElement = row.querySelector('.purchase-items');
            const originalPurchaseItems = purchaseItemsElement.textContent;
            let displayPurchaseItems = originalPurchaseItems;
            const totalAmountElement = row.querySelector('.total-amount');
            
            if (totalAmountElement) {
                // 将逗号分隔改为换行显示
                if (displayPurchaseItems.includes(',')) {
                    displayPurchaseItems = displayPurchaseItems.replace(/,/g, '<br>');
                }
                
                // 对状态文本进行颜色标记
                displayPurchaseItems = displayPurchaseItems
                    .replace(/已付款/g, '<span style="color: green;">已付款</span>')
                    .replace(/已送货/g, '<span style="color: green;">已送货</span>')
                    .replace(/未付款/g, '<span style="color: red;">未付款</span>')
                    .replace(/未送货/g, '<span style="color: red;">未送货</span>')
                    .replace(/部分付款[^,]+/g, '<span style="color: orange;">$&</span>')
                    .replace(/部分送货[^,]+/g, '<span style="color: orange;">$&</span>');
                
                // 更新显示
                purchaseItemsElement.innerHTML = displayPurchaseItems;
                
                let totalAmount = 0;
                
                // 获取各项目价位
                const hempPrice = parseFloat(localStorage.getItem('麻绳价位')) || 0;
                const soybeanPrice = parseFloat(localStorage.getItem('豆粕价位')) || 0;
                const emergencyDrugPrice = parseFloat(localStorage.getItem('应急药价位')) || 0;
                
                // 调试信息
                console.log('麻绳价位:', hempPrice);
                console.log('购买项目:', originalPurchaseItems);
                
                // 解析购买项目并计算金额
                // 麻绳
                const hempRopeMatch = originalPurchaseItems.match(/麻绳[^\d]*([\d.]+)[^\d]*吨/);
                console.log('麻绳匹配结果:', hempRopeMatch);
                if (hempRopeMatch) {
                    const tons = parseFloat(hempRopeMatch[1]);
                    console.log('麻绳吨数:', tons);
                    totalAmount += tons * hempPrice;
                    console.log('麻绳金额:', tons * hempPrice);
                }
                
                // 备用匹配方式
                if (!hempRopeMatch) {
                    const hempRopeMatch2 = originalPurchaseItems.match(/(\d+)\s*吨\s*麻绳/);
                    console.log('麻绳备用匹配结果:', hempRopeMatch2);
                    if (hempRopeMatch2) {
                        const tons = parseFloat(hempRopeMatch2[1]);
                        console.log('麻绳吨数:', tons);
                        totalAmount += tons * hempPrice;
                        console.log('麻绳金额:', tons * hempPrice);
                    }
                }
                
                // 豆粕
                const soybeanMatch = originalPurchaseItems.match(/豆粕[^\d]*([\d.]+)[^\d]*吨/);
                console.log('豆粕匹配结果:', soybeanMatch);
                if (soybeanMatch) {
                    const tons = parseFloat(soybeanMatch[1]);
                    console.log('豆粕吨数:', tons);
                    totalAmount += tons * soybeanPrice;
                    console.log('豆粕金额:', tons * soybeanPrice);
                }
                
                // 应急药
                const emergencyDrugMatch = originalPurchaseItems.match(/应急药[^\d]*([\d.]+)[^\d]*斤/);
                console.log('应急药匹配结果:', emergencyDrugMatch);
                if (emergencyDrugMatch) {
                    const pounds = parseFloat(emergencyDrugMatch[1]);
                    console.log('应急药斤数:', pounds);
                    totalAmount += pounds * emergencyDrugPrice;
                    console.log('应急药金额:', pounds * emergencyDrugPrice);
                }
                
                // 计算差额
                let balance = 0;
                
                console.log('开始计算差额:', originalPurchaseItems);
                
                // 解析付款状态并计算差额
                // 麻绳付款状态
                if (originalPurchaseItems.includes('麻绳')) {
                    console.log('包含麻绳');
                    if (originalPurchaseItems.includes('已付款')) {
                        console.log('麻绳已付款');
                        // 已付款，差额为0
                    } else if (originalPurchaseItems.includes('未付款')) {
                        console.log('麻绳未付款');
                        // 未付款，差额为麻绳金额
                        const hempRopeMatch = originalPurchaseItems.match(/麻绳[^\d]*([\d.]+)[^\d]*吨/);
                        console.log('麻绳匹配结果:', hempRopeMatch);
                        if (hempRopeMatch) {
                            const tons = parseFloat(hempRopeMatch[1]);
                            console.log('麻绳吨数:', tons);
                            console.log('麻绳价位:', hempPrice);
                            balance += tons * hempPrice;
                            console.log('麻绳差额:', tons * hempPrice);
                        }
                    } else if (originalPurchaseItems.includes('部分付款')) {
                        console.log('麻绳部分付款');
                        // 部分付款，差额为麻绳金额减去已付款金额
                        const hempRopeMatch = originalPurchaseItems.match(/麻绳[^\d]*([\d.]+)[^\d]*吨/);
                        console.log('麻绳匹配结果:', hempRopeMatch);
                        if (hempRopeMatch) {
                            const tons = parseFloat(hempRopeMatch[1]);
                            const hempAmount = tons * hempPrice;
                            console.log('麻绳金额:', hempAmount);
                            
                            // 提取部分付款金额
                            let partialPayment = 0;
                            // 尝试多种格式匹配部分付款金额
                            // 格式1: 部分付款1000元（紧密连接）
                            const partialPaymentMatch1 = originalPurchaseItems.match(/部分付款(\d+)元/);
                            // 格式2: 部分付款 1000元（有空格）
                            const partialPaymentMatch2 = originalPurchaseItems.match(/部分付款\s+(\d+)元/);
                            // 格式3: 部分付款1000（没有元字）
                            const partialPaymentMatch3 = originalPurchaseItems.match(/部分付款(\d+)(?!元)/);
                            // 格式4: 部分付款 1000（没有元字，有空格）
                            const partialPaymentMatch4 = originalPurchaseItems.match(/部分付款\s+(\d+)(?!元)/);
                            console.log('部分付款匹配结果1:', partialPaymentMatch1);
                            console.log('部分付款匹配结果2:', partialPaymentMatch2);
                            console.log('部分付款匹配结果3:', partialPaymentMatch3);
                            console.log('部分付款匹配结果4:', partialPaymentMatch4);
                            
                            if (partialPaymentMatch1) {
                                partialPayment = parseFloat(partialPaymentMatch1[1]);
                            } else if (partialPaymentMatch2) {
                                partialPayment = parseFloat(partialPaymentMatch2[1]);
                            } else if (partialPaymentMatch3) {
                                partialPayment = parseFloat(partialPaymentMatch3[1]);
                            } else if (partialPaymentMatch4) {
                                partialPayment = parseFloat(partialPaymentMatch4[1]);
                            }
                            
                            console.log('部分付款金额:', partialPayment);
                            balance += hempAmount - partialPayment;
                            console.log('麻绳差额:', hempAmount - partialPayment);
                        }
                    }
                }
                
                // 豆粕付款状态
                if (originalPurchaseItems.includes('豆粕')) {
                    console.log('包含豆粕');
                    if (originalPurchaseItems.includes('已付款')) {
                        console.log('豆粕已付款');
                        // 已付款，差额为0
                    } else if (originalPurchaseItems.includes('未付款')) {
                        console.log('豆粕未付款');
                        // 未付款，差额为豆粕金额
                        const soybeanMatch = originalPurchaseItems.match(/豆粕[^\d]*([\d.]+)[^\d]*吨/);
                        console.log('豆粕匹配结果:', soybeanMatch);
                        if (soybeanMatch) {
                            const tons = parseFloat(soybeanMatch[1]);
                            console.log('豆粕吨数:', tons);
                            console.log('豆粕价位:', soybeanPrice);
                            balance += tons * soybeanPrice;
                            console.log('豆粕差额:', tons * soybeanPrice);
                        }
                    } else if (originalPurchaseItems.includes('部分付款')) {
                        console.log('豆粕部分付款');
                        // 部分付款，差额为豆粕金额减去已付款金额
                        const soybeanMatch = originalPurchaseItems.match(/豆粕[^\d]*([\d.]+)[^\d]*吨/);
                        console.log('豆粕匹配结果:', soybeanMatch);
                        if (soybeanMatch) {
                            const tons = parseFloat(soybeanMatch[1]);
                            const soybeanAmount = tons * soybeanPrice;
                            console.log('豆粕金额:', soybeanAmount);
                            
                            // 提取部分付款金额
                            let partialPayment = 0;
                            // 尝试多种格式匹配部分付款金额
                            // 格式1: 部分付款1000元
                            const partialPaymentMatch1 = originalPurchaseItems.match(/部分付款(\d+)元/);
                            // 格式2: 部分付款 1000（没有元字）
                            const partialPaymentMatch2 = originalPurchaseItems.match(/部分付款\s*([\d.]+)/);
                            // 格式3: 部分付款1000（没有空格）
                            const partialPaymentMatch3 = originalPurchaseItems.match(/部分付款([\d.]+)/);
                            console.log('部分付款匹配结果1:', partialPaymentMatch1);
                            console.log('部分付款匹配结果2:', partialPaymentMatch2);
                            console.log('部分付款匹配结果3:', partialPaymentMatch3);
                            
                            if (partialPaymentMatch1) {
                                partialPayment = parseFloat(partialPaymentMatch1[1]);
                            } else if (partialPaymentMatch2) {
                                partialPayment = parseFloat(partialPaymentMatch2[1]);
                            } else if (partialPaymentMatch3) {
                                partialPayment = parseFloat(partialPaymentMatch3[1]);
                            }
                            
                            console.log('部分付款金额:', partialPayment);
                            balance += soybeanAmount - partialPayment;
                            console.log('豆粕差额:', soybeanAmount - partialPayment);
                        }
                    }
                }
                
                // 应急药付款状态
                if (originalPurchaseItems.includes('应急药')) {
                    console.log('包含应急药');
                    if (originalPurchaseItems.includes('已付款')) {
                        console.log('应急药已付款');
                        // 已付款，差额为0
                    } else if (originalPurchaseItems.includes('未付款')) {
                        console.log('应急药未付款');
                        // 未付款，差额为应急药金额
                        const emergencyDrugMatch = originalPurchaseItems.match(/应急药[^\d]*([\d.]+)[^\d]*斤/);
                        console.log('应急药匹配结果:', emergencyDrugMatch);
                        if (emergencyDrugMatch) {
                            const pounds = parseFloat(emergencyDrugMatch[1]);
                            console.log('应急药斤数:', pounds);
                            console.log('应急药价位:', emergencyDrugPrice);
                            balance += pounds * emergencyDrugPrice;
                            console.log('应急药差额:', pounds * emergencyDrugPrice);
                        }
                    } else if (originalPurchaseItems.includes('部分付款')) {
                        console.log('应急药部分付款');
                        // 部分付款，差额为应急药金额减去已付款金额
                        const emergencyDrugMatch = originalPurchaseItems.match(/应急药[^\d]*([\d.]+)[^\d]*斤/);
                        console.log('应急药匹配结果:', emergencyDrugMatch);
                        if (emergencyDrugMatch) {
                            const pounds = parseFloat(emergencyDrugMatch[1]);
                            const emergencyDrugAmount = pounds * emergencyDrugPrice;
                            console.log('应急药金额:', emergencyDrugAmount);
                            
                            // 提取部分付款金额
                            let partialPayment = 0;
                            // 尝试多种格式匹配部分付款金额
                            // 格式1: 部分付款1000元
                            const partialPaymentMatch1 = originalPurchaseItems.match(/部分付款(\d+)元/);
                            // 格式2: 部分付款 1000（没有元字）
                            const partialPaymentMatch2 = originalPurchaseItems.match(/部分付款\s*([\d.]+)/);
                            // 格式3: 部分付款1000（没有空格）
                            const partialPaymentMatch3 = originalPurchaseItems.match(/部分付款([\d.]+)/);
                            console.log('部分付款匹配结果1:', partialPaymentMatch1);
                            console.log('部分付款匹配结果2:', partialPaymentMatch2);
                            console.log('部分付款匹配结果3:', partialPaymentMatch3);
                            
                            if (partialPaymentMatch1) {
                                partialPayment = parseFloat(partialPaymentMatch1[1]);
                            } else if (partialPaymentMatch2) {
                                partialPayment = parseFloat(partialPaymentMatch2[1]);
                            } else if (partialPaymentMatch3) {
                                partialPayment = parseFloat(partialPaymentMatch3[1]);
                            }
                            
                            console.log('部分付款金额:', partialPayment);
                            balance += emergencyDrugAmount - partialPayment;
                            console.log('应急药差额:', emergencyDrugAmount - partialPayment);
                        }
                    }
                }
                
                // 奶饲料付款状态
                if (originalPurchaseItems.includes('奶饲料')) {
                    console.log('包含奶饲料');
                    if (originalPurchaseItems.includes('已付款')) {
                        console.log('奶饲料已付款');
                        // 已付款，差额为0
                    } else if (originalPurchaseItems.includes('未付款')) {
                        console.log('奶饲料未付款');
                        // 未付款，差额为奶饲料金额
                        const milkFeedMatch = originalPurchaseItems.match(/奶饲料[^\d]*([\d.]+)[^\d]*吨/);
                        console.log('奶饲料匹配结果:', milkFeedMatch);
                        if (milkFeedMatch) {
                            const tons = parseFloat(milkFeedMatch[1]);
                            console.log('奶饲料吨数:', tons);
                            console.log('奶饲料价位:', milkFeedPrice);
                            balance += tons * milkFeedPrice;
                            console.log('奶饲料差额:', tons * milkFeedPrice);
                        }
                    } else if (originalPurchaseItems.includes('部分付款')) {
                        console.log('奶饲料部分付款');
                        // 部分付款，差额为奶饲料金额减去已付款金额
                        const milkFeedMatch = originalPurchaseItems.match(/奶饲料[^\d]*([\d.]+)[^\d]*吨/);
                        console.log('奶饲料匹配结果:', milkFeedMatch);
                        if (milkFeedMatch) {
                            const tons = parseFloat(milkFeedMatch[1]);
                            const milkFeedAmount = tons * milkFeedPrice;
                            console.log('奶饲料金额:', milkFeedAmount);
                            
                            // 提取部分付款金额
                            let partialPayment = 0;
                            // 尝试多种格式匹配部分付款金额
                            // 格式1: 部分付款1000元
                            const partialPaymentMatch1 = originalPurchaseItems.match(/部分付款(\d+)元/);
                            // 格式2: 部分付款 1000（没有元字）
                            const partialPaymentMatch2 = originalPurchaseItems.match(/部分付款\s*([\d.]+)/);
                            // 格式3: 部分付款1000（没有空格）
                            const partialPaymentMatch3 = originalPurchaseItems.match(/部分付款([\d.]+)/);
                            console.log('部分付款匹配结果1:', partialPaymentMatch1);
                            console.log('部分付款匹配结果2:', partialPaymentMatch2);
                            console.log('部分付款匹配结果3:', partialPaymentMatch3);
                            
                            if (partialPaymentMatch1) {
                                partialPayment = parseFloat(partialPaymentMatch1[1]);
                            } else if (partialPaymentMatch2) {
                                partialPayment = parseFloat(partialPaymentMatch2[1]);
                            } else if (partialPaymentMatch3) {
                                partialPayment = parseFloat(partialPaymentMatch3[1]);
                            }
                            
                            console.log('部分付款金额:', partialPayment);
                            balance += milkFeedAmount - partialPayment;
                            console.log('奶饲料差额:', milkFeedAmount - partialPayment);
                        }
                    }
                }
                
                // 烟花付款状态
                if (originalPurchaseItems.includes('烟花')) {
                    console.log('包含烟花');
                    if (originalPurchaseItems.includes('已付款')) {
                        console.log('烟花已付款');
                        // 已付款，差额为0
                    } else if (originalPurchaseItems.includes('未付款')) {
                        console.log('烟花未付款');
                        // 未付款，差额为烟花金额
                        const fireworksMatch = originalPurchaseItems.match(/烟花[^\d]*([\d.]+)[^\d]*元/);
                        console.log('烟花匹配结果:', fireworksMatch);
                        if (fireworksMatch) {
                            const amount = parseFloat(fireworksMatch[1]);
                            console.log('烟花金额:', amount);
                            balance += amount;
                            console.log('烟花差额:', amount);
                        }
                    } else if (originalPurchaseItems.includes('部分付款')) {
                        console.log('烟花部分付款');
                        // 部分付款，差额为烟花金额减去已付款金额
                        const fireworksMatch = originalPurchaseItems.match(/烟花[^\d]*([\d.]+)[^\d]*元/);
                        console.log('烟花匹配结果:', fireworksMatch);
                        if (fireworksMatch) {
                            const fireworksAmount = parseFloat(fireworksMatch[1]);
                            console.log('烟花金额:', fireworksAmount);
                            
                            // 提取部分付款金额
                            let partialPayment = 0;
                            // 尝试多种格式匹配部分付款金额
                            // 格式1: 部分付款1000元
                            const partialPaymentMatch1 = originalPurchaseItems.match(/部分付款(\d+)元/);
                            // 格式2: 部分付款 1000（没有元字）
                            const partialPaymentMatch2 = originalPurchaseItems.match(/部分付款\s*([\d.]+)/);
                            // 格式3: 部分付款1000（没有空格）
                            const partialPaymentMatch3 = originalPurchaseItems.match(/部分付款([\d.]+)/);
                            console.log('部分付款匹配结果1:', partialPaymentMatch1);
                            console.log('部分付款匹配结果2:', partialPaymentMatch2);
                            console.log('部分付款匹配结果3:', partialPaymentMatch3);
                            
                            if (partialPaymentMatch1) {
                                partialPayment = parseFloat(partialPaymentMatch1[1]);
                            } else if (partialPaymentMatch2) {
                                partialPayment = parseFloat(partialPaymentMatch2[1]);
                            } else if (partialPaymentMatch3) {
                                partialPayment = parseFloat(partialPaymentMatch3[1]);
                            }
                            
                            console.log('部分付款金额:', partialPayment);
                            balance += fireworksAmount - partialPayment;
                            console.log('烟花差额:', fireworksAmount - partialPayment);
                        }
                    }
                }
                
                console.log('计算完成，总差额:', balance);
                
                // 计算差货（未送货数量）
                let deliveryBalance = 0;
                console.log('开始计算差货:', originalPurchaseItems);
                
                // 麻绳送货状态
                if (originalPurchaseItems.includes('麻绳')) {
                    console.log('包含麻绳，检查送货状态');
                    const hempRopeMatch = originalPurchaseItems.match(/麻绳[^\d]*([\d.]+)[^\d]*吨/);
                    console.log('麻绳匹配结果:', hempRopeMatch);
                    if (hempRopeMatch) {
                        const totalTons = parseFloat(hempRopeMatch[1]);
                        console.log('麻绳总吨数:', totalTons);
                        console.log('检查送货状态:', originalPurchaseItems);
                        if (originalPurchaseItems.includes('已送货')) {
                            console.log('麻绳已送货');
                            // 已送货，差货为0
                        } else if (originalPurchaseItems.includes('未送货')) {
                            console.log('麻绳未送货');
                            // 未送货，差货为总吨数
                            deliveryBalance += totalTons;
                        } else if (originalPurchaseItems.includes('部分送货')) {
                            console.log('麻绳部分送货');
                            // 部分送货，差货为总吨数减去已送货吨数
                            // 尝试多种格式匹配部分送货数量
                            const partialDeliveryMatch1 = originalPurchaseItems.match(/部分送货([\d.]+)吨/);
                            const partialDeliveryMatch2 = originalPurchaseItems.match(/部分送货\s*([\d.]+)/);
                            console.log('部分送货匹配结果1:', partialDeliveryMatch1);
                            console.log('部分送货匹配结果2:', partialDeliveryMatch2);
                            let deliveredTons = 0;
                            if (partialDeliveryMatch1) {
                                deliveredTons = parseFloat(partialDeliveryMatch1[1]);
                            } else if (partialDeliveryMatch2) {
                                deliveredTons = parseFloat(partialDeliveryMatch2[1]);
                            }
                            console.log('已送货吨数:', deliveredTons);
                            deliveryBalance += totalTons - deliveredTons;
                            console.log('麻绳差货:', totalTons - deliveredTons);
                        }
                    }
                }
                
                // 豆粕送货状态
                if (originalPurchaseItems.includes('豆粕')) {
                    console.log('包含豆粕，检查送货状态');
                    const soybeanMatch = originalPurchaseItems.match(/豆粕[^\d]*([\d.]+)[^\d]*吨/);
                    console.log('豆粕匹配结果:', soybeanMatch);
                    if (soybeanMatch) {
                        const totalTons = parseFloat(soybeanMatch[1]);
                        console.log('豆粕总吨数:', totalTons);
                        if (originalPurchaseItems.includes('已送货')) {
                            console.log('豆粕已送货');
                        } else if (originalPurchaseItems.includes('未送货')) {
                            console.log('豆粕未送货');
                            deliveryBalance += totalTons;
                        } else if (originalPurchaseItems.includes('部分送货')) {
                            console.log('豆粕部分送货');
                            const partialDeliveryMatch1 = originalPurchaseItems.match(/部分送货([\d.]+)吨/);
                            const partialDeliveryMatch2 = originalPurchaseItems.match(/部分送货\s*([\d.]+)/);
                            console.log('部分送货匹配结果1:', partialDeliveryMatch1);
                            console.log('部分送货匹配结果2:', partialDeliveryMatch2);
                            let deliveredTons = 0;
                            if (partialDeliveryMatch1) {
                                deliveredTons = parseFloat(partialDeliveryMatch1[1]);
                            } else if (partialDeliveryMatch2) {
                                deliveredTons = parseFloat(partialDeliveryMatch2[1]);
                            }
                            console.log('已送货吨数:', deliveredTons);
                            deliveryBalance += totalTons - deliveredTons;
                            console.log('豆粕差货:', totalTons - deliveredTons);
                        }
                    }
                }
                
                // 应急药送货状态
                if (originalPurchaseItems.includes('应急药')) {
                    console.log('包含应急药，检查送货状态');
                    const emergencyDrugMatch = originalPurchaseItems.match(/应急药[^\d]*([\d.]+)[^\d]*斤/);
                    console.log('应急药匹配结果:', emergencyDrugMatch);
                    if (emergencyDrugMatch) {
                        const totalPounds = parseFloat(emergencyDrugMatch[1]);
                        console.log('应急药总斤数:', totalPounds);
                        if (originalPurchaseItems.includes('已送货')) {
                            console.log('应急药已送货');
                        } else if (originalPurchaseItems.includes('未送货')) {
                            console.log('应急药未送货');
                            deliveryBalance += totalPounds;
                        } else if (originalPurchaseItems.includes('部分送货')) {
                            console.log('应急药部分送货');
                            const partialDeliveryMatch1 = originalPurchaseItems.match(/部分送货([\d.]+)斤/);
                            const partialDeliveryMatch2 = originalPurchaseItems.match(/部分送货\s*([\d.]+)/);
                            console.log('部分送货匹配结果1:', partialDeliveryMatch1);
                            console.log('部分送货匹配结果2:', partialDeliveryMatch2);
                            let deliveredPounds = 0;
                            if (partialDeliveryMatch1) {
                                deliveredPounds = parseFloat(partialDeliveryMatch1[1]);
                            } else if (partialDeliveryMatch2) {
                                deliveredPounds = parseFloat(partialDeliveryMatch2[1]);
                            }
                            console.log('已送货斤数:', deliveredPounds);
                            deliveryBalance += totalPounds - deliveredPounds;
                            console.log('应急药差货:', totalPounds - deliveredPounds);
                        }
                    }
                }
                
                // 奶饲料送货状态
                if (originalPurchaseItems.includes('奶饲料')) {
                    console.log('包含奶饲料，检查送货状态');
                    const milkFeedMatch = originalPurchaseItems.match(/奶饲料[^\d]*([\d.]+)[^\d]*吨/);
                    console.log('奶饲料匹配结果:', milkFeedMatch);
                    if (milkFeedMatch) {
                        const totalTons = parseFloat(milkFeedMatch[1]);
                        console.log('奶饲料总吨数:', totalTons);
                        if (originalPurchaseItems.includes('已送货')) {
                            console.log('奶饲料已送货');
                        } else if (originalPurchaseItems.includes('未送货')) {
                            console.log('奶饲料未送货');
                            deliveryBalance += totalTons;
                        } else if (originalPurchaseItems.includes('部分送货')) {
                            console.log('奶饲料部分送货');
                            const partialDeliveryMatch1 = originalPurchaseItems.match(/部分送货([\d.]+)吨/);
                            const partialDeliveryMatch2 = originalPurchaseItems.match(/部分送货\s*([\d.]+)/);
                            console.log('部分送货匹配结果1:', partialDeliveryMatch1);
                            console.log('部分送货匹配结果2:', partialDeliveryMatch2);
                            let deliveredTons = 0;
                            if (partialDeliveryMatch1) {
                                deliveredTons = parseFloat(partialDeliveryMatch1[1]);
                            } else if (partialDeliveryMatch2) {
                                deliveredTons = parseFloat(partialDeliveryMatch2[1]);
                            }
                            console.log('已送货吨数:', deliveredTons);
                            deliveryBalance += totalTons - deliveredTons;
                            console.log('奶饲料差货:', totalTons - deliveredTons);
                        }
                    }
                }
                
                // 烟花送货状态（烟花按金额计算，不需要差货）
                
                console.log('差货计算完成，总差货:', deliveryBalance);
                
                // 更新应付钱数、差额和差货
                totalAmountElement.textContent = totalAmount.toFixed(2);
                
                // 更新差额显示
                const balanceElement = row.querySelector('.balance-amount');
                if (balanceElement) {
                    balanceElement.textContent = balance.toFixed(2);
                }
                
                // 更新差货显示
                const deliveryBalanceElement = row.querySelector('.delivery-balance');
                if (deliveryBalanceElement) {
                    // 根据项目类型显示单位
                    let unit = '吨';
                    if (originalPurchaseItems.includes('应急药')) {
                        unit = '斤';
                    }
                    deliveryBalanceElement.textContent = deliveryBalance.toFixed(2) + unit;
                }
            }
        });
    }
    
    // 为Flash消息添加自动关闭功能
    function initFlashMessageAutoClose() {
        const flashMessages = document.querySelectorAll('.flash-message .alert');
        flashMessages.forEach(message => {
            setTimeout(() => {
                // 添加淡出动画
                message.style.transition = 'opacity 0.5s ease';
                message.style.opacity = '0';
                // 动画结束后移除元素
                setTimeout(() => {
                    message.remove();
                }, 500);
            }, 3000);
        });
    }
    
    // 修改清空数据库按钮点击事件
    const clearDatabaseBtn = document.querySelector('form[action="/clear_database"] button, form[action*="clear_database"] button');
    if (!clearDatabaseBtn) {
        // 备用方案：根据按钮文本选择
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(btn => {
            if (btn.textContent.trim() === '清空数据库') {
                clearDatabaseBtn = btn;
            }
        });
    }
    if (clearDatabaseBtn) {
        clearDatabaseBtn.onclick = function(e) {
            e.preventDefault();
            showConfirm('是否确认清空数据库？', '确定要清空数据库吗？此操作不可恢复。', function() {
                const form = clearDatabaseBtn.closest('form');
                if (form) {
                    form.submit();
                }
            });
        };
    }
    
    // 修改删除购货人按钮点击事件
    const deleteButtons = document.querySelectorAll('form[action^="/delete_customer/"] button, form[action*="delete_customer"] button');
    deleteButtons.forEach(button => {
        button.onclick = function(e) {
            e.preventDefault();
            showConfirm('是否确认删除？', '确定要删除此购货人信息吗？', function() {
                button.closest('form').submit();
            });
        };
    });
    
    // 备用方案：直接根据按钮文本和类名选择
    const deleteButtonsByText = document.querySelectorAll('button.btn-danger');
    deleteButtonsByText.forEach(button => {
        if (button.textContent.trim() === '删除') {
            button.onclick = function(e) {
                e.preventDefault();
                showConfirm('是否确认删除？', '确定要删除此购货人信息吗？', function() {
                    button.closest('form').submit();
                });
            };
        }
    });
    
    // 添加购货人弹窗功能
    const addCustomerBtn = document.getElementById('addCustomerBtn');
    const addCustomerModal = document.getElementById('addCustomerModal');
    const closeAddCustomer = document.querySelector('.close-add-customer');
    const addCustomerForm = document.getElementById('addCustomerForm');
    
    // 打开添加购货人弹窗
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', function() {
            addCustomerModal.style.display = 'block';
        });
    }
    
    // 关闭添加购货人弹窗
    if (closeAddCustomer) {
        closeAddCustomer.addEventListener('click', function() {
            addCustomerModal.style.display = 'none';
        });
    }
    
    // 点击弹窗外部关闭
    window.addEventListener('click', function(e) {
        if (e.target == addCustomerModal) {
            addCustomerModal.style.display = 'none';
        }
    });
    
    // 控制购买项目的子菜单显示/隐藏
    const purchaseItems = ['麻绳', '豆粕', '应急药', '烟花', '奶饲料'];
    purchaseItems.forEach(item => {
        const checkbox = document.getElementById(item);
        const details = document.getElementById(item + '-details');
        if (checkbox && details) {
            checkbox.addEventListener('change', function() {
                details.style.display = this.checked ? 'block' : 'none';
            });
        }
    });
    
    // 控制付款状态和送货状态的子菜单显示/隐藏
    const toggleElements = document.querySelectorAll('.cursor-pointer');
    toggleElements.forEach(element => {
        element.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target').substring(1);
            const targetElement = document.getElementById(targetId);
            const icon = this.querySelector('.toggle-icon');
            
            if (targetElement) {
                if (targetElement.style.display === 'block') {
                    targetElement.style.display = 'none';
                    if (icon) icon.textContent = '▼';
                } else {
                    targetElement.style.display = 'block';
                    if (icon) icon.textContent = '▲';
                }
            }
        });
    });
    
    // 控制部分付款和部分送货的输入框显示/隐藏
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            // 部分付款
            if (this.id.includes('部分付款')) {
                const itemName = this.id.split('部分付款')[0];
                const amountInput = document.getElementById(itemName + '部分付款金额');
                if (amountInput) {
                    amountInput.style.display = this.checked ? 'block' : 'none';
                }
            }
            // 部分送货
            if (this.id.includes('部分送货')) {
                const itemName = this.id.split('部分送货')[0];
                const quantityInput = document.getElementById(itemName + '部分送货数量');
                if (quantityInput) {
                    quantityInput.style.display = this.checked ? 'block' : 'none';
                }
            }
        });
    });
    
    // 添加购货人表单提交
    if (addCustomerForm) {
        addCustomerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 收集购买项目信息
            const purchaseItems = [];
            const items = ['麻绳', '豆粕', '应急药', '烟花', '奶饲料'];
            items.forEach(item => {
                const checkbox = document.getElementById(item);
                if (checkbox && checkbox.checked) {
                    // 收集项目名称
                    let itemInfo = item;
                    
                    // 收集吨数/斤数/钱数
                    let quantity = '';
                    if (item === '麻绳' || item === '豆粕' || item === '奶饲料') {
                        const quantityInput = document.getElementById(item + '吨数');
                        if (quantityInput && quantityInput.value) {
                            quantity = quantityInput.value + '吨';
                        }
                    } else if (item === '应急药') {
                        const quantityInput = document.getElementById(item + '斤数');
                        if (quantityInput && quantityInput.value) {
                            quantity = quantityInput.value + '斤';
                        }
                    } else if (item === '烟花') {
                        const quantityInput = document.getElementById(item + '钱数');
                        if (quantityInput && quantityInput.value) {
                            quantity = quantityInput.value + '元';
                        }
                    }
                    if (quantity) {
                        itemInfo += ' ' + quantity;
                    }
                    
                    // 收集付款状态
                    const paymentRadios = document.querySelectorAll('input[name="' + item + '付款状态"]');
                    paymentRadios.forEach(radio => {
                        if (radio.checked) {
                            if (radio.id.includes('已付款')) {
                                itemInfo += ' 已付款';
                            } else if (radio.id.includes('未付款')) {
                                itemInfo += ' 未付款';
                            } else if (radio.id.includes('部分付款')) {
                                const amountInput = document.getElementById(item + '部分付款金额输入');
                                if (amountInput && amountInput.value) {
                                    itemInfo += ' 部分付款' + amountInput.value + '元';
                                } else {
                                    // 如果没有输入部分付款金额，默认为0元
                                    itemInfo += ' 部分付款0元';
                                }
                            }
                        }
                    });
                    
                    // 收集送货状态
                    const deliveryRadios = document.querySelectorAll('input[name="' + item + '送货状态"]');
                    deliveryRadios.forEach(radio => {
                        if (radio.checked) {
                            if (radio.id.includes('已送货')) {
                                itemInfo += ' 已送货';
                            } else if (radio.id.includes('未送货')) {
                                itemInfo += ' 未送货';
                            } else if (radio.id.includes('部分送货')) {
                                const quantityInput = document.getElementById(item + '部分送货数量输入');
                                if (quantityInput && quantityInput.value) {
                                    // 根据项目类型添加单位
                                    let unit = '';
                                    if (item === '麻绳' || item === '豆粕' || item === '奶饲料') {
                                        unit = '吨';
                                    } else if (item === '应急药') {
                                        unit = '斤';
                                    } else if (item === '烟花') {
                                        unit = '元';
                                    }
                                    itemInfo += ' 部分送货' + quantityInput.value + unit;
                                } else {
                                    // 如果没有输入部分送货数量，默认为0
                                    let unit = '';
                                    if (item === '麻绳' || item === '豆粕' || item === '奶饲料') {
                                        unit = '吨';
                                    } else if (item === '应急药') {
                                        unit = '斤';
                                    } else if (item === '烟花') {
                                        unit = '元';
                                    }
                                    itemInfo += ' 部分送货0' + unit;
                                }
                            }
                        }
                    });
                    
                    purchaseItems.push(itemInfo);
                }
            });
            
            // 计算balance
            let balance = 0;
            
            // 获取各项目价位
            const hempPrice = parseFloat(localStorage.getItem('麻绳价位')) || 0;
            const soybeanPrice = parseFloat(localStorage.getItem('豆粕价位')) || 0;
            const emergencyDrugPrice = parseFloat(localStorage.getItem('应急药价位')) || 0;
            const milkFeedPrice = parseFloat(localStorage.getItem('奶饲料价位')) || 0;
            
            // 解析购买项目并计算差额
            purchaseItems.forEach(itemInfo => {
                // 麻绳
                if (itemInfo.includes('麻绳')) {
                    if (itemInfo.includes('已付款')) {
                        // 已付款，差额为0
                    } else if (itemInfo.includes('未付款')) {
                        // 未付款，差额为麻绳金额
                        const hempRopeMatch = itemInfo.match(/麻绳[^\d]*([\d.]+)[^\d]*吨/);
                        if (hempRopeMatch) {
                            const tons = parseFloat(hempRopeMatch[1]);
                            balance += tons * hempPrice;
                        }
                    } else if (itemInfo.includes('部分付款')) {
                        // 部分付款，差额为麻绳金额减去已付款金额
                        const hempRopeMatch = itemInfo.match(/麻绳[^\d]*([\d.]+)[^\d]*吨/);
                        if (hempRopeMatch) {
                            const tons = parseFloat(hempRopeMatch[1]);
                            const hempAmount = tons * hempPrice;
                            
                            // 提取部分付款金额
                            let partialPayment = 0;
                            const partialPaymentMatch1 = itemInfo.match(/部分付款(\d+)元/);
                            const partialPaymentMatch2 = itemInfo.match(/部分付款[^\d]*([\d.]+)/);
                            
                            if (partialPaymentMatch1) {
                                partialPayment = parseFloat(partialPaymentMatch1[1]);
                            } else if (partialPaymentMatch2) {
                                partialPayment = parseFloat(partialPaymentMatch2[1]);
                            }
                            
                            balance += hempAmount - partialPayment;
                        }
                    }
                }
                
                // 豆粕
                if (itemInfo.includes('豆粕')) {
                    if (itemInfo.includes('已付款')) {
                        // 已付款，差额为0
                    } else if (itemInfo.includes('未付款')) {
                        // 未付款，差额为豆粕金额
                        const soybeanMatch = itemInfo.match(/豆粕[^\d]*([\d.]+)[^\d]*吨/);
                        if (soybeanMatch) {
                            const tons = parseFloat(soybeanMatch[1]);
                            balance += tons * soybeanPrice;
                        }
                    } else if (itemInfo.includes('部分付款')) {
                        // 部分付款，差额为豆粕金额减去已付款金额
                        const soybeanMatch = itemInfo.match(/豆粕[^\d]*([\d.]+)[^\d]*吨/);
                        if (soybeanMatch) {
                            const tons = parseFloat(soybeanMatch[1]);
                            const soybeanAmount = tons * soybeanPrice;
                            
                            // 提取部分付款金额
                            let partialPayment = 0;
                            const partialPaymentMatch1 = itemInfo.match(/部分付款(\d+)元/);
                            const partialPaymentMatch2 = itemInfo.match(/部分付款[^\d]*([\d.]+)/);
                            
                            if (partialPaymentMatch1) {
                                partialPayment = parseFloat(partialPaymentMatch1[1]);
                            } else if (partialPaymentMatch2) {
                                partialPayment = parseFloat(partialPaymentMatch2[1]);
                            }
                            
                            balance += soybeanAmount - partialPayment;
                        }
                    }
                }
                
                // 应急药
                if (itemInfo.includes('应急药')) {
                    if (itemInfo.includes('已付款')) {
                        // 已付款，差额为0
                    } else if (itemInfo.includes('未付款')) {
                        // 未付款，差额为应急药金额
                        const emergencyDrugMatch = itemInfo.match(/应急药[^\d]*([\d.]+)[^\d]*斤/);
                        if (emergencyDrugMatch) {
                            const pounds = parseFloat(emergencyDrugMatch[1]);
                            balance += pounds * emergencyDrugPrice;
                        }
                    } else if (itemInfo.includes('部分付款')) {
                        // 部分付款，差额为应急药金额减去已付款金额
                        const emergencyDrugMatch = itemInfo.match(/应急药[^\d]*([\d.]+)[^\d]*斤/);
                        if (emergencyDrugMatch) {
                            const pounds = parseFloat(emergencyDrugMatch[1]);
                            const emergencyDrugAmount = pounds * emergencyDrugPrice;
                            
                            // 提取部分付款金额
                            let partialPayment = 0;
                            const partialPaymentMatch1 = itemInfo.match(/部分付款(\d+)元/);
                            const partialPaymentMatch2 = itemInfo.match(/部分付款[^\d]*([\d.]+)/);
                            
                            if (partialPaymentMatch1) {
                                partialPayment = parseFloat(partialPaymentMatch1[1]);
                            } else if (partialPaymentMatch2) {
                                partialPayment = parseFloat(partialPaymentMatch2[1]);
                            }
                            
                            balance += emergencyDrugAmount - partialPayment;
                        }
                    }
                }
                
                // 奶饲料
                if (itemInfo.includes('奶饲料')) {
                    if (itemInfo.includes('已付款')) {
                        // 已付款，差额为0
                    } else if (itemInfo.includes('未付款')) {
                        // 未付款，差额为奶饲料金额
                        const milkFeedMatch = itemInfo.match(/奶饲料[^\d]*([\d.]+)[^\d]*吨/);
                        if (milkFeedMatch) {
                            const tons = parseFloat(milkFeedMatch[1]);
                            balance += tons * milkFeedPrice;
                        }
                    } else if (itemInfo.includes('部分付款')) {
                        // 部分付款，差额为奶饲料金额减去已付款金额
                        const milkFeedMatch = itemInfo.match(/奶饲料[^\d]*([\d.]+)[^\d]*吨/);
                        if (milkFeedMatch) {
                            const tons = parseFloat(milkFeedMatch[1]);
                            const milkFeedAmount = tons * milkFeedPrice;
                            
                            // 提取部分付款金额
                            let partialPayment = 0;
                            const partialPaymentMatch1 = itemInfo.match(/部分付款(\d+)元/);
                            const partialPaymentMatch2 = itemInfo.match(/部分付款[^\d]*([\d.]+)/);
                            
                            if (partialPaymentMatch1) {
                                partialPayment = parseFloat(partialPaymentMatch1[1]);
                            } else if (partialPaymentMatch2) {
                                partialPayment = parseFloat(partialPaymentMatch2[1]);
                            }
                            
                            balance += milkFeedAmount - partialPayment;
                        }
                    }
                }
                
                // 烟花
                if (itemInfo.includes('烟花')) {
                    if (itemInfo.includes('已付款')) {
                        // 已付款，差额为0
                    } else if (itemInfo.includes('未付款')) {
                        // 未付款，差额为烟花金额
                        const fireworksMatch = itemInfo.match(/烟花[^\d]*([\d.]+)[^\d]*元/);
                        if (fireworksMatch) {
                            const amount = parseFloat(fireworksMatch[1]);
                            balance += amount;
                        }
                    } else if (itemInfo.includes('部分付款')) {
                        // 部分付款，差额为烟花金额减去已付款金额
                        const fireworksMatch = itemInfo.match(/烟花[^\d]*([\d.]+)[^\d]*元/);
                        if (fireworksMatch) {
                            const fireworksAmount = parseFloat(fireworksMatch[1]);
                            
                            // 提取部分付款金额
                            let partialPayment = 0;
                            const partialPaymentMatch1 = itemInfo.match(/部分付款(\d+)元/);
                            const partialPaymentMatch2 = itemInfo.match(/部分付款[^\d]*([\d.]+)/);
                            
                            if (partialPaymentMatch1) {
                                partialPayment = parseFloat(partialPaymentMatch1[1]);
                            } else if (partialPaymentMatch2) {
                                partialPayment = parseFloat(partialPaymentMatch2[1]);
                            }
                            
                            balance += fireworksAmount - partialPayment;
                        }
                    }
                }
            });
            
            // 更新隐藏字段
            document.getElementById('purchaseItems').value = purchaseItems.length > 0 ? purchaseItems.join(', ') : '无';
            document.getElementById('balance').value = Math.round(balance);
            
            // 直接提交表单，移除确认弹窗
            addCustomerForm.submit();
        });
    }
    
    // 时间显示功能
    function initTimeDisplay() {
        const timeElement = document.getElementById('current-time');
        
        if (timeElement) {
            function updateTime() {
                const now = new Date();
                const hours = now.getHours().toString().padStart(2, '0');
                const minutes = now.getMinutes().toString().padStart(2, '0');
                const seconds = now.getSeconds().toString().padStart(2, '0');
                timeElement.textContent = `${hours}:${minutes}:${seconds}`;
            }
            
            // 初始更新
            updateTime();
            
            // 每秒更新
            setInterval(updateTime, 1000);
        }
    }
    
    // 初始化
    initTimeDisplay();
    initPriceSetting();
    initDatabaseOperations();
    initEditCustomer();
    calculateTotalAmounts();
    initFlashMessageAutoClose();
});