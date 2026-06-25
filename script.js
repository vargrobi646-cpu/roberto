// ============================================
// SCRIPT PARA PÁGINA DE DISCRIMINACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. MANEJO DEL FORMULARIO DE CONTACTO
    // ==========================================
    
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Mostrar mensaje de carga
            status.textContent = '⏳ Enviando mensaje...';
            status.className = 'form-status-disc';
            status.style.color = '#ff6b6b';
            
            // Deshabilitar botón para evitar múltiples envíos
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Enviando...</span> <i class="fas fa-spinner fa-spin"></i>';
            
            // Enviar datos con Fetch API
            fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    status.textContent = '✅ ¡Mensaje enviado con éxito! Te responderemos pronto.';
                    status.className = 'form-status-disc success';
                    status.style.color = '#2e7d32';
                    form.reset();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Error al enviar');
                    });
                }
            })
            .catch(error => {
                status.textContent = '❌ Hubo un error al enviar. Intenta de nuevo.';
                status.className = 'form-status-disc error';
                status.style.color = '#c62828';
                console.error('Error:', error);
            })
            .finally(() => {
                // Rehabilitar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Enviar mensaje</span> <i class="fas fa-paper-plane"></i>';
            });
        });
    }

    // ==========================================
    // 2. SCROLL SUAVE PARA ENLACES DE NAVEGACIÓN
    // ==========================================
    
    const navLinks = document.querySelectorAll('.nav-links-disc a, .nav-cta-disc');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Verificar si es un enlace interno (comienza con #)
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Desplazamiento suave
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ==========================================
    // 3. ANIMACIÓN DE ESTADÍSTICAS (CONTADORES)
    // ==========================================
    
    const statNumbers = document.querySelectorAll('.stat-number-disc');
    
    // Función para animar contadores
    function animateCounters() {
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            // Verificar si el texto contiene números
            if (/\d/.test(text)) {
                // Extraer el número (puede tener K, M, %, etc.)
                const numMatch = text.match(/(\d+\.?\d*)([KkMm%]?)/);
                if (numMatch) {
                    let baseNumber = parseFloat(numMatch[1]);
                    const suffix = numMatch[2] || '';
                    let targetNumber = baseNumber;
                    
                    // Convertir K a miles, M a millones
                    if (suffix.toLowerCase() === 'k') {
                        targetNumber = baseNumber * 1000;
                    } else if (suffix.toLowerCase() === 'm') {
                        targetNumber = baseNumber * 1000000;
                    } else if (suffix === '%') {
                        targetNumber = baseNumber;
                    }
                    
                    // Animación
                    let current = 0;
                    const increment = Math.ceil(targetNumber / 30);
                    const duration = 1500;
                    const steps = 30;
                    const stepTime = duration / steps;
                    
                    let interval = setInterval(() => {
                        current += increment;
                        if (current >= targetNumber) {
                            current = targetNumber;
                            clearInterval(interval);
                        }
                        
                        // Formatear número
                        let displayNum = current;
                        let displaySuffix = '';
                        
                        if (current >= 1000000) {
                            displayNum = (current / 1000000).toFixed(1);
                            displaySuffix = 'M';
                        } else if (current >= 1000) {
                            displayNum = (current / 1000).toFixed(1);
                            displaySuffix = 'K';
                        }
                        
                        if (Number.isInteger(displayNum) || displayNum % 1 === 0) {
                            displayNum = Math.floor(displayNum);
                        }
                        
                        if (typeof displayNum === 'number' && Number.isInteger(displayNum)) {
                            displayNum = displayNum.toString();
                        }
                        
                        if (targetNumber < 1000) {
                            stat.textContent = Math.floor(current);
                        } else {
                            stat.textContent = displayNum + displaySuffix;
                        }
                        
                        if (suffix === '%' && current >= targetNumber) {
                            stat.textContent = Math.floor(current) + '%';
                        }
                    }, stepTime);
                }
            }
        });
    }

    // ==========================================
    // 4. OBSERVADOR DE INTERSECCIÓN PARA ESTADÍSTICAS
    // ==========================================
    
    const statsSection = document.querySelector('#datos');
    let statsAnimated = false;
    
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    setTimeout(animateCounters, 500);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsSection);
    }

    // ==========================================
    // 5. EFECTO DE PARALLAX EN EL HERO
    // ==========================================
    
    const hero = document.querySelector('.hero-disc');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            if (scrollPosition < 500) {
                hero.style.backgroundPositionY = scrollPosition * 0.3 + 'px';
            }
        });
    }

    // ==========================================
    // 6. VALIDACIÓN DE ENLACES EXTERNOS
    // ==========================================
    
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
        if (!link.getAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // ==========================================
    // 7. MOSTRAR AÑO ACTUAL EN EL FOOTER
    // ==========================================
    
    const footerYear = document.querySelector('.footer-bottom-disc p');
    if (footerYear) {
        const year = new Date().getFullYear();
        footerYear.textContent = footerYear.textContent.replace('2026', year);
    }

    // ==========================================
    // 8. MENSAJE EN CONSOLA
    // ==========================================
    
    console.log('%c⚖️ Discriminación - Igualdad y Respeto', 'font-size: 20px; font-weight: bold; color: #ff6b6b;');
    console.log('%cSitio educativo sin fines de lucro.', 'font-size: 14px; color: #4a4a5a;');
    console.log('%cSi sufres discriminación, llama al 911 o visita la sección de recursos.', 'font-size: 14px; color: #ff6b6b;');

    // ==========================================
    // 9. COMPORTAMIENTO DEL TELÉFONO
    // ==========================================
    
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true;
            } else {
                e.preventDefault();
                alert('📞 En dispositivos móviles, este enlace te permitirá llamar al número de emergencia.');
            }
        });
    });

    // ==========================================
    // 10. MENÚ HAMBURGUESA PARA MÓVILES
    // ==========================================
    
    // Nota: Si agregas un menú hamburguesa en el HTML, este código lo activará
    // Por ahora no está implementado en el HTML, pero puedes agregarlo después

    console.log('✅ Todos los scripts cargados correctamente.');
});