function fillSample(key) {
    document.getElementById('inputText').value = booksData[key].text;
}

const styleCards = document.querySelectorAll('.style-card');
styleCards.forEach(card => {
    card.addEventListener('click', () => {
        styleCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
});

function scrollToDemo() {
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
}

async function generateStory() {
    const inputText = document.getElementById('inputText').value.trim();
    if (!inputText) {
        alert('请输入古籍文字或选择示例');
        return;
    }

    const resultSection = document.getElementById('resultSection');
    const loading = document.getElementById('loading');
    const storyResult = document.getElementById('storyResult');
    const loadingSteps = document.getElementById('loadingSteps');

    resultSection.classList.add('show');
    loading.style.display = 'block';
    storyResult.style.display = 'none';

    let stepIndex = 0;
    const steps = [
        '正在分析古籍语义...',
        '正在提取故事情节...',
        '正在构建人物形象...',
        '正在生成叙事脚本...',
        '即将完成...'
    ];

    const stepInterval = setInterval(() => {
        stepIndex++;
        if (stepIndex < steps.length) {
            loadingSteps.innerText = steps[stepIndex];
        }
    }, 800);

    const activeStyle = document.querySelector('.style-card.active').dataset.style;
    
    const aiResult = await callAI(inputText, activeStyle);
    
    clearInterval(stepInterval);
    loading.style.display = 'none';
    storyResult.style.display = 'block';

    if (aiResult) {
        document.getElementById('storyTitle').innerText = `AI生成故事 · ${activeStyle}`;
        document.getElementById('storyContent').innerText = aiResult;
        
        const imageUrl = await generateImage(inputText.substring(0, 50), activeStyle);
        if (imageUrl) {
            const imageContainer = document.getElementById('storyImage');
            imageContainer.innerHTML = `<img src="${imageUrl}" alt="AI生成插图" style="max-width: 100%; border-radius: 10px; margin-top: 20px;">`;
        }
    } else {
        let key = '山海经';
        for (const k of Object.keys(booksData)) {
            if (inputText.includes(booksData[k].text.substring(0, 10))) {
                key = k;
                break;
            }
        }
        const result = storyResults[key] || storyResults['山海经'];
        document.getElementById('storyTitle').innerText = result.title;
        document.getElementById('storyContent').innerText = result.content;
    }

    document.getElementById('storyStyle').innerText = activeStyle;
    document.getElementById('storyChoices').style.display = 'block';
}

function makeChoice(choice) {
    const choices = {
        'approach': '你小心翼翼地走入山林，九尾狐似乎察觉到了你的到来...',
        'avoid': '你转身离开，继续你的旅程，但青丘山的传说永远留在了你的心中...',
        'hunt': '你决定冒险一试，准备好武器，向山中走去...'
    };

    const storyContent = document.getElementById('storyContent');
    storyContent.innerText += '\n\n' + choices[choice];

    document.getElementById('storyChoices').style.display = 'none';
}

function continueStory() {
    const storyContent = document.getElementById('storyContent');
    storyContent.innerText += '\n\n故事继续发展中...AI正在根据你的选择生成后续剧情...';
}

function generateStoryboard() {
    alert('动画分镜已生成！\n\n分镜1：全景展示青丘山\n分镜2：九尾狐特写\n分镜3：主角视角\n分镜4：互动场景\n\n后续可导出为视频格式');
}

function shareStory() {
    alert('分享功能已触发！\n\n正在生成分享卡片...\n\n可分享至微信、微博、抖音等平台');
}

function initBackground() {
    const starsContainer = document.getElementById('stars');
    const cloudsContainer = document.getElementById('clouds');

    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }

    for (let i = 0; i < 8; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.width = (200 + Math.random() * 300) + 'px';
        cloud.style.height = (100 + Math.random() * 150) + 'px';
        cloud.style.top = (Math.random() * 60) + '%';
        cloud.style.left = (Math.random() * 100) + '%';
        cloud.style.animationDelay = (Math.random() * 60) + 's';
        cloud.style.animationDuration = (40 + Math.random() * 40) + 's';
        cloudsContainer.appendChild(cloud);
    }
}

initBackground();

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.querySelector('.scroll-progress').style.height = scrollPercent + '%';
});