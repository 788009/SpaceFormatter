// 定义一个函数来处理文本中的汉字、字母/数字和符号之间的空格
function FormatSpace(text) {
    return text
        .replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '\$1 \$2')
        .replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '\$1 \$2')

        // 在斜杠（/）的左右两边都加上空格（若左右有字母或数字）
        .replace(/([a-zA-Z0-9])\/([a-zA-Z0-9])/g, '\$1 / \$2')
        
        // 在指定符号与汉字之间加上空格
        .replace(/([a-zA-Z0-9])(["'`.,\[\]\(\)])([\u4e00-\u9fa5])/g, '\$2 \$2')
        .replace(/([\u4e00-\u9fa5])(["'`.,\[\]\(\)])([a-zA-Z0-9])/g, '\$1 \$2');
}

// 处理文本节点中的内容
function processTextNode(node) {
    const originalText = node.textContent;
    if (originalText.trim()) {
        const processedText = FormatSpace(originalText);
        node.textContent = processedText;
    }
}

// 遍历并处理页面中所有可见的文本节点
function processVisibleTextNodes() {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function (node) {
                // 只处理可见的文本节点
                return window.getComputedStyle(node.parentNode).display !== 'none' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        }
    );

    let node;
    while (node = walker.nextNode()) {
        processTextNode(node);
    }
}

// 处理用户交互事件
function handleUserInteraction() {
    processVisibleTextNodes();
}

// 监听用户交互事件
document.addEventListener('click', handleUserInteraction);
document.addEventListener('scroll', handleUserInteraction);
document.addEventListener('keydown', handleUserInteraction);

// 如果需要在页面加载时也处理一次，可以调用下面的函数
document.addEventListener('DOMContentLoaded', () => {
    processVisibleTextNodes();
});
