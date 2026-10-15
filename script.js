        // Año automático en el footer
        document.getElementById('year').textContent = new Date().getFullYear();

        // Mostrar elementos al hacer scroll
        const items = document.querySelectorAll('.gallery-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), (i % 4) * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        items.forEach(item => observer.observe(item));

        // Botón volver arriba
        const toTop = document.getElementById('toTop');
        window.addEventListener('scroll', () => {
            toTop.classList.toggle('show', window.scrollY > 600);
        }, { passive: true });
        toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // Visor de imágenes con navegación
        const lightbox = document.getElementById('lightbox');
        const lbImg = document.getElementById('lbImg');
        const lbCaption = document.getElementById('lbCaption');
        let currentList = [];
        let currentIndex = 0;
        let lastFocused = null;

        function openLightbox(list, index) {
            currentList = list;
            currentIndex = index;
            lastFocused = document.activeElement;
            showImage();
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
            lightbox.querySelector('.lb-close').focus();
        }

        function showImage() {
            const img = currentList[currentIndex];
            lbImg.src = img.src;
            lbImg.alt = img.alt;
            lbCaption.textContent = `${img.alt}  (${currentIndex + 1} / ${currentList.length})`;
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
            if (lastFocused) lastFocused.focus();
        }

        function step(dir) {
            currentIndex = (currentIndex + dir + currentList.length) % currentList.length;
            showImage();
        }

        document.querySelectorAll('[data-gallery]').forEach(grid => {
            const imgs = [...grid.querySelectorAll('img')];
            grid.querySelectorAll('.gallery-item').forEach((item, i) => {
                item.setAttribute('tabindex', '0');
                item.setAttribute('role', 'button');
                item.addEventListener('click', () => openLightbox(imgs, i));
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(imgs, i);
                    }
                });
            });
        });

        lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
        lightbox.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); step(1); });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') step(-1);
            if (e.key === 'ArrowRight') step(1);
        });

        // Deslizar en móvil para cambiar de imagen
        let touchX = null;
        lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
        lightbox.addEventListener('touchend', (e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchX = null;
        });