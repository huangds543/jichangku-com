document.addEventListener('DOMContentLoaded', () => {
  const toast = document.querySelector('#toast');
  const compareKey = 'jichangkuCompare';
  const maxCompare = 3;
  let timer;
  let compareExpanded = false;

  const navLinks = document.querySelector('.nav-links');
  const activeNavLink = navLinks?.querySelector('.nav-link.active');
  if (navLinks && activeNavLink && window.matchMedia('(max-width: 640px)').matches) {
    navLinks.scrollLeft = activeNavLink.offsetLeft - (navLinks.clientWidth - activeNavLink.offsetWidth) / 2;
  }

  const detailNav = document.querySelector('[data-detail-nav]');
  if (detailNav) {
    const detailLinks = [...detailNav.querySelectorAll('a[href^="#"]')];
    const detailSections = detailLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const activateDetailSection = id => {
      detailLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', active);
        if (active) {
          link.setAttribute('aria-current', 'true');
          if (window.matchMedia('(max-width: 960px)').matches) link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };
    if (detailSections.length) {
      let detailScrollFrame;
      const updateDetailNav = () => {
        let current = detailSections[0];
        const activationOffset = 300;
        detailSections.forEach(section => {
          if (section.getBoundingClientRect().top <= activationOffset) current = section;
        });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 12) {
          current = detailSections[detailSections.length - 1];
        }
        activateDetailSection(current.id);
      };
      const queueDetailNavUpdate = () => {
        cancelAnimationFrame(detailScrollFrame);
        detailScrollFrame = requestAnimationFrame(updateDetailNav);
      };
      updateDetailNav();
      window.addEventListener('scroll', queueDetailNavUpdate, { passive: true });
      window.addEventListener('resize', queueDetailNavUpdate);
    }
  }

  const blogTocLinks = [...document.querySelectorAll('.blog-toc a[href^="#"], .blog-mobile-toc a[href^="#"]')];
  if (blogTocLinks.length) {
    const blogHeadingIds = [...new Set(blogTocLinks.map(link => decodeURIComponent(link.hash.slice(1))))];
    const blogHeadings = blogHeadingIds.map(id => document.getElementById(id)).filter(Boolean);
    const activateBlogHeading = id => {
      blogTocLinks.forEach(link => {
        const active = decodeURIComponent(link.hash.slice(1)) === id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    let blogTocFrame;
    const updateBlogToc = () => {
      let current = blogHeadings[0];
      blogHeadings.forEach(heading => {
        if (heading.getBoundingClientRect().top <= 190) current = heading;
      });
      if (current) activateBlogHeading(current.id);
    };
    const queueBlogTocUpdate = () => {
      cancelAnimationFrame(blogTocFrame);
      blogTocFrame = requestAnimationFrame(updateBlogToc);
    };
    updateBlogToc();
    window.addEventListener('scroll', queueBlogTocUpdate, { passive: true });
    window.addEventListener('resize', queueBlogTocUpdate);
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function copyText(value) {
    if (!value) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(() => showToast('订阅链接已复制')).catch(() => showToast('复制失败，请手动复制'));
      return;
    }
    const input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showToast('订阅链接已复制');
    } catch (_) {
      showToast('复制失败，请手动复制');
    }
    input.remove();
  }

  function activateFilter(filter) {
    const rows = [...document.querySelectorAll('.airport-row')];
    let visible = 0;
    rows.forEach(row => {
      const match = filter === 'all' || row.dataset[filter] === 'true';
      row.hidden = !match;
      if (match) visible += 1;
    });
    document.querySelectorAll('[data-filter]').forEach(button => {
      button.classList.toggle('active', button.dataset.filter === filter);
      button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
    });
    const empty = document.querySelector('#empty-state');
    if (empty) empty.hidden = visible > 0;
  }

  function activateSoftwareFilter(platform) {
    const cards = [...document.querySelectorAll('.software-card')];
    let visible = 0;
    cards.forEach(card => {
      const platforms = (card.dataset.platforms || '').split(',');
      const match = platform === 'all' || platforms.includes(platform) || (platform === 'iPhone' && platforms.includes('iPad'));
      card.hidden = !match;
      if (match) visible += 1;
    });
    document.querySelectorAll('[data-software-filter]').forEach(button => {
      const active = button.dataset.softwareFilter === platform;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const empty = document.querySelector('#software-empty');
    if (empty) empty.hidden = visible > 0;
  }

  let activeBlogCategory = 'all';
  let activeBlogTag = 'all';
  function activateBlogFilters() {
    const cards = [...document.querySelectorAll('[data-blog-card]')];
    let visible = 0;
    cards.forEach(card => {
      const tags = (card.dataset.blogTags || '').split('|').filter(Boolean);
      const matchesCategory = activeBlogCategory === 'all' || card.dataset.blogCategory === activeBlogCategory;
      const matchesTag = activeBlogTag === 'all' || tags.includes(activeBlogTag);
      const match = matchesCategory && matchesTag;
      card.hidden = !match;
      if (match) visible += 1;
    });
    document.querySelectorAll('[data-blog-category-filter]').forEach(button => {
      const active = button.dataset.blogCategoryFilter === activeBlogCategory;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-blog-tag]').forEach(button => {
      const active = button.dataset.blogTag === activeBlogTag;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const empty = document.querySelector('#blog-filter-empty');
    if (empty) empty.hidden = visible > 0;
  }

  function getCompared() {
    try {
      const value = JSON.parse(localStorage.getItem(compareKey) || '[]');
      return Array.isArray(value) ? value.filter(item => item && item.id && item.name).slice(0, maxCompare) : [];
    } catch (_) {
      return [];
    }
  }

  function saveCompared(items) {
    localStorage.setItem(compareKey, JSON.stringify(items));
    if (document.querySelector('[data-compare-page]')) {
      const query = items.length ? `?items=${items.map(item => encodeURIComponent(item.id)).join(',')}` : location.pathname;
      history.replaceState(null, '', query);
    }
    renderCompared(items);
  }

  function renderCompared(items = getCompared()) {
    const selected = new Set(items.map(item => item.id));
    document.querySelectorAll('[data-compare-toggle]').forEach(button => {
      const active = selected.has(button.dataset.compareToggle);
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
      if (button.classList.contains('compare-option')) {
        const mark = button.querySelector('.compare-check');
        if (mark) mark.textContent = active ? '✓' : '＋';
      } else if (!button.classList.contains('compare-remove')) {
        button.textContent = active ? '已加入' : (button.closest('.airport-row') ? '对比' : '加入对比');
      }
    });

    const pageCount = document.querySelector('#compare-page-count');
    if (pageCount) pageCount.textContent = String(items.length);
    const comparePage = document.querySelector('[data-compare-page]');
    if (comparePage) comparePage.classList.toggle('has-comparison', items.length >= 2 && !compareExpanded);
    const expandButton = document.querySelector('[data-compare-expand]');
    if (expandButton) {
      expandButton.hidden = items.length < 2;
      expandButton.textContent = compareExpanded ? '收起选择' : '更换或添加';
    }
    document.querySelectorAll('.compare-option').forEach(option => {
      option.hidden = items.length >= 2 && !compareExpanded && !selected.has(option.dataset.compareToggle);
    });
    document.querySelectorAll('[data-compare-card]').forEach(card => {
      card.hidden = !selected.has(card.dataset.compareCard);
    });
    const results = document.querySelector('#compare-results');
    if (results) results.dataset.count = String(items.length);
    const empty = document.querySelector('#compare-empty');
    if (empty) empty.hidden = items.length > 0;

    const verdicts = document.querySelector('#compare-verdicts');
    const verdictGrid = document.querySelector('#compare-verdict-grid');
    if (verdicts && verdictGrid) {
      verdicts.hidden = items.length < 2;
      if (items.length >= 2) {
        const selectedOptions = items.map(item => document.querySelector(`.compare-option[data-compare-toggle="${item.id}"]`)).filter(Boolean);
        const cheapest = [...selectedOptions].sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price))[0];
        const topRated = [...selectedOptions].sort((a, b) => Number(b.dataset.rating) - Number(a.dataset.rating))[0];
        const trial = selectedOptions.find(option => option.dataset.trial === 'true');
        const specialist = selectedOptions.find(option => option.dataset.premium === 'true') || selectedOptions.find(option => option.dataset.media === 'true');
        const cards = [
          ['价格更低', cheapest?.dataset.compareName, `最低月费 ￥${Number(cheapest?.dataset.price || 0).toFixed(2)}`],
          ['综合推荐', topRated?.dataset.compareName, `${Number(topRated?.dataset.rating || 0).toFixed(1)} / 5 推荐指数`],
          trial ? ['可以先试用', trial.dataset.compareName, '适合先验证再付费'] : ['首次购买', cheapest?.dataset.compareName, '当前候选均建议先月付'],
          specialist ? ['专项需求', specialist.dataset.compareName, specialist.dataset.premium === 'true' ? '更偏向专线与稳定性' : '更偏向流媒体解锁'] : ['性价比选择', cheapest?.dataset.compareName, '先从低成本方案验证']
        ];
        verdictGrid.innerHTML = cards.map(([label, name, note]) => `<article><span>${label}</span><strong>${name || '—'}</strong><small>${note}</small></article>`).join('');
      }
    }
  }

  function toggleCompared(button) {
    const id = button.dataset.compareToggle;
    const name = button.dataset.compareName;
    const items = getCompared();
    const index = items.findIndex(item => item.id === id);
    if (index >= 0) {
      items.splice(index, 1);
      saveCompared(items);
      showToast(`已移除 ${name}`);
      return;
    }
    if (items.length >= maxCompare) {
      showToast('最多同时对比 3 家机场，请先移除一家');
      return;
    }
    items.push({ id, name });
    saveCompared(items);
    showToast(`已加入 ${name}`);
  }

  if (document.querySelector('[data-compare-page]')) {
    const params = new URLSearchParams(location.search);
    const requested = (params.get('items') || '').split(',').filter(Boolean).slice(0, maxCompare);
    if (requested.length) {
      const options = [...document.querySelectorAll('.compare-option')];
      const items = requested.map(id => {
        const option = options.find(button => button.dataset.compareToggle === id);
        return option ? { id, name: option.dataset.compareName } : null;
      }).filter(Boolean);
      if (items.length) localStorage.setItem(compareKey, JSON.stringify(items));
    }
  }
  renderCompared();

  document.addEventListener('click', event => {
    const copyControl = event.target.closest('[data-copy-value]');
    if (copyControl) copyText(copyControl.dataset.copyValue);

    const toastControl = event.target.closest('[data-toast]');
    if (toastControl) showToast(toastControl.dataset.toast);

    const filter = event.target.closest('[data-filter]');
    if (filter) activateFilter(filter.dataset.filter);

    const filterLink = event.target.closest('[data-filter-link]');
    if (filterLink) setTimeout(() => activateFilter(filterLink.dataset.filterLink), 40);

    const softwareFilter = event.target.closest('[data-software-filter]');
    if (softwareFilter) activateSoftwareFilter(softwareFilter.dataset.softwareFilter);

    const blogCategory = event.target.closest('[data-blog-category-filter]');
    if (blogCategory) {
      activeBlogCategory = blogCategory.dataset.blogCategoryFilter;
      activateBlogFilters();
    }

    const blogTag = event.target.closest('[data-blog-tag]');
    if (blogTag) {
      activeBlogTag = blogTag.dataset.blogTag;
      activateBlogFilters();
    }

    const compareToggle = event.target.closest('[data-compare-toggle]');
    if (compareToggle) toggleCompared(compareToggle);

    const compareClear = event.target.closest('[data-compare-clear]');
    if (compareClear) {
      saveCompared([]);
      showToast('已清空对比列表');
    }

    const compareExpand = event.target.closest('[data-compare-expand]');
    if (compareExpand) {
      compareExpanded = !compareExpanded;
      renderCompared();
    }
  });
});
