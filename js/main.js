document.addEventListener('DOMContentLoaded', function() {
    // 初始化动画库
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });
    
    // 设置当前年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // 计算在一起的天数
    const startDate = new Date('2024-04-10'); // 修改为你们在一起的日期
    const today = new Date();
    const daysTogether = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    // 更新显示文本
    if (daysTogether >= 0) {
        document.getElementById('days-together').textContent = daysTogether;
        document.getElementById('days-label').textContent = '天';
    } else {
        document.getElementById('days-together').textContent = Math.abs(daysTogether);
        document.getElementById('days-label').textContent = '距离在一起还有天数';
    }
    
    // 初始化主题模式
    initThemeMode();
    
    // 设置随机背景
    setRandomBackground();
    
    // 加载相册数据
    loadGalleryData();
    
    // 加载纪念日数据
    loadAnniversaryData();
    
    // 加载留言板数据
    loadMessages();
    
    // 设置留言表单提交事件
    document.getElementById('message-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitMessage();
    });
    
    // 设置相册筛选和分页功能
    setupGalleryFilter();
    
    // 设置主题切换按钮
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

// 初始化主题模式
function initThemeMode() {
    // 检查本地存储中是否有保存的主题偏好
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // 如果有保存的偏好，使用它
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    } else {
        // 否则，根据当前时间自动设置
        const currentHour = new Date().getHours();
        // 晚上8点到早上6点使用黑夜模式
        const isDarkTime = currentHour >= 20 || currentHour < 6;
        document.body.classList.toggle('dark-mode', isDarkTime);
        
        // 保存到本地存储
        localStorage.setItem('theme', isDarkTime ? 'dark' : 'light');
    }
}

// 切换主题
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// 自动生成大量照片数据
function generatePhotoData(count) {
    const data = [];
    for (let i = 1; i <= count; i++) {
        data.push({
            image: `images/gallery/photo${i}.jpeg`
        });
    }
    return data;
}

// 生成236张照片的数据
const galleryData = generatePhotoData(236);

// 纪念日数据
const anniversaryData = [
    {
        date: '2024-04-10',
        title: '恋爱纪念日',
        description: '我们在一起啦'
    },
    {
        date: '2003-07-04',
        title: '饭团生日',
        description: '饭团的生日'
    },
    {
        date: '2001-11-15',
        title: 'Shannon生日',
        description: 'Shannon的生日'
    },
    {
        date: '2025-06-10',
        title: '尼泊尔徒步！',
        description: '减肥健身'
    },
];

// 全局变量
let currentPage = 1;
const itemsPerPage = 12; // 每页显示24张照片

// 修改加载相册数据函数，实现随机展示
function loadGalleryData() {
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.innerHTML = '';
    
    // 创建文档片段，提高性能
    const fragment = document.createDocumentFragment();
    
    // 随机选择12张照片
    const randomPhotos = getRandomPhotos(galleryData, itemsPerPage);
    
    // 显示随机选择的照片
    randomPhotos.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'col-md-3 col-sm-6 gallery-item'; // 每行4张
        
        // 简化的照片显示，只显示照片
        galleryItem.innerHTML = `
            <div class="gallery-item-inner">
                <img src="${item.image}" alt="照片" class="img-fluid" loading="lazy">
            </div>
        `;
        
        fragment.appendChild(galleryItem);
    });
    
    // 一次性添加所有元素，减少DOM操作
    galleryContainer.appendChild(fragment);
}

// 获取随机照片的函数
function getRandomPhotos(photoArray, count) {
    // 创建原数组的副本
    const shuffled = [...photoArray];
    
    // 随机打乱数组
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // 返回前count个元素
    return shuffled.slice(0, count);
}

// 修改设置相册功能，移除分页相关代码
function setupGalleryFilter() {
    // 添加刷新按钮事件监听
    document.getElementById('refresh-gallery').addEventListener('click', function() {
        loadGalleryData();
        window.scrollTo({top: document.getElementById('gallery').offsetTop, behavior: 'smooth'});
    });
}

// 加载纪念日数据
function loadAnniversaryData() {
    const nextAnniversaryContainer = document.getElementById('next-anniversary');
    const allAnniversariesContainer = document.getElementById('all-anniversaries');
    
    // 清空容器
    nextAnniversaryContainer.innerHTML = '';
    allAnniversariesContainer.innerHTML = '';
    
    // 获取今天的日期
    const today = new Date();
    
    // 计算每个纪念日的下一个日期
    const upcomingAnniversaries = anniversaryData.map(item => {
        const originalDate = new Date(item.date);
        const nextDate = new Date(today.getFullYear(), originalDate.getMonth(), originalDate.getDate());
        
        // 如果今年的日期已经过了，计算明年的日期
        if (nextDate < today) {
            nextDate.setFullYear(today.getFullYear() + 1);
        }
        
        const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        
        return {
            ...item,
            nextDate,
            daysUntil
        };
    });
    
    // 按照距离今天的天数排序
    upcomingAnniversaries.sort((a, b) => a.daysUntil - b.daysUntil);
    
    // 显示最近的纪念日
    const nextAnniversary = upcomingAnniversaries[0];
    nextAnniversaryContainer.innerHTML = `
        <div class="next-anniversary-item">
            <h4>${nextAnniversary.title}</h4>
            <p>${nextAnniversary.description}</p>
            <p class="anniversary-date">${formatDate(nextAnniversary.nextDate)}</p>
            <p class="countdown">还有 <strong>${nextAnniversary.daysUntil}</strong> 天</p>
        </div>
    `;
    
    // 显示所有纪念日
    upcomingAnniversaries.forEach(item => {
        const anniversaryItem = document.createElement('div');
        anniversaryItem.className = 'anniversary-item';
        
        anniversaryItem.innerHTML = `
            <h5>${item.title}</h5>
            <p>${item.description}</p>
            <p class="anniversary-date">${formatDate(item.nextDate)}</p>
            <p class="countdown">还有 ${item.daysUntil} 天</p>
        `;
        
        allAnniversariesContainer.appendChild(anniversaryItem);
    });
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

// 加载留言板数据
async function loadMessages() {
    const messagesContainer = document.querySelector('.messages-container');
    messagesContainer.innerHTML = '<p class="text-center">加载中...</p>';
    
    try {
        // 从 Cloudflare Worker API 获取留言
        const response = await fetch('https://love-message-board.guba396.workers.dev/api/messages');
        
        if (!response.ok) {
            throw new Error('获取留言失败');
        }
        
        const messages = await response.json();
        
        messagesContainer.innerHTML = '';
        
        if (messages.length === 0) {
            messagesContainer.innerHTML = '<p class="text-center">还没有留言，成为第一个留言的人吧！</p>';
            return;
        }
        
        // 显示留言
        messages.forEach((message, index) => {
            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            messageItem.setAttribute('data-aos', 'fade-up');
            messageItem.setAttribute('data-aos-delay', index * 100);
            
            // 格式化日期
            const messageDate = formatDisplayDate(message.date);
            
            messageItem.innerHTML = `
                <div class="message-header">
                    <span class="message-name">${message.name}</span>
                    <span class="message-date">${messageDate}</span>
                </div>
                <div class="message-content">
                    <p>${message.message}</p>
                </div>
            `;
            
            messagesContainer.appendChild(messageItem);
        });
    } catch (error) {
        console.error('加载留言失败:', error);
        messagesContainer.innerHTML = '<p class="text-center text-danger">加载留言失败，请稍后再试</p>';
    }
}

// 格式化显示日期
function formatDisplayDate(isoDate) {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

// 提交留言
async function submitMessage() {
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    
    if (!name || !message) {
        alert('请填写昵称和留言内容！');
        return;
    }
    
    // 禁用提交按钮，防止重复提交
    const submitButton = document.querySelector('#message-form button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '提交中...';
    
    try {
        // 发送留言到 Cloudflare Worker API
        const response = await fetch('https://love-message-board.guba396.workers.dev/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                message
            })
        });
        
        if (!response.ok) {
            throw new Error('提交留言失败');
        }
        
        // 清空表单
        nameInput.value = '';
        messageInput.value = '';
        
        // 重新加载留言
        await loadMessages();
        
        alert('留言成功！');
    } catch (error) {
        console.error('提交留言失败:', error);
        alert('提交留言失败，请稍后再试');
    } finally {
        // 恢复提交按钮
        submitButton.disabled = false;
        submitButton.innerHTML = '发送祝福';
    }
}

// 设置随机背景
function setRandomBackground() {
    // 从照片数据中随机选择一张
    const randomIndex = Math.floor(Math.random() * galleryData.length);
    const randomImage = galleryData[randomIndex].image;
    
    // 创建背景元素
    const backgroundElement = document.createElement('div');
    backgroundElement.className = 'background-blur';
    backgroundElement.style.backgroundImage = `url(${randomImage})`;
    
    // 添加到body的最前面
    document.body.insertBefore(backgroundElement, document.body.firstChild);
} 