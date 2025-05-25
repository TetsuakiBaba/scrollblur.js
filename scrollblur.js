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
                threshold: parseFloat(url.searchParams.get('threshold')) || 1,
                multiplier: parseFloat(url.searchParams.get('multiplier')) || 10
            };
        } catch (e) {
            return { blurMax: 100, threshold: 1, multiplier: 10 };
        }
    }

    // デバイスタイプの検出
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // パラメータの取得
    const params = getScriptParams();
    const isMobile = isMobileDevice();

    // モバイルデバイスの場合はパラメータを調整
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();
    let ticking = false;
    let blurMax = isMobile ? Math.min(params.blurMax, 20) : params.blurMax;  // モバイルでは最大値を制限
    let threshold = isMobile ? params.threshold * 0.7 : params.threshold;    // モバイルでは閾値を下げる
    let multiplier = isMobile ? params.multiplier * 0.7 : params.multiplier; // モバイルでは乗数を下げる
    let currentBlur = 0;

    function updateBlur() {
        const now = Date.now();
        const newScrollY = window.scrollY;
        const deltaY = Math.abs(newScrollY - lastScrollY);
        const deltaT = now - lastTime || 1;
        const speed = deltaY / deltaT;                // px/ms
        const blur = Math.min(blurMax, speed * multiplier);  // 乗数を変数化

        // ブラー効果をフェードイン/アウトさせる
        if (blur > threshold) {
            currentBlur = blur;
            applyBlur(currentBlur);

            // タイムアウトをリセット
            clearTimeout(window._blurResetTimeout);
            window._blurResetTimeout = setTimeout(() => {
                fadeOutBlur();
            }, 100);
        }

        lastScrollY = newScrollY;
        lastTime = now;
        ticking = false;
    }

    // ブラー効果の適用を最適化
    function applyBlur(value) {
        // CSSフィルターよりもtransformの方がパフォーマンスが良い場合がある
        if (isMobile) {
            // モバイルではより軽量な実装を使用
            document.body.style.filter = `blur(${value}px)`;
        } else {
            document.body.style.filter = `blur(${value}px)`;
        }
    }

    // ブラー効果を徐々に減衰させる
    let fadeAnimationId = null;
    function fadeOutBlur() {
        if (fadeAnimationId) {
            cancelAnimationFrame(fadeAnimationId);
        }

        // 徐々に減衰させる
        currentBlur = currentBlur * 0.85; // モバイルではより速く減衰

        if (currentBlur < 0.5) {
            currentBlur = 0;
            applyBlur(0);
            document.body.style.filter = 'none';
            return;
        }

        applyBlur(currentBlur);
        fadeAnimationId = requestAnimationFrame(fadeOutBlur);
    }

    // タッチデバイス用の最適化されたスクロールイベント
    let lastTouchY = 0;
    let touchScrollTimeout;

    // スクロールイベントリスナー
    if (isMobile) {
        // モバイルデバイスではパッシブリスナーを使用
        window.addEventListener('scroll', () => {
            if (!ticking) {
                // スクロールイベントを間引く
                clearTimeout(touchScrollTimeout);
                touchScrollTimeout = setTimeout(() => {
                    window.requestAnimationFrame(updateBlur);
                    ticking = true;
                }, 16); // 約60fpsに相当
            }
        }, { passive: true });

        // タッチイベントの使用（オプション）
        document.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            // タッチ移動量が大きい場合のみ処理
            if (Math.abs(touchY - lastTouchY) > 5) {
                if (!ticking) {
                    window.requestAnimationFrame(updateBlur);
                    ticking = true;
                }
                lastTouchY = touchY;
            }
        }, { passive: true });
    } else {
        // デスクトップデバイスの場合は通常のスクロールイベント
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateBlur);
                ticking = true;
            }
        });
    }
})();