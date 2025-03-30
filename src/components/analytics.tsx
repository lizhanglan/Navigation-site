'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface AnalyticsProps {
  googleAnalyticsId?: string;
  baiduAnalyticsId?: string;
}

export function Analytics({ googleAnalyticsId, baiduAnalyticsId }: AnalyticsProps) {
  // 百度统计
  useEffect(() => {
    if (baiduAnalyticsId) {
      window._hmt = window._hmt || [];
      (function() {
        const hm = document.createElement("script");
        hm.src = `https://hm.baidu.com/hm.js?${baiduAnalyticsId}`;
        const s = document.getElementsByTagName("script")[0]; 
        if (s && s.parentNode) {
          s.parentNode.insertBefore(hm, s);
        } else {
          document.head.appendChild(hm);
        }
      })();
    }
  }, [baiduAnalyticsId]);

  if (!googleAnalyticsId && !baiduAnalyticsId) return null;

  return (
    <>
      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}
    </>
  );
}

// 为了 TypeScript 支持百度统计
declare global {
  interface Window {
    _hmt: Array<[string, string, string?, any?]>;
  }
}