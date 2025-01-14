import { useEffect } from 'react';

export default function DifyChatbot() {
  useEffect(() => {
    // 硬编码配置值
    const difyChatbotEnabled = true; // 替换为实际值
    const difyChatbotToken = 'tpn8UiMlmLEnZq2x'; // 替换为实际值
    const difyChatbotBaseUrl = 'https://sknote.skillre.online:44335'; // 替换为实际值

    // 如果 DifyChatbot 未启用，直接返回
    if (!difyChatbotEnabled) {
      return;
    }

    // 配置 DifyChatbot
    window.difyChatbotConfig = {
      token: difyChatbotToken,
      baseUrl: difyChatbotBaseUrl
    };

    // 加载 DifyChatbot 脚本
    const script = document.createElement('script');
    script.src = `${difyChatbotBaseUrl}/embed.min.js`; // 直接使用硬编码的 baseUrl
    script.id = difyChatbotToken; // 直接使用硬编码的 token
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // 在组件卸载时清理 script 标签
      const existingScript = document.getElementById(difyChatbotToken); // 直接使用硬编码的 token
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []); // 依赖数组为空，脚本仅在组件挂载时执行一次

  return null;
}
