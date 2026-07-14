const AI_CONFIG = {
    apiKey: '',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    imageApiUrl: 'https://api.trae.cn/v1/text_to_image'
};

function saveAIConfig() {
    const apiKey = document.getElementById('apiKey').value;
    
    AI_CONFIG.apiKey = apiKey;
    
    localStorage.setItem('aiConfig', JSON.stringify(AI_CONFIG));
    alert('AI配置已保存！');
    
    document.getElementById('aiConfigModal').style.display = 'none';
}

function loadAIConfig() {
    const saved = localStorage.getItem('aiConfig');
    if (saved) {
        const config = JSON.parse(saved);
        AI_CONFIG.apiKey = config.apiKey || '';
        
        if (document.getElementById('apiKey')) {
            document.getElementById('apiKey').value = AI_CONFIG.apiKey;
        }
    }
}

async function callAI(text, style) {
    if (!AI_CONFIG.apiKey) {
        alert('请先配置AI API密钥！点击右上角的🔧图标进行配置。');
        return null;
    }
    
    const prompt = `请将以下古籍文字改编成一个精彩的故事，使用${style}风格呈现：\n\n${text}\n\n要求：\n1. 故事要有引人入胜的情节\n2. 角色形象要鲜明\n3. 语言要生动有趣\n4. 适合现代读者理解\n5. 字数在300-500字之间\n6. 要有互动选项，让读者可以选择剧情走向`;
    
    try {
        const response = await fetch(AI_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 800,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error?.message || 'API调用失败');
        }
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
    } catch (error) {
        console.error('AI调用失败:', error);
        alert('AI调用失败：' + error.message);
        return null;
    }
}

async function generateImage(prompt, style) {
    const stylePrompts = {
        '古风写实': 'ancient Chinese painting style, realistic, detailed, traditional',
        '国潮漫画': 'Chinese trendy comic style, vibrant colors, modern aesthetic',
        '皮影戏': 'shadow puppet style, silhouette, traditional Chinese art',
        '水墨动画': 'ink wash painting style, minimalist, black and white'
    };
    
    const imagePrompt = `${stylePrompts[style] || 'Chinese traditional art'}, ${prompt}, ancient Chinese mythology, detailed, high quality`;
    
    try {
        const response = await fetch('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: imagePrompt,
                image_size: 'square'
            })
        });
        
        if (!response.ok) {
            throw new Error('图片生成失败');
        }
        
        const data = await response.json();
        return data.url || null;
    } catch (error) {
        console.error('图片生成失败:', error);
        return null;
    }
}

function showAIConfig() {
    loadAIConfig();
    document.getElementById('aiConfigModal').style.display = 'block';
}

function hideAIConfig() {
    document.getElementById('aiConfigModal').style.display = 'none';
}

AI_CONFIG.apiKey = 'sk-445e395af48d478faecf66ee577ac64e';
localStorage.setItem('aiConfig', JSON.stringify(AI_CONFIG));

loadAIConfig();