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
    const startDate = new Date('2024-04-12'); // 修改为你们在一起的日期
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
});

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
        date: '2024-04-12',
        title: '恋爱纪念日',
        description: '我们在一起啦'
    },
    {
        date: '2003-07-14',
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

// 加载相册数据 - 优化版本
function loadGalleryData() {
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.innerHTML = '';
    
    // 计算分页
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, galleryData.length);
    
    // 更新当前页码显示
    document.getElementById('current-page').textContent = currentPage;
    
    // 创建文档片段，提高性能
    const fragment = document.createDocumentFragment();
    
    // 显示当前页的照片
    for (let i = startIndex; i < endIndex; i++) {
        const item = galleryData[i];
        const galleryItem = document.createElement('div');
        galleryItem.className = 'col-md-3 col-sm-6 gallery-item'; // 改为每行4张
        
        // 简化的照片显示，只显示照片
        galleryItem.innerHTML = `
            <div class="gallery-item-inner">
                <img src="${item.image}" alt="照片" class="img-fluid" loading="lazy">
            </div>
        `;
        
        fragment.appendChild(galleryItem);
    }
    
    // 一次性添加所有元素，减少DOM操作
    galleryContainer.appendChild(fragment);
    
    // 更新分页按钮状态
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = endIndex >= galleryData.length;
}

// 设置分页功能
function setupGalleryFilter() {
    // 添加分页按钮事件监听
    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadGalleryData();
            window.scrollTo({top: document.getElementById('gallery').offsetTop, behavior: 'smooth'});
        }
    });
    
    document.getElementById('next-page').addEventListener('click', function() {
        const totalPages = Math.ceil(galleryData.length / itemsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            loadGalleryData();
            window.scrollTo({top: document.getElementById('gallery').offsetTop, behavior: 'smooth'});
        }
    });
    
    // 添加页面跳转功能
    document.getElementById('goto-page').addEventListener('submit', function(e) {
        e.preventDefault();
        const pageInput = document.getElementById('page-number');
        const pageNumber = parseInt(pageInput.value);
        const totalPages = Math.ceil(galleryData.length / itemsPerPage);
        
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            currentPage = pageNumber;
            loadGalleryData();
            window.scrollTo({top: document.getElementById('gallery').offsetTop, behavior: 'smooth'});
        } else {
            alert(`请输入1到${totalPages}之间的页码`);
        }
    });
    
    // 更新总页数显示
    const totalPages = Math.ceil(galleryData.length / itemsPerPage);
    document.getElementById('total-pages').textContent = totalPages;
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