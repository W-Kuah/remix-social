import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';

// Extend the Navigator interface to include the standalone property
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

const useWebViewDetection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const navigatorWithStandalone = navigator as NavigatorWithStandalone;

    // Common indicators for webviews
    const isWebView = /FBAN|FBAV|Instagram|WebView|wv/.test(userAgent) ||
      (/Android/.test(userAgent) && !/Chrome/.test(userAgent));

    // Standalone mode check (for PWAs)
    const isStandalone = navigatorWithStandalone.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isWebView || isStandalone) {
      let link = document.createElement('a');
      link.href = 'https://www.wazzupsocials.com'
      link.target = '_blank'
      document.body.appendChild(link);
      // window.open('https://www.wazzupsocials.com', '_blank')
    }
  }, [navigate]);
};

export default useWebViewDetection;
