/**
 * 文章页面专用样式组件
 * @returns 
 */
export const PostStyle = () => {
  return (
    <style jsx global>{`
      /* 文章正文样式 */
      #notion-article {
        font-size: 1rem;
        line-height: 1.8;
        letter-spacing: 0.013em;
      }

      /* 文章标题 */
      #notion-article h1,
      #notion-article h2,
      #notion-article h3 {
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }

      #notion-article h1 {
        font-size: 1.8em;
        font-weight: 700;
        color: #111;
      }

      #notion-article h2 {
        font-size: 1.5em;
        font-weight: 600;
        color: #222;
      }

      #notion-article h3 {
        font-size: 1.25em;
        font-weight: 600;
        color: #333;
      }

      /* 文章段落 */
      #notion-article p {
        margin-bottom: 1.2em;
        opacity: 0.9;
      }

      /* 代码块 */
      #notion-article pre {
        border-radius: 8px;
        background-color: #f5f5f5;
        padding: 1rem;
        margin: 1.5rem 0;
        overflow-x: auto;
      }

      /* 行内代码 */
      #notion-article code:not(pre code) {
        background-color: #f0f0f0;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-size: 0.85em;
        color: #e53e3e;
      }

      /* 引用块 */
      #notion-article blockquote {
        border-left: 4px solid #4263eb;
        padding-left: 1em;
        color: #555;
        font-style: italic;
        margin: 1.5rem 0;
        background-color: rgba(66, 99, 235, 0.05);
        padding: 0.8rem 1rem;
        border-radius: 0 8px 8px 0;
      }

      /* 列表 */
      #notion-article ul, #notion-article ol {
        padding-left: 1.5em;
        margin: 1em 0;
      }

      #notion-article li {
        margin-bottom: 0.5em;
      }

      /* 表格 */
      #notion-article table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
        border-radius: 8px;
        overflow: hidden;
      }

      #notion-article th, #notion-article td {
        padding: 0.8rem;
        border: 1px solid #e0e0e0;
      }

      #notion-article th {
        background-color: #f5f7fa;
        font-weight: 600;
      }

      /* 图片 */
      #notion-article img {
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      /* 链接 */
      #notion-article a {
        color: #4263eb;
        text-decoration: none;
        border-bottom: 1px dotted #4263eb;
        transition: all 0.3s ease;
      }

      #notion-article a:hover {
        border-bottom: 1px solid #4263eb;
      }

      /* 暗黑模式适配 */
      .dark #notion-article {
        color: #e0e0e0;
      }

      .dark #notion-article h1 {
        color: #f0f0f0;
      }

      .dark #notion-article h2 {
        color: #e0e0e0;
      }

      .dark #notion-article h3 {
        color: #d0d0d0;
      }

      .dark #notion-article pre {
        background-color: #2d2d2d;
      }

      .dark #notion-article code:not(pre code) {
        background-color: #333;
        color: #ff6b6b;
      }

      .dark #notion-article blockquote {
        color: #bbb;
        background-color: rgba(66, 99, 235, 0.1);
      }

      .dark #notion-article th, .dark #notion-article td {
        border: 1px solid #444;
      }

      .dark #notion-article th {
        background-color: #333;
      }
    `}</style>
  )
}

export default PostStyle 