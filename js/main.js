// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function () {

  // スライドショー機能
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // 2秒間隔でスライドを切り替え
  if (slides.length > 0) {
    setInterval(nextSlide, 2000);
  }

  // ナビゲーション関連
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // ハンバーガーメニューの切り替え
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // ナビゲーションリンククリック時の処理
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70; // ナビバーの高さ分調整
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }

      // モバイルメニューを閉じる
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // スクロール時のナビゲーション効果
  window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // FAQ アコーディオン機能
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', function () {
      const isActive = item.classList.contains('active');

      // 他のFAQアイテムを閉じる
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // クリックされたアイテムの状態を切り替え
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });

  // フォーム送信処理
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      // 送信ボタンの状態を変更
      submitButton.innerHTML = '<span class="loading"></span> 送信中...';
      submitButton.disabled = true;

      // 実際の送信処理（ここではシミュレーション）
      setTimeout(() => {
        // 成功メッセージを表示
        showNotification('お問い合わせありがとうございます。', 'success');

        // フォームをリセット
        this.reset();

        // ボタンを元の状態に戻す
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 2000);
    });
  }

  // 通知表示機能
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    // スタイルを追加
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

    document.body.appendChild(notification);

    // アニメーション表示
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // 閉じるボタンのイベント
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    });

    // 自動で閉じる
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  }

  // スクロールアニメーション
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, observerOptions);

  // アニメーション対象要素を監視
  const animateElements = document.querySelectorAll('.artist-card, .event-card, .news-item, .faq-item');
  animateElements.forEach(el => {
    observer.observe(el);
  });

  // スムーススクロール（ページ内リンク用）
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // 画像の遅延読み込み
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));

  // パフォーマンス最適化：デバウンス関数
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // リサイズ時の処理（デバウンス適用）
  const handleResize = debounce(function () {
    // モバイルメニューが開いている場合は閉じる
    if (window.innerWidth > 768) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  }, 250);

  window.addEventListener('resize', handleResize);

  // キーボードナビゲーション対応
  document.addEventListener('keydown', function (e) {
    // ESCキーでモバイルメニューを閉じる
    if (e.key === 'Escape') {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // ページ読み込み完了時の処理
  window.addEventListener('load', function () {
    // ローディングアニメーション（必要に応じて）
    document.body.classList.add('loaded');

    // 初期アニメーション
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(30px)';

      setTimeout(() => {
        heroContent.style.transition = 'all 0.8s ease';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      }, 100);
    }
  });

  // ソーシャルメディアリンクの処理
  const socialLinks = document.querySelectorAll('.social-link');
  socialLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const platform = this.querySelector('i').className;
      let url = '';

      if (platform.includes('instagram')) {
        url = 'https://instagram.com/hiraizumi_jazz_festival';
      } else if (platform.includes('twitter')) {
        url = 'https://twitter.com/hiraizumi_jazz';
      } else if (platform.includes('facebook')) {
        url = 'https://facebook.com/hiraizumi.jazz.festival';
      }

      if (url) {
        window.open(url, '_blank');
      }
    });
  });

  // アーティストカードのホバー効果強化
  const artistCards = document.querySelectorAll('.artist-card');
  artistCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // イベントカードのホバー効果強化
  const eventCards = document.querySelectorAll('.event-card');
  eventCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-5px) scale(1.01)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // コンソールにメッセージを表示（開発者向け）
  console.log('%c🎷 平泉ジャズフェスティバル2025 🎷', 'color: #e74c3c; font-size: 20px; font-weight: bold;');
  console.log('%c世界遺産の町で奏でるジャズをお楽しみください！', 'color: #2c3e50; font-size: 14px;');

});

// ユーティリティ関数
const Utils = {
  // 要素が画面内にあるかチェック
  isInViewport: function (element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // 数値をカンマ区切りでフォーマット
  formatNumber: function (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // 日付をフォーマット
  formatDate: function (date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return new Date(date).toLocaleDateString('ja-JP', options);
  }
};
