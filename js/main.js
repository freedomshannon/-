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
    const startDate = new Date('2023-01-01'); // 替换为你们在一起的日期
    const today = new Date();
    const daysTogether = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    document.getElementById('days-together').textContent = daysTogether;
    
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
    
    // 设置相册筛选功能
    setupGalleryFilter();
});

// 相册数据
const galleryData = [
    {
        image: 'images/gallery/date1.jpg',
        title: '第一次约会',
        description: '在咖啡厅度过的美好时光',
        category: 'dates'
    },
    {
        image: 'images/gallery/travel1.jpg',
        title: '海边旅行',
        description: '阳光、沙滩、海浪',
        category: 'travel'
    },
    {
        image: 'images/gallery/daily1.jpg',
        title: '一起做饭',
        description: '第一次一起下厨',
        category: 'daily'
    },
    {
        image: 'images/gallery/special1.jpg',
        title: '生日惊喜',
        description: '为你准备的生日派对',
        category: 'special'
    },
    {
        image: 'images/gallery/date2.jpg',
        title: '电影之夜',
        description: '一起看了最喜欢的电影',
        category: 'dates'
    },
    {
        image: 'images/gallery/travel2.jpg',
        title: '山间徒步',
        description: '登高望远，看世界',
        category: 'travel'
    },
    {
        image: 'images/gallery/daily2.jpg',
        title: '周末早晨',
        description: '慵懒的周末早晨',
        category: 'daily'
    },
    {
        image: 'images/gallery/special2.jpg',
        title: '情人节礼物',
        description: '收到的特别礼物',
        category: 'special'
    },
    {
        image: 'images/gallery/date3.jpg',
        title: '公园野餐',
        description: '阳光明媚的野餐日',
        category: 'dates'
    },
    {
        image: 'images/gallery/travel3.jpg',
        title: '城市探索',
        description: '探索新城市的角落',
        category: 'travel'
    },
    {
        image: 'images/gallery/daily3.jpg',
        title: '一起看书',
        description: '安静的阅读时光',
        category: 'daily'
    },
    {
        image: 'images/gallery/special3.jpg',
        title: '纪念日庆祝',
        description: '特别的纪念日晚餐',
        category: 'special'
    }
];

// 纪念日数据
const anniversaryData = [
    {
        date: '2023-01-01',
        title: '相识纪念日',
        description: '我们第一次相遇'
    },
    {
        date: '2023-03-08',
        title: '恋爱纪念日',
        description: '我们正式确定关系'
    },
    {
        date: '1995-05-15',
        title: '饭团生日',
        description: '饭团的生日'
    },
    {
        date: '1996-08-20',
        title: 'Shannon生日',
        description: 'Shannon的生日'
    },
    {
        date: '2023-05-20',
        title: '第一次旅行',
        description: '我们的第一次旅行'
    },
    {
        date: '2023-12-25',
        title: '第一个圣诞节',
        description: '一起度过的第一个圣诞节'
    }
];

// 加载相册数据
function loadGalleryData() {
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.innerHTML = '';
    
    galleryData.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `col-md-4 col-sm-6 gallery-item ${item.category}`;
        galleryItem.setAttribute('data-aos', 'fade-up');
        galleryItem.setAttribute('data-aos-delay', (index % 3) * 100);
        
        galleryItem.innerHTML = `
            <div class="gallery-item-inner">
                <img src="${item.image}" alt="${item.title}" class="img-fluid">
                <div class="gallery-caption">
                    <h5>${item.title}</h5>
                    <p>${item.description}</p>
                </div>
            </div>
        `;
        
        galleryContainer.appendChild(galleryItem);
    });
}

// 设置相册筛选功能
function setupGalleryFilter() {
    const filterButtons = document.querySelectorAll('.gallery-filter button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选相册项目
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
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
function loadMessages() {
    const messagesContainer = document.querySelector('.messages-container');
    messagesContainer.innerHTML = '';
    
    // 从本地存储获取留言
    const messages = JSON.parse(localStorage.getItem('loveMessages')) || [];
    
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
        
        messageItem.innerHTML = `
            <div class="message-header">
                <span class="message-name">${message.name}</span>
                <span class="message-date">${message.date}</span>
            </div>
            <div class="message-content">
                <p>${message.message}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageItem);
    });
}

// 提交留言
function submitMessage() {
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    
    if (!name || !message) {
        alert('请填写昵称和留言内容！');
        return;
    }
    
    // 创建新留言
    const newMessage = {
        name,
        message,
        date: formatDate(new Date())
    };
    
    // 从本地存储获取现有留言
    const messages = JSON.parse(localStorage.getItem('loveMessages')) || [];
    
    // 添加新留言
    messages.unshift(newMessage);
    
    // 保存到本地存储
    localStorage.setItem('loveMessages', JSON.stringify(messages));
    
    // 重新加载留言
    loadMessages();
    
    // 清空表单
    nameInput.value = '';
    messageInput.value = '';
    
    alert('留言成功！');
} 