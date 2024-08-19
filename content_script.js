// 定义一个函数来处理文本中的汉字、字母/数字和符号之间的空格
function formatSpace(text) {
    return text
        .replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '\$1 \$2')
        .replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '\$1 \$2')

        // 在斜杠（/）的左右两边都加上空格（若左右有字母或数字）
        .replace(/([a-zA-Z0-9])\/([a-zA-Z0-9])/g, '\$1 / \$2')
        
        // 在指定符号与汉字之间加上空格
        .replace(/([a-zA-Z0-9])(["'`.,\[\]\(\)])([\u4e00-\u9fa5])/g, '\&1\$2 \$3')
        .replace(/([\u4e00-\u9fa5])(["'`.,\[\]\(\)])([a-zA-Z0-9])/g, '\$1 \$2\$3')

        .replace(/([\u4e00-\u9fa5])(<\/?[\w\s="'-]+>)([a-zA-Z0-9])/g, '\$1 \$2\$3')
        .replace(/([a-zA-Z0-9])(<\/?[\w\s="'-]+>)([\u4e00-\u9fa5])/g, '\$1\$2 \$3');

}

function processTextNode(node) {
    const originalText = node.textContent;
    if (originalText.trim()) {
        const processedText = formatSpace(originalText);
        if(node.textContent != processedText)
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
function processParagraphs() {
    // Select all <p> elements
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(paragraph => {
        // Extract the text content including HTML tags
        let text = paragraph.innerHTML;

        // Process the text
        let formattedText = formatSpace(text);

        // Update the <p> element with the processed text
        if(paragraph.innerHTML != formattedText)
            paragraph.innerHTML = formattedText;
    });
}

// 处理用户交互事件
function handleUserInteraction() {
    processVisibleTextNodes();
    processParagraphs();
}

// 监听用户交互事件
document.addEventListener('click', handleUserInteraction);
document.addEventListener('scroll', handleUserInteraction);
document.addEventListener('keydown', handleUserInteraction);

// 如果需要在页面加载时也处理一次，可以调用下面的函数
document.addEventListener('DOMContentLoaded', () => {
    handleUserInteraction();
});
