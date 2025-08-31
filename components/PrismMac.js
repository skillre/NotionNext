import { useEffect } from 'react'
import Prism from 'prismjs'
// 所有语言的prismjs 使用autoloader引入
// import 'prismjs/plugins/autoloader/prism-autoloader'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/toolbar/prism-toolbar.min.css'
import 'prismjs/plugins/show-language/prism-show-language'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

// mermaid图
import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'

/**
 * 代码美化相关
 * @author https://github.com/txs/
 * @returns
 */
const PrismMac = () => {
  const router = useRouter()
  const { isDarkMode } = useGlobal()
  const codeMacBar = siteConfig('CODE_MAC_BAR')
  const prismjsAutoLoader = siteConfig('PRISM_JS_AUTO_LOADER')
  const prismjsPath = siteConfig('PRISM_JS_PATH')

  const prismThemeSwitch = siteConfig('PRISM_THEME_SWITCH')
  const prismThemeDarkPath = siteConfig('PRISM_THEME_DARK_PATH')
  const prismThemeLightPath = siteConfig('PRISM_THEME_LIGHT_PATH')
  const prismThemePrefixPath = siteConfig('PRISM_THEME_PREFIX_PATH')

  const mermaidCDN = siteConfig('MERMAID_CDN')
  const codeLineNumbers = siteConfig('CODE_LINE_NUMBERS')

  const codeCollapse = siteConfig('CODE_COLLAPSE')
  const codeCollapseExpandDefault = siteConfig('CODE_COLLAPSE_EXPAND_DEFAULT')

  // HTML渲染相关配置
  const htmlRenderEnable = siteConfig('HTML_RENDER_ENABLE')
  const htmlRenderSandbox = siteConfig('HTML_RENDER_SANDBOX')
  const htmlRenderHideCode = siteConfig('HTML_RENDER_HIDE_CODE')

  useEffect(() => {
    if (codeMacBar) {
      loadExternalResource('/css/prism-mac-style.css', 'css')
    }
    
    // 加载HTML渲染样式
    if (htmlRenderEnable) {
      loadExternalResource('/css/html-render.css', 'css')
    }
    
    // 加载prism样式
    loadPrismThemeCSS(
      isDarkMode,
      prismThemeSwitch,
      prismThemeDarkPath,
      prismThemeLightPath,
      prismThemePrefixPath
    )
    // 折叠代码
    loadExternalResource(prismjsAutoLoader, 'js').then(url => {
      if (window?.Prism?.plugins?.autoloader) {
        window.Prism.plugins.autoloader.languages_path = prismjsPath
      }

      renderPrismMac(codeLineNumbers)
      renderMermaid(mermaidCDN)
      renderCollapseCode(codeCollapse, codeCollapseExpandDefault)
      // 渲染HTML代码
      if (htmlRenderEnable) {
        renderHtmlCode(htmlRenderSandbox, htmlRenderHideCode)
      }
    })
  }, [router, isDarkMode])

  return <></>
}

/**
 * 加载Prism主题样式
 */
const loadPrismThemeCSS = (
  isDarkMode,
  prismThemeSwitch,
  prismThemeDarkPath,
  prismThemeLightPath,
  prismThemePrefixPath
) => {
  let PRISM_THEME
  let PRISM_PREVIOUS
  if (prismThemeSwitch) {
    if (isDarkMode) {
      PRISM_THEME = prismThemeDarkPath
      PRISM_PREVIOUS = prismThemeLightPath
    } else {
      PRISM_THEME = prismThemeLightPath
      PRISM_PREVIOUS = prismThemeDarkPath
    }
    const previousTheme = document.querySelector(
      `link[href="${PRISM_PREVIOUS}"]`
    )
    if (
      previousTheme &&
      previousTheme.parentNode &&
      previousTheme.parentNode.contains(previousTheme)
    ) {
      previousTheme.parentNode.removeChild(previousTheme)
    }
    loadExternalResource(PRISM_THEME, 'css')
  } else {
    loadExternalResource(prismThemePrefixPath, 'css')
  }
}

/*
 * 将代码块转为可折叠对象
 */
const renderCollapseCode = (codeCollapse, codeCollapseExpandDefault) => {
  if (!codeCollapse) {
    return
  }
  const codeBlocks = document.querySelectorAll('.code-toolbar')
  for (const codeBlock of codeBlocks) {
    // 判断当前元素是否被包裹
    if (codeBlock.closest('.collapse-wrapper')) {
      continue // 如果被包裹了，跳过当前循环
    }

    const code = codeBlock.querySelector('code')
    const language = code.getAttribute('class').match(/language-(\w+)/)[1]

    const collapseWrapper = document.createElement('div')
    collapseWrapper.className = 'collapse-wrapper w-full py-2'
    const panelWrapper = document.createElement('div')
    panelWrapper.className =
      'border dark:border-gray-600 rounded-md hover:border-indigo-500 duration-200 transition-colors'

    const header = document.createElement('div')
    header.className =
      'flex justify-between items-center px-4 py-2 cursor-pointer select-none'
    header.innerHTML = `<h3 class="text-lg font-medium">${language}</h3><svg class="transition-all duration-200 w-5 h-5 transform rotate-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.293 6.293a1 1 0 0 1 1.414 0L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" clip-rule="evenodd"/></svg>`

    const panel = document.createElement('div')
    panel.className =
      'invisible h-0 transition-transform duration-200 border-t border-gray-300'

    panelWrapper.appendChild(header)
    panelWrapper.appendChild(panel)
    collapseWrapper.appendChild(panelWrapper)

    codeBlock.parentNode.insertBefore(collapseWrapper, codeBlock)
    panel.appendChild(codeBlock)

    function collapseCode() {
      panel.classList.toggle('invisible')
      panel.classList.toggle('h-0')
      panel.classList.toggle('h-auto')
      header.querySelector('svg').classList.toggle('rotate-180')
      panelWrapper.classList.toggle('border-gray-300')
    }

    // 点击后折叠展开代码
    header.addEventListener('click', collapseCode)
    // 是否自动展开
    if (codeCollapseExpandDefault) {
      header.click()
    }
  }
}

/**
 * 将mermaid语言 渲染成图片
 */
const renderMermaid = mermaidCDN => {
  const observer = new MutationObserver(mutationsList => {
    for (const m of mutationsList) {
      if (m.target.className === 'notion-code language-mermaid') {
        const chart = m.target.querySelector('code').textContent
        if (chart && !m.target.querySelector('.mermaid')) {
          const mermaidChart = document.createElement('pre')
          mermaidChart.className = 'mermaid'
          mermaidChart.innerHTML = chart
          m.target.appendChild(mermaidChart)
        }

        const mermaidsSvg = document.querySelectorAll('.mermaid')
        if (mermaidsSvg) {
          let needLoad = false
          for (const e of mermaidsSvg) {
            if (e?.firstChild?.nodeName !== 'svg') {
              needLoad = true
            }
          }
          if (needLoad) {
            loadExternalResource(mermaidCDN, 'js').then(url => {
              setTimeout(() => {
                const mermaid = window.mermaid
                mermaid?.contentLoaded()
              }, 100)
            })
          }
        }
      }
    }
  })
  if (document.querySelector('#notion-article')) {
    observer.observe(document.querySelector('#notion-article'), {
      attributes: true,
      subtree: true
    })
  }
}

function renderPrismMac(codeLineNumbers) {
  const container = document?.getElementById('notion-article')

  // Add line numbers
  if (codeLineNumbers) {
    const codeBlocks = container?.getElementsByTagName('pre')
    if (codeBlocks) {
      Array.from(codeBlocks).forEach(item => {
        if (!item.classList.contains('line-numbers')) {
          item.classList.add('line-numbers')
          item.style.whiteSpace = 'pre-wrap'
        }
      })
    }
  }
  // 重新渲染之前检查所有的多余text

  try {
    Prism.highlightAll()
  } catch (err) {
    console.log('代码渲染', err)
  }

  const codeToolBars = container?.getElementsByClassName('code-toolbar')
  // Add pre-mac element for Mac Style UI
  if (codeToolBars) {
    Array.from(codeToolBars).forEach(item => {
      const existPreMac = item.getElementsByClassName('pre-mac')
      if (existPreMac.length < codeToolBars.length) {
        const preMac = document.createElement('div')
        preMac.classList.add('pre-mac')
        preMac.innerHTML = '<span></span><span></span><span></span>'
        item?.appendChild(preMac, item)
      }
    })
  }

  // 折叠代码行号bug
  if (codeLineNumbers) {
    fixCodeLineStyle()
  }
}

/**
 * 行号样式在首次渲染或被detail折叠后行高判断错误
 * 在此手动resize计算
 */
const fixCodeLineStyle = () => {
  const observer = new MutationObserver(mutationsList => {
    for (const m of mutationsList) {
      if (m.target.nodeName === 'DETAILS') {
        const preCodes = m.target.querySelectorAll('pre.notion-code')
        for (const preCode of preCodes) {
          Prism.plugins.lineNumbers.resize(preCode)
        }
      }
    }
  })
  observer.observe(document.querySelector('#notion-article'), {
    attributes: true,
    subtree: true
  })
  setTimeout(() => {
    const preCodes = document.querySelectorAll('pre.notion-code')
    for (const preCode of preCodes) {
      Prism.plugins.lineNumbers.resize(preCode)
    }
  }, 10)
}

/**
 * 渲染HTML代码块
 * @param {boolean} useSandbox 是否使用沙监模式
 * @param {boolean} hideCode 是否默认隐藏原始代码
 */
const renderHtmlCode = (useSandbox = true, hideCode = true) => {
  const container = document?.getElementById('notion-article')
  if (!container) return

  // 查找所有HTML代码块
  const htmlCodeBlocks = container.querySelectorAll('code.language-html')
  
  htmlCodeBlocks.forEach(codeElement => {
    // 严格的重复渲染检查
    if (isAlreadyRendered(codeElement)) {
      return
    }
    
    const codeContent = codeElement.textContent || ''
    
    // 检查是否包含渲染开关（在代码块的最前面）
    const renderTrigger = '<!-- render:true -->'
    const noRenderTrigger = '<!-- render:false -->'
    
    // 检查开关状态
    let shouldRender = false
    let cleanedCode = codeContent
    
    if (codeContent.trim().startsWith(renderTrigger)) {
      shouldRender = true
      cleanedCode = codeContent.replace(renderTrigger, '').trim()
    } else if (codeContent.trim().startsWith(noRenderTrigger)) {
      shouldRender = false
      cleanedCode = codeContent.replace(noRenderTrigger, '').trim()
    }
    
    // 如果不需要渲染，跳过
    if (!shouldRender) {
      return
    }
    
    // 标记该元素已被处理
    codeElement.setAttribute('data-html-rendered', 'true')
    
    const parentElement = codeElement.closest('.code-toolbar') || codeElement.closest('pre')
    
    // 根据配置决定是否隐藏原始代码
    if (hideCode) {
      parentElement.style.display = 'none'
    }
    
    // 创建渲染容器
    const renderContainer = document.createElement('div')
    renderContainer.className = 'html-render-container'
    
    // 创建标题栏
    const titleBar = document.createElement('div')
    titleBar.className = 'title-bar'
    titleBar.innerHTML = '🔍 HTML 渲染预览'
    renderContainer.appendChild(titleBar)
    
    if (useSandbox) {
      // 使用iframe沙监模式（推荐）
      const iframe = document.createElement('iframe')
      iframe.className = 'html-render-iframe'
      
      // 设置沙监属性，防止恶意代码
      iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals'
      
      renderContainer.appendChild(iframe)
      
      // 向iframe写入HTML内容
      iframe.onload = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
          
          // 创建独立的HTML文档
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
              ${generateMobileOptimizedStyle()}
            </head>
            <body>
              ${cleanedCode}
              <script>
                // 防止重复调整的标识
                let isAdjusting = false;
                let adjustmentCount = 0;
                const MAX_ADJUSTMENTS = 10; // 最大调整次数限制
                
                // 改进的iframe高度计算逻辑
                function adjustIframeHeight() {
                  // 防止重复调整和过度调整
                  if (isAdjusting || adjustmentCount >= MAX_ADJUSTMENTS) {
                    return;
                  }
                  
                  isAdjusting = true;
                  adjustmentCount++;
                  
                  try {
                    const body = document.body;
                    const html = document.documentElement;
                    
                    // 获取多种高度计算方法
                    const heights = [
                      body.scrollHeight,
                      body.offsetHeight,
                      html.clientHeight,
                      html.scrollHeight,
                      html.offsetHeight
                    ];
                    
                    // 过滤无效值和异常值
                    const validHeights = heights.filter(h => 
                      typeof h === 'number' && 
                      h > 0 && 
                      h < 5000 && // 设置合理的上限
                      !isNaN(h)
                    );
                    
                    if (validHeights.length === 0) {
                      console.warn('HTML渲染: 无法获取有效的高度值');
                      isAdjusting = false;
                      return;
                    }
                    
                    // 取最小的合理值而不是最大值，避免异常大的高度
                    const calculatedHeight = Math.min(...validHeights);
                    
                    // 设置合理的边界值
                    const minHeight = 50;  // 最小高度
                    const maxHeight = 3000; // 最大高度限制
                    const finalHeight = Math.max(minHeight, Math.min(calculatedHeight, maxHeight));
                    
                    // 添加调试日志
                    console.log('HTML渲染高度计算:', {
                      原始高度值: heights,
                      有效高度值: validHeights,
                      计算高度: calculatedHeight,
                      最终高度: finalHeight,
                      调整次数: adjustmentCount
                    });
                    
                    // 防抖处理，避免频繁发送消息
                    setTimeout(() => {
                      window.parent.postMessage({
                        type: 'htmlRenderResize', // 使用特殊的消息类型
                        height: finalHeight + 30, // 适当的边距
                        iframeId: window.frameElement?.id || 'unknown',
                        timestamp: Date.now()
                      }, '*');
                      isAdjusting = false;
                    }, 150);
                    
                  } catch (error) {
                    console.error('HTML渲染高度调整错误:', error);
                    isAdjusting = false;
                    
                    // 发送默认高度
                    window.parent.postMessage({
                      type: 'htmlRenderResize',
                      height: 300, // 默认高度
                      iframeId: window.frameElement?.id || 'unknown',
                      timestamp: Date.now(),
                      error: true
                    }, '*');
                  }
                }
                
                // 延迟初始调整，确保DOM完全加载
                setTimeout(() => {
                  adjustIframeHeight();
                  
                  // 第二次调整，处理异步内容
                  setTimeout(adjustIframeHeight, 500);
                }, 200);
                
                // 监听窗口大小变化（带防抖）
                let resizeTimer = null;
                window.addEventListener('resize', () => {
                  clearTimeout(resizeTimer);
                  resizeTimer = setTimeout(adjustIframeHeight, 300);
                });
                
                // 监听DOM变化（更精确的监听）
                const observer = new MutationObserver((mutations) => {
                  // 只在有意义的变化时调整高度
                  const hasSignificantChange = mutations.some(mutation => 
                    mutation.type === 'childList' && 
                    (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
                  );
                  
                  if (hasSignificantChange && adjustmentCount < MAX_ADJUSTMENTS) {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(adjustIframeHeight, 200);
                  }
                });
                
                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });
                
                // 页面卸载时清理
                window.addEventListener('beforeunload', () => {
                  observer.disconnect();
                  clearTimeout(resizeTimer);
                });
              </script>
            </body>
            </html>
          `
          
          iframeDoc.open()
          iframeDoc.write(htmlContent)
          iframeDoc.close()
          
        } catch (error) {
          console.error('HTML渲染错误:', error)
          const errorContainer = document.createElement('div')
          errorContainer.className = 'html-render-error'
          errorContainer.innerHTML = `
            <strong>渲染错误</strong><br>
            <small>请检查HTML代码是否正确</small>
          `
          iframe.replaceWith(errorContainer)
        }
      }
      
      // 改进的消息监听器，专门处理HTML渲染iframe的高度调整
      let messageHandler = null;
      
      if (!window.htmlRenderMessageHandlerAdded) {
        messageHandler = (event) => {
          // 验证消息来源和格式
          if (!event.data || 
              event.data.type !== 'htmlRenderResize' || 
              typeof event.data.height !== 'number') {
            return;
          }
          
          // 验证高度值的合理性
          const height = event.data.height;
          if (height <= 0 || height > 5000 || isNaN(height)) {
            console.warn('HTML渲染: 接收到异常的高度值', height);
            return;
          }
          
          // 查找对应的iframe
          const targetIframe = event.source?.frameElement;
          if (targetIframe && 
              targetIframe.classList.contains('html-render-iframe')) {
            
            // 记录高度调整日志
            console.log('HTML渲染: 调整iframe高度', {
              iframeId: event.data.iframeId,
              oldHeight: targetIframe.style.height,
              newHeight: height + 'px',
              timestamp: event.data.timestamp
            });
            
            // 平滑过渡高度变化
            targetIframe.style.transition = 'height 0.3s ease';
            targetIframe.style.height = height + 'px';
            
            // 移除过渡效果
            setTimeout(() => {
              targetIframe.style.transition = '';
            }, 300);
          }
        };
        
        window.addEventListener('message', messageHandler);
        window.htmlRenderMessageHandlerAdded = true;
        
        // 页面卸载时清理事件监听器
        window.addEventListener('beforeunload', () => {
          window.removeEventListener('message', messageHandler);
          window.htmlRenderMessageHandlerAdded = false;
        });
      }
      
    } else {
      // 直接渲染模式（不推荐，可能影响页面样式）
      const directRenderContainer = document.createElement('div')
      directRenderContainer.className = 'direct-render'
      directRenderContainer.innerHTML = cleanedCode
      renderContainer.appendChild(directRenderContainer)
    }
    
    // 将渲染容器插入到代码块后面
    parentElement.parentNode.insertBefore(renderContainer, parentElement.nextSibling)
  })
}

/**
 * 检查代码元素是否已被渲染
 * @param {Element} codeElement 代码元素
 * @returns {boolean} 是否已渲染
 */
const isAlreadyRendered = (codeElement) => {
  // 检查数据属性标记
  if (codeElement.getAttribute('data-html-rendered') === 'true') {
    return true
  }
  
  // 检查父级容器中的渲染结果
  const parentElement = codeElement.closest('.code-toolbar') || codeElement.closest('pre')
  if (!parentElement) return false
  
  // 检查父级容器的同级元素中是否已存在渲染容器
  const parentNode = parentElement.parentNode
  if (parentNode) {
    const existingContainer = parentNode.querySelector('.html-render-container')
    if (existingContainer) {
      return true
    }
  }
  
  return false
}

/**
 * 生成移动端优化样式
 * @returns {string} CSS样式字符串
 */
const generateMobileOptimizedStyle = () => {
  return `
    <style>
      /* 重置样式，避免外部样式干扰 */
      * {
        box-sizing: border-box;
        max-width: 100%;
      }
      
      html, body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        word-wrap: break-word;
        word-break: break-word;
        contain: layout style paint;
        /* 限制最大高度，防止异常高度 */
        max-height: 3000px;
        height: auto;
      }
      
      body {
        margin: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        font-size: 16px;
      }
      
      /* 防止各种元素溢出 */
      table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        overflow-x: auto;
        display: block;
        white-space: nowrap;
      }
      
      img, video, iframe, canvas, svg {
        max-width: 100%;
        height: auto;
        display: block;
      }
      
      pre, code {
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        max-width: 100%;
      }
      
      /* 响应式断点 - 平板适配 */
      @media (max-width: 768px) {
        body {
          margin: 6px;
          font-size: 15px;
          line-height: 1.5;
        }
        
        h1 { font-size: 1.6em; margin: 0.8em 0; }
        h2 { font-size: 1.4em; margin: 0.7em 0; }
        h3 { font-size: 1.2em; margin: 0.6em 0; }
        h4, h5, h6 { font-size: 1.1em; margin: 0.5em 0; }
        
        table {
          font-size: 14px;
        }
      }
      
      /* 响应式断点 - 手机适配 */
      @media (max-width: 480px) {
        body {
          margin: 4px;
          font-size: 14px;
          line-height: 1.4;
        }
        
        h1 { font-size: 1.4em; }
        h2 { font-size: 1.2em; }
        h3 { font-size: 1.1em; }
        h4, h5, h6 { font-size: 1em; }
        
        table {
          font-size: 12px;
        }
        
        /* 优化触摸交互 */
        button, input, select, textarea {
          font-size: 16px; /* 防止iOS缩放 */
        }
      }
      
      /* 响应式断点 - 超小屏幕适配 */
      @media (max-width: 320px) {
        body {
          margin: 2px;
          font-size: 13px;
        }
        
        h1 { font-size: 1.3em; }
        h2 { font-size: 1.1em; }
        h3, h4, h5, h6 { font-size: 1em; }
        
        table {
          font-size: 11px;
        }
      }
      
      /* 滚动条优化 */
      ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 2px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.4);
      }
    </style>
  `
}

export default PrismMac
