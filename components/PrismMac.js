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

  useEffect(() => {
    if (codeMacBar) {
      loadExternalResource('/css/prism-mac-style.css', 'css')
    }
    // 加载prism样式
    loadPrismThemeCSS(isDarkMode, prismThemeSwitch, prismThemeDarkPath, prismThemeLightPath, prismThemePrefixPath)
    // 折叠代码
    loadExternalResource(prismjsAutoLoader, 'js').then((url) => {
      if (window?.Prism?.plugins?.autoloader) {
        window.Prism.plugins.autoloader.languages_path = prismjsPath
      }

      renderPrismMac(codeLineNumbers)
      renderMermaid(mermaidCDN)
      renderCollapseCode(codeCollapse, codeCollapseExpandDefault)
    })
  }, [router, isDarkMode])

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      let shouldRender = false;
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // 检查新增的节点中是否包含代码块
          const hasCodeBlocks = Array.from(mutation.addedNodes).some(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              return node.querySelector('.notion-code') || 
                    node.classList?.contains('notion-code') ||
                    node.querySelector('pre code');
            }
            return false;
          });
          
          if (hasCodeBlocks) {
            shouldRender = true;
            break;
          }
        }
      }
      
      if (shouldRender) {
        // 使用防抖函数避免频繁渲染
        if (window.customCodeRenderTimeout) {
          clearTimeout(window.customCodeRenderTimeout);
        }
        window.customCodeRenderTimeout = setTimeout(() => {
          renderCustomCode();
        }, 200);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return <></>
}

/**
 * 加载Prism主题样式
 */
const loadPrismThemeCSS = (isDarkMode, prismThemeSwitch, prismThemeDarkPath, prismThemeLightPath, prismThemePrefixPath) => {
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
    const previousTheme = document.querySelector(`link[href="${PRISM_PREVIOUS}"]`)
    if (previousTheme) {
      previousTheme.parentNode.removeChild(previousTheme)
    }
    loadExternalResource(PRISM_THEME, 'css')
  } else {
    loadExternalResource(prismThemePrefixPath, 'css')
  }
}

/**
 * 将代码块转为可折叠对象
 */
const renderCollapseCode = (codeCollapse, codeCollapseExpandDefault) => {
  if (!codeCollapse) {
    return
  }
  const codeBlocks = document.querySelectorAll('.code-toolbar')
  for (const codeBlock of codeBlocks) {
    // 判断当前元素是否被包裹
    if (codeBlock.closest('.collapse-wrapper') || containsCustomCodeBlock(codeBlock)) {
      continue // 如果被包裹了，跳过当前循环
    }

    const code = codeBlock.querySelector('code')
    const language = code.getAttribute('class').match(/language-(\w+)/)[1]

    const collapseWrapper = document.createElement('div')
    collapseWrapper.className = 'collapse-wrapper w-full py-2'
    const panelWrapper = document.createElement('div')
    panelWrapper.className = 'border dark:border-gray-600 rounded-md hover:border-indigo-500 duration-200 transition-colors'

    const header = document.createElement('div')
    header.className = 'flex justify-between items-center px-4 py-2 cursor-pointer select-none'
    header.innerHTML = `<h3 class="text-lg font-medium">${language}</h3><svg class="transition-all duration-200 w-5 h-5 transform rotate-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.293 6.293a1 1 0 0 1 1.414 0L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" clip-rule="evenodd"/></svg>`

    const panel = document.createElement('div')
    panel.className = 'invisible h-0 transition-transform duration-200 border-t border-gray-300'

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
const renderMermaid = async (mermaidCDN) => {
  const observer = new MutationObserver(async mutationsList => {
    for (const m of mutationsList) {
      if (m.target.className === 'notion-code language-mermaid') {
        const chart = m.target.querySelector('code').textContent
        if (chart && !m.target.querySelector('.mermaid')) {
          const mermaidChart = document.createElement('div')
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
    observer.observe(document.querySelector('#notion-article'), { attributes: true, subtree: true })
  }
}

/**
 * @author https://github.com/chenyqthu, 基于 RylanBot
 * 代码块类型为 Html, CSS, JS
 * 且第一行出现注释 <!-- custom -->, \* custom *\, // custom
 * (第二个对应 css 注释写法, 这里无法正常打出, notion 代码块中正常使用左斜杠 / 即可)
 * (空格不能少)
 * 则自动替换，将内容替换为实际代码执行
 */
const containsCustomCodeBlock = (block) => {
  const textContent = block.textContent || '';
  return (
    textContent.includes('<!-- custom -->') ||
    textContent.includes('/* custom */') ||
    textContent.includes('/* custom-link */') ||
    textContent.includes('// custom')
  );
};

const renderCustomCode = () => {
  const toolbars = document.querySelectorAll('div.code-toolbar');

  toolbars.forEach((toolbarEl) => {
    // 检查是否已经处理过该代码块
    if (toolbarEl.hasAttribute('data-custom-processed')) {
      return;
    }
    
    const codeElements = toolbarEl.querySelectorAll('code');
    codeElements.forEach(codeElement => {
      const language = codeElement.className.replace('language-', '');
      const firstChild = codeElement.firstChild;
      if (firstChild) {
        const firstComment = firstChild.textContent || '';
        const isCustomLink = {
          css: firstComment.includes('/* custom-link */'),
          javascript: firstComment.includes('// custom-link')
        }[language]; 
        const isCustom = {
          html: firstComment.includes('<!-- custom -->'),
          css: firstComment.includes('/* custom */'),
          javascript: firstComment.includes('// custom')
        }[language];
        let originalCode = codeElement.textContent;
        const toolbarParent = codeElement.closest('div.code-toolbar').parentNode;

        if (isCustomLink || isCustom) {
          // 标记已处理
          toolbarEl.setAttribute('data-custom-processed', 'true');
          
          // 移除 custom 注释
          originalCode = originalCode.replace(/(\/\/ custom-link)|(\/\* custom-link \*\/)|(<!-- custom -->)|(\/\* custom \*\/)|(\/\/ custom)/, '').trim();

          switch (language) {
            case 'html': {
              const htmlContainer = document.createElement('div');
              htmlContainer.className = 'custom-html-container';
              htmlContainer.style.cssText = 'width: 100%; border: none; margin: 10px 0;';
              
              // 使用iframe隔离HTML内容
              const iframe = document.createElement('iframe');
              iframe.style.cssText = 'width: 100%; border: none; background: transparent;';
              iframe.onload = () => {
                if (iframe.contentDocument) {
                  iframe.contentDocument.body.innerHTML = originalCode;
                  // 调整iframe高度以适应内容
                  iframe.style.height = iframe.contentDocument.body.scrollHeight + 'px';
                  // 监听iframe内容变化动态调整高度
                  const resizeObserver = new ResizeObserver(() => {
                    iframe.style.height = iframe.contentDocument.body.scrollHeight + 'px';
                  });
                  resizeObserver.observe(iframe.contentDocument.body);
                }
              };
              
              htmlContainer.appendChild(iframe);
              toolbarParent.insertBefore(htmlContainer, toolbarEl);
              break;
            }
            case 'css': {
              if (isCustomLink) {
                // 将原始代码按行分割，每行视为一个独立的CSS链接
                const urls = originalCode.split('\n').filter(line => line.trim() !== '');
                urls.forEach(url => {
                  const linkElement = document.createElement('link');
                  linkElement.rel = 'stylesheet';
                  linkElement.href = url.trim();
                  document.head.appendChild(linkElement);
                });
              } else {
                const styleElement = document.createElement('style');
                // 为CSS添加作用域前缀，限制其只在特定容器内生效
                const containerId = `custom-css-${Math.random().toString(36).substring(2, 9)}`;
                const containerDiv = document.createElement('div');
                containerDiv.id = containerId;
                containerDiv.className = 'custom-css-container';
                
                // 处理CSS，为所有选择器添加父级选择器限制作用域
                const scopedCSS = addScopeToCSS(originalCode, `#${containerId}`);
                styleElement.textContent = scopedCSS;
                
                document.head.appendChild(styleElement);
                toolbarParent.insertBefore(containerDiv, toolbarEl);
              }
              break;
            }
            case 'javascript': {
              if (isCustomLink) {
                const scriptContainer = document.createElement('div');
                scriptContainer.innerHTML = originalCode;
                Array.from(scriptContainer.querySelectorAll('script')).forEach(script => {
                  const newScript = document.createElement('script');
                  if (script.src) {
                    newScript.src = script.src;
                    if (script.defer) newScript.defer = true;
                    if (script.async) newScript.async = true;
                  } else {
                    newScript.textContent = script.textContent;
                  }

                  const insertIntoHead = script.getAttribute('head') !== null;
                  if (insertIntoHead) {
                    document.head.appendChild(newScript);
                  } else {
                    document.body.appendChild(newScript);
                  }
                });
              } else {
                try {
                  // 创建一个沙箱容器来执行JS
                  const sandboxContainer = document.createElement('div');
                  sandboxContainer.className = 'js-sandbox-container';
                  sandboxContainer.style.cssText = 'width: 100%; margin: 10px 0; padding: 10px; border: 1px solid #eee; border-radius: 4px;';
                  
                  // 为脚本创建一个作用域，防止污染全局
                  const sandboxScript = document.createElement('script');
                  sandboxScript.textContent = `
                    (function() {
                      // 捕获错误
                      try {
                        ${originalCode}
                      } catch (error) {
                        console.error('自定义JS执行错误:', error);
                        document.querySelector('.js-sandbox-container:last-child').innerHTML += 
                          '<div style="color: red; margin-top: 5px;">执行错误: ' + error.message + '</div>';
                      }
                    })();
                  `;
                  
                  toolbarParent.insertBefore(sandboxContainer, toolbarEl);
                  document.body.appendChild(sandboxScript);
                } catch (error) {
                  console.error('无法执行自定义JS:', error);
                }
              }
              break;
            }
          }
          // 移除原始代码块容器
          toolbarParent.removeChild(toolbarEl);
        }
      }
    });
  });
};

// 添加一个函数用于给CSS添加作用域
const addScopeToCSS = (css, scopeSelector) => {
  try {
    // 简单的CSS解析和作用域添加
    // 这是一个基础实现，可能需要更复杂的CSS解析器处理所有情况
    return css.replace(/([^{]*)({[^}]*})/g, (match, selector, rules) => {
      // 处理选择器组（逗号分隔的多个选择器）
      const selectors = selector.split(',').map(s => s.trim());
      const scopedSelectors = selectors.map(s => {
        // 避免对@媒体查询等添加作用域
        if (s.startsWith('@')) return s;
        return `${scopeSelector} ${s}`;
      });
      return scopedSelectors.join(', ') + rules;
    });
  } catch (e) {
    console.error('添加CSS作用域失败:', e);
    return css; // 如果处理失败，返回原始CSS
  }
};

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
  observer.observe(document.querySelector('#notion-article'), { attributes: true, subtree: true })
  setTimeout(() => {
    const preCodes = document.querySelectorAll('pre.notion-code')
    for (const preCode of preCodes) {
      Prism.plugins.lineNumbers.resize(preCode)
    }
  }, 10)
}

export default PrismMac