(function () {
    // URLからパラメータを取得する関数
    function getScriptParams() {
        const scripts = document.getElementsByTagName('script');
        const currentScript = scripts[scripts.length - 1]; // 通常、最後に読み込まれたスクリプトが現在のスクリプト
        const scriptSrc = currentScript.src;

        try {
            const url = new URL(scriptSrc);
            return {
                blurMax: parseFloat(url.searchParams.get('blurMax')) || 100,
                threshold: parseFloat(url.searchParams.get('threshold')) || 1
            };
        } catch (e) {
            return { blurMax: 100, threshold: 1 };
        }
    }

    // パラメータの取得
    const params = getScriptParams();

    let lastScrollY = window.scrollY;
    let lastTime = Date.now();
    let ticking = false;
    let blurMax = params.blurMax;    // 最大blur値(px)
    let threshold = params.threshold;  // スクロール速度px/ms

    function updateBlur() {
        const now = Date.now();
        const newScrollY = window.scrollY;
        const deltaY = Math.abs(newScrollY - lastScrollY);
        const deltaT = now - lastTime || 1;
        const speed = deltaY / deltaT;              // px/ms
        const blur = Math.min(blurMax, speed * 10);  // 体感で調整

        document.body.style.filter = blur > threshold
            ? `blur(${blur}px)`
            : 'none';

        lastScrollY = newScrollY;
        lastTime = now;
        ticking = false;

        if (blur > threshold) {
            clearTimeout(window._blurResetTimeout);
            window._blurResetTimeout = setTimeout(() => {
                document.body.style.filter = 'none';
            }, 120);
        }
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateBlur);
            ticking = true;
        }
    });
})();