document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('uploadBtn');
    const imageInput = document.getElementById('imageInput');
    const previewImage = document.getElementById('previewImage');
    const colorDisplay = document.querySelector('.color-display');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const copyButtons = document.querySelectorAll('.copy-btn');

    // 点击上传按钮触发文件选择
    uploadBtn.addEventListener('click', () => {
        imageInput.click();
    });

    // 处理文件选择
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // 创建画布用于获取颜色
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 处理图片点击事件
    previewImage.addEventListener('click', (e) => {
        if (!previewImage.src) return;

        // 获取图片容器的尺寸和位置
        const container = previewImage.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        // 计算图片在容器中的实际显示尺寸
        const imageRatio = previewImage.naturalWidth / previewImage.naturalHeight;
        let imageWidth, imageHeight;
        
        if (containerRect.width / containerRect.height > imageRatio) {
            // 图片高度填满容器
            imageHeight = containerRect.height;
            imageWidth = imageHeight * imageRatio;
        } else {
            // 图片宽度填满容器
            imageWidth = containerRect.width;
            imageHeight = imageWidth / imageRatio;
        }
        
        // 计算图片在容器中的位置（居中）
        const imageX = (containerRect.width - imageWidth) / 2;
        const imageY = (containerRect.height - imageHeight) / 2;
        
        // 计算点击位置相对于图片的坐标
        const clickX = e.clientX - containerRect.left - imageX;
        const clickY = e.clientY - containerRect.top - imageY;
        
        // 如果点击在图片外部，则返回
        if (clickX < 0 || clickX > imageWidth || clickY < 0 || clickY > imageHeight) {
            return;
        }
        
        // 将点击坐标转换为图片原始尺寸的坐标
        const originalX = (clickX / imageWidth) * previewImage.naturalWidth;
        const originalY = (clickY / imageHeight) * previewImage.naturalHeight;

        // 设置画布大小与图片相同
        canvas.width = previewImage.naturalWidth;
        canvas.height = previewImage.naturalHeight;

        // 在画布上绘制图片
        ctx.drawImage(previewImage, 0, 0);

        // 获取点击位置的颜色
        const pixel = ctx.getImageData(Math.floor(originalX), Math.floor(originalY), 1, 1).data;
        const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        const hexColor = rgbToHex(pixel[0], pixel[1], pixel[2]);

        // 更新颜色显示
        colorDisplay.style.backgroundColor = color;
        hexValue.textContent = hexColor;
        rgbValue.textContent = color;
    });

    // 复制按钮点击事件
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const valueType = button.dataset.value;
            const valueToCopy = valueType === 'hex' ? hexValue.textContent : rgbValue.textContent;
            
            // 复制到剪贴板
            navigator.clipboard.writeText(valueToCopy).then(() => {
                // 显示复制成功状态
                button.classList.add('copied');
                button.textContent = '已复制';
                
                // 2秒后恢复按钮状态
                setTimeout(() => {
                    button.classList.remove('copied');
                    button.textContent = '复制';
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
            });
        });
    });
});

// RGB转十六进制
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
} 