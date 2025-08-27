# HTML 代码渲染功能使用说明

NotionNext 现在支持在代码块中渲染 HTML 代码，让您可以直接在博客中预览 HTML 效果。

## 功能特性

1. **安全渲染**: 使用 iframe 沙盒模式，防止恶意代码影响主页面
2. **智能开关**: 通过代码注释控制是否渲染 HTML
3. **响应式设计**: 自动适配不同屏幕尺寸
4. **深色模式支持**: 完美适配深色/浅色主题
5. **样式隔离**: HTML 渲染不会影响外部页面样式

## 配置选项

在 `conf/code.config.js` 中可以配置以下选项：

```javascript
// HTML 代码渲染功能
HTML_RENDER_ENABLE: true,     // 是否启用HTML代码渲染功能
HTML_RENDER_SANDBOX: true,   // HTML渲染是否使用沙盒模式（推荐开启以保证安全性）
```

## 使用方法

### 1. 启用渲染

在 HTML 代码块的最前面添加 `<!-- render:true -->` 注释：

\`\`\`html
<!-- render:true -->
<div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); padding: 20px; border-radius: 10px; color: white; text-align: center;">
  <h2>🎉 欢迎使用 HTML 渲染功能</h2>
  <p>这是一个渐变背景的示例卡片</p>
  <button onclick="alert('Hello NotionNext!')" style="background: white; color: #333; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
    点击我
  </button>
</div>
\`\`\`

### 2. 禁用渲染

在 HTML 代码块的最前面添加 `<!-- render:false -->` 注释，或者不添加任何注释：

\`\`\`html
<!-- render:false -->
<div>这段 HTML 不会被渲染，只会显示代码</div>
\`\`\`

### 3. 复杂示例

\`\`\`html
<!-- render:true -->
<!DOCTYPE html>
<html>
<head>
    <style>
        .card {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            background: white;
            transition: transform 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
        }
        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 0 auto 15px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="avatar">👨‍💻</div>
        <h3 style="text-align: center; margin: 0 0 10px 0;">NotionNext 开发者</h3>
        <p style="text-align: center; color: #666; margin: 0;">
            专注于创建优秀的博客体验
        </p>
    </div>
</body>
</html>
\`\`\`

## 安全说明

- **沙盒模式**: 默认使用 iframe 沙盒，限制脚本执行权限
- **样式隔离**: HTML 内容在独立环境中渲染，不会影响主页面
- **内容过滤**: 自动处理可能的安全风险

## 注意事项

1. HTML 代码会在沙盒环境中执行，某些功能可能受限
2. 建议保持 `HTML_RENDER_SANDBOX` 为 `true` 以确保安全
3. 复杂的交互功能可能需要调整沙盒权限
4. 渲染的 HTML 会自动适配容器高度

## 故障排除

### 渲染不显示
- 检查是否添加了 `<!-- render:true -->` 注释
- 确认 `HTML_RENDER_ENABLE` 配置为 `true`
- 查看浏览器控制台是否有错误信息

### 样式异常
- 确保 CSS 样式写在 HTML 内部或使用内联样式
- 避免依赖外部样式文件

### 功能受限
- 检查 iframe 沙盒权限设置
- 考虑调整 `sandbox` 属性（需要修改代码）

## 自定义样式

HTML 渲染容器支持自定义样式，可以通过修改 `/public/css/html-render.css` 文件来调整外观。

---

享受 HTML 渲染功能带来的便利吧！🚀