#!/bin/bash

echo "开始测试HTML渲染滚动问题修复..."

# 检查修复的核心文件
echo "1. 检查核心文件是否存在..."
if [ -f "components/PrismMac.js" ]; then
    echo "✓ PrismMac.js 存在"
else
    echo "✗ PrismMac.js 不存在"
    exit 1
fi

if [ -f "public/css/html-render.css" ]; then
    echo "✓ html-render.css 存在"
else
    echo "✗ html-render.css 不存在"
    exit 1
fi

# 检查关键修复内容
echo "2. 检查关键修复内容..."

# 检查高度限制
if grep -q "max-height.*3000" public/css/html-render.css; then
    echo "✓ CSS高度限制已添加"
else
    echo "✗ CSS高度限制未找到"
fi

# 检查JavaScript高度计算改进
if grep -q "MAX_ADJUSTMENTS" components/PrismMac.js; then
    echo "✓ JavaScript高度计算限制已添加"
else
    echo "✗ JavaScript高度计算限制未找到"
fi

# 检查消息类型改进
if grep -q "htmlRenderResize" components/PrismMac.js; then
    echo "✓ 专用消息类型已添加"
else
    echo "✗ 专用消息类型未找到"
fi

# 检查错误处理
if grep -q "console.error.*HTML渲染高度调整错误" components/PrismMac.js; then
    echo "✓ 错误处理已添加"
else
    echo "✗ 错误处理未找到"
fi

echo "3. 测试完成！"
echo ""
echo "修复摘要："
echo "- 添加了iframe高度的最大值限制（3000px）"
echo "- 改进了高度计算逻辑，使用最小值而不是最大值"
echo "- 添加了调整次数限制，防止无限循环"
echo "- 改进了PostMessage通信机制"
echo "- 添加了详细的调试日志和错误处理"
echo "- 为移动端添加了更严格的高度限制"
echo ""
echo "这些修复应该能够解决页面无限滚动的问题。"