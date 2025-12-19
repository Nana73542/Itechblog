/* ===== MODERNIZED ECONOMICS PAGE SCRIPT WITH AUTO-FILE UPLOAD ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== VIEW-FIRST PDF LOGIC =====
  document.querySelectorAll('.year-block').forEach(block => {
    const iframe = block.querySelector('.pdf-viewer iframe');
    const downloadBtn = block.querySelector('.pdf-download a');

    iframe.addEventListener('load', () => {
      downloadBtn.classList.add('enabled');
    });
  });

  // ===== ANSWERS TOGGLE =====
  document.querySelectorAll('.answers-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      const answers = btn.closest('.year-block').querySelector('.answers-viewer');
      answers.classList.toggle('show'); // Use CSS max-height animation
      btn.textContent = answers.classList.contains('show') ? 'Hide Solution' : 'View Solution';
    });
  });

  // ===== SEARCH / FILTER BY YEAR =====
  const searchInput = document.getElementById('yearSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const value = searchInput.value.trim();
      document.querySelectorAll('.year-block').forEach(block => {
        const year = block.querySelector('h2').textContent.match(/\d{4}/)?.[0] || '';
        block.style.display = year.includes(value) ? 'block' : 'none';
      });
    });
  }

  // ===== BACK TO TOP BUTTON =====
  const backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ===== DROPDOWN YEAR SELECT =====
  const yearSelect = document.getElementById('yearSelect');
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      const year = yearSelect.value;
      if (!year) return;

      const block = document.querySelector('.year-block');
      const pdf = block.querySelector('.pdf-viewer iframe');
      const pdfDownload = block.querySelector('.pdf-download a');
      const solution = block.querySelector('.answers-viewer iframe');
      const videos = block.querySelectorAll('.video-section video');
      const images = block.querySelectorAll('.image-section img');
      const title = block.querySelector('h2');

      title.textContent = `Economics – ${year}`;
      pdf.src = `docs/economics/${year}/PassQuestions.pdf`;
      pdfDownload.href = `docs/economics/${year}/PassQuestions.pdf`;
      solution.src = `docs/economics/${year}/Solution.pdf`;
      solution.parentElement.classList.remove('show');

      videos.forEach((video, i) => {
        video.src = `videos/economics/${year}/tutorial${i + 1}.mp4`;
      });

      images.forEach((img, i) => {
        img.src = `images/economics/${year}/image${i + 1}.jpg`;
        img.alt = `Economics ${year} Image ${i + 1}`;
      });

      block.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===== ADMIN FILE UPLOAD (FILESTACK AUTO-POPULATE) =====
  const uploadBtn = document.getElementById('uploadAdminBtn');
  const logoutBtn = document.getElementById('logoutAdminBtn');
  let isAdmin = true; // Set to true for admin mode

  if (uploadBtn && logoutBtn) {
    uploadBtn.style.display = logoutBtn.style.display = isAdmin ? 'block' : 'none';

    const client = filestack.init('AfJtcERVSWKy85qASuvobz'); // Your API Key

    uploadBtn.addEventListener('click', () => {
      const selectedYear = yearSelect.value;
      if (!selectedYear) {
        alert('Please select a year first!');
        return;
      }

      const block = document.querySelector('.year-block');
      const pdf = block.querySelector('.pdf-viewer iframe');
      const pdfDownload = block.querySelector('.pdf-download a');
      const solution = block.querySelector('.answers-viewer iframe');
      const videos = block.querySelectorAll('.video-section video');
      const images = block.querySelectorAll('.image-section img');

      client.picker({
        fromSources: ['local_file_system','url','googledrive','dropbox'],
        accept: ['application/pdf','image/*','video/*'],
        maxFiles: 5,
        onUploadDone: res => {
          res.filesUploaded.forEach(file => {
            const ext = file.filename.split('.').pop().toLowerCase();
            if (ext === 'pdf') {
              // Determine if it's a solution or question PDF
              if (file.filename.toLowerCase().includes('solution')) {
                solution.src = file.url;
                solution.parentElement.classList.remove('show');
              } else {
                pdf.src = file.url;
                pdfDownload.href = file.url;
              }
            } else if (['mp4','mov','webm'].includes(ext)) {
              // Fill first available video slot
              const emptyVideo = Array.from(videos).find(v => !v.src);
              if (emptyVideo) emptyVideo.src = file.url;
            } else if (['jpg','jpeg','png','gif'].includes(ext)) {
              const emptyImg = Array.from(images).find(img => !img.src);
              if (emptyImg) {
                emptyImg.src = file.url;
                emptyImg.alt = `${selectedYear} Uploaded Image`;
              }
            }
          });

          alert('Files uploaded and inserted successfully!');
        }
      }).open();
    });

    logoutBtn.addEventListener('click', () => {
      isAdmin = false;
      uploadBtn.style.display = logoutBtn.style.display = 'none';
      alert('Logged out from admin mode.');
    });
  }

});
let isAdmin = true; // Set to true so buttons are visible
document.addEventListener('DOMContentLoaded', () => {
  const uploadBtn = document.getElementById('uploadAdminBtn');
  const logoutBtn = document.getElementById('logoutAdminBtn');

  if (isAdmin && uploadBtn && logoutBtn) {
    uploadBtn.style.display = 'block';
    logoutBtn.style.display = 'block';

    const client = filestack.init('AfJtcERVSWKy85qASuvobz');

    uploadBtn.addEventListener('click', () => {
      client.picker({
        fromSources: ['local_file_system', 'url', 'googledrive', 'dropbox'],
        onUploadDone: res => {
          const url = res.filesUploaded[0].url;
          alert(`Upload successful! File URL: ${url}`);
        }
      }).open();
    });

    logoutBtn.addEventListener('click', () => {
      isAdmin = false;
      uploadBtn.style.display = 'none';
      logoutBtn.style.display = 'none';
      alert('Logged out from admin mode.');
    });
  }
});

if (isAdmin && uploadBtn && logoutBtn) {
  // Show buttons
  [uploadBtn, logoutBtn].forEach(btn => btn.style.display = 'block');

  // Initialize Filestack
  const client = filestack.init('AfJtcERVSWKy85qASuvobz');

  uploadBtn.addEventListener('click', () => {
    client.picker({
      fromSources: ['local_file_system', 'url', 'googledrive', 'dropbox'],
      onUploadDone: res => {
        const url = res.filesUploaded[0].url;
        alert(`Upload successful! File URL: ${url}`);
      }
    }).open();
  });

  logoutBtn.addEventListener('click', () => {
    isAdmin = false;
    uploadBtn.style.display = logoutBtn.style.display = 'none';
    alert('Logged out from admin mode.');
  });
}