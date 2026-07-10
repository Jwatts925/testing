const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuButton && siteNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('menu-open', isOpen);
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      document.body.classList.remove('menu-open');
    });
  });
}

const revealElements = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();


// Update the portfolio page indicator as the reader scrolls.
const portfolioReader = document.querySelector('[data-portfolio-reader]');
const portfolioPages = Array.from(document.querySelectorAll('[data-portfolio-page]'));
const portfolioCurrentPage = document.querySelector('#portfolio-current-page');

if (portfolioReader && portfolioPages.length && portfolioCurrentPage) {
  let portfolioTicking = false;

  const updatePortfolioPage = () => {
    const viewportCenter = window.innerHeight * 0.5;
    let closestPage = portfolioPages[0];
    let closestDistance = Number.POSITIVE_INFINITY;

    portfolioPages.forEach((page) => {
      const rect = page.getBoundingClientRect();
      const pageCenter = rect.top + rect.height * 0.5;
      const distance = Math.abs(pageCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPage = page;
      }
    });

    const current = Number(closestPage.dataset.portfolioPage || 1);
    portfolioCurrentPage.textContent = String(current).padStart(2, '0');
    portfolioTicking = false;
  };

  const requestPortfolioUpdate = () => {
    if (!portfolioTicking) {
      window.requestAnimationFrame(updatePortfolioPage);
      portfolioTicking = true;
    }
  };

  updatePortfolioPage();
  window.addEventListener('scroll', requestPortfolioUpdate, { passive: true });
  window.addEventListener('resize', requestPortfolioUpdate);
}
