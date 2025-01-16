import { siteConfig } from '@/lib/config';

export default function ChatBase() {
  if (!siteConfig('CHATBASE_ID')) {
    return <></>;
  }

  const baseUrl = `${siteConfig('CHATBASE_ID')}`;

  return (
    <div>
      <script>
        {`
          window.difyChatbotConfig = {
            token: 'tpn8UiMlmLEnZq2x',
            baseUrl: '${baseUrl}'
          }
        `}
      </script>
      <script
        src="${baseUrl}/embed.min.js"
        id="tpn8UiMlmLEnZq2x"
        defer
      ></script>
      <style>
        {`
          #dify-chatbot-bubble-button {
            background-color: #1C64F2 !important;
          }
          #dify-chatbot-bubble-window {
            width: 24rem !important;
            height: 40rem !important;
          }
        `}
      </style>
    </div>
  );
}
