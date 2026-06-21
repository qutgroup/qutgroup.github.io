// 访客申请 H5 Demo 交互脚本
// 功能：来访日期自动显示为今天；卡片跳转；复制按钮；详情页时间自动同步。

function formatDate(date) {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function getTodayDate() {
  return formatDate(new Date());
}

function getDateOffset(days) {
  var date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

function showToast(text) {
  var toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 1400);
}

document.addEventListener('DOMContentLoaded', function () {
  var today = getTodayDate();
  var submitDate = getDateOffset(-2);

  // 列表页：自动把所有来访日期改成今天，时间从 data-time 读取。
  document.querySelectorAll('.visit-time').forEach(function (item) {
    var time = item.getAttribute('data-time') || '08:00';
    item.textContent = '来访时间：' + today + ' ' + time;
  });

  // 列表页：同步生成复制内容。
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    var time = btn.getAttribute('data-time') || '08:00';
    var dept = btn.getAttribute('data-dept') || '';
    btn.setAttribute('data-copy', today + ' ' + time + ' ' + dept);
  });

  // 列表页：点击卡片进入详情页。
  document.querySelectorAll('.visit-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var link = card.getAttribute('data-link');
      if (link) window.location.href = link;
    });
  });

  // 列表页：点击复制按钮，不触发卡片跳转。
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      event.stopPropagation();
      var text = btn.getAttribute('data-copy') || '';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast('已复制');
        }).catch(function () {
          showToast('已复制');
        });
      } else {
        showToast('已复制');
      }
    });
  });

  // 添加按钮演示提示。
  var addBtn = document.querySelector('.add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      showToast('演示版：可在此跳转到新增申请页');
    });
  }

  // 详情页：自动同步时间。
  // 来访时间：当日 08:00~当日 18:00
  // 提交时间：当日日期 - 2 天 09:39
  document.querySelectorAll('.info-row').forEach(function (row) {
    var label = row.querySelector('span');
    var value = row.querySelector('strong');
    if (!label || !value) return;

    var labelText = label.textContent.trim();
    if (labelText === '来访时间') {
      value.textContent = today + ' 08:00~' + today + ' 18:00';
    }
    if (labelText === '提交时间') {
      value.textContent = submitDate + ' 09:39';
    }
  });
});

// 详情页：点击自拍照放大预览
function initPhotoPreview() {
  var photos = document.querySelectorAll('.proof-photo');
  if (!photos.length) return;

  var viewer = document.createElement('div');
  viewer.className = 'photo-viewer';
  viewer.innerHTML = '<button class="photo-viewer-close" type="button" aria-label="关闭">×</button><img src="" alt="放大照片">';
  document.body.appendChild(viewer);

  var viewerImg = viewer.querySelector('img');
  var closeBtn = viewer.querySelector('.photo-viewer-close');

  function openViewer(src) {
    viewerImg.src = src;
    viewer.classList.add('show');
    document.body.classList.add('preview-open');
  }

  function closeViewer() {
    viewer.classList.remove('show');
    document.body.classList.remove('preview-open');
    viewerImg.src = '';
  }

  photos.forEach(function (photo) {
    photo.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      openViewer(photo.getAttribute('src'));
    });

    // 禁止长按图片弹出系统菜单，避免影响演示效果。
    photo.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });
  });

  closeBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    closeViewer();
  });

  viewer.addEventListener('click', function (event) {
    if (event.target === viewer) {
      closeViewer();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeViewer();
    }
  });
}

initPhotoPreview();
