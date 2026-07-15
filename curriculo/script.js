/* ========================================================
   CURRÍCULO — Gustavo Luiz Heck
   Interactive Scripts
   ======================================================== */

const translations = {
    "pt": {
        "hero-greeting": "Currículo",
        "hero-prefix": "Estudante de Engenharia Mecânica na UDESC-CCT",
        "nav-home": "Início",
        "nav-objective": "Objetivo",
        "nav-education": "Formação",
        "nav-experience": "Experiência",
        "nav-skills": "Habilidades",
        "nav-modules": "Módulos",
        "nav-projects": "Projetos",
        "nav-certs": "Certificações",
        "sec-objective": "Objetivo",
        "sec-education": "Formação Acadêmica",
        "sec-experience": "Experiência",
        "sec-skills": "Habilidades Técnicas",
        "sec-modules": "Formação Técnica — Módulos",
        "sec-projects-title": "Projetos Técnicos",
        "sec-certifications-title": "Certificações e Cursos",
        "empty-projects-msg": "Nenhum projeto técnico listado. Edite o arquivo HTML usando o template comentado para adicionar.",
        "empty-certs-msg": "Nenhuma certificação listada. Edite o arquivo HTML usando o template comentado para adicionar.",
        "objetivo-text": "Estudante de Engenharia Mecânica na 6ª fase com formação técnica em Automação Industrial, em busca de <strong>estágio</strong> que me permita aplicar e aprofundar meu perfil multidisciplinar em mecânica, eletrônica e automação. Com experiência em gestão de projetos em empresa júnior e pesquisa aplicada em robótica móvel, tenho interesse em áreas como <strong>Automação e Controle</strong>, <strong>Projetos</strong> e <strong>Engenharia de Sistemas</strong>.",
        "skills-radar-labels": ["CAD/3D", "Programação", "Simulação", "Automação", "Fabricação", "Idiomas"]
    },
    "en": {
        "hero-greeting": "Resume",
        "hero-prefix": "Mechanical Engineering Student at UDESC-CCT",
        "nav-home": "Home",
        "nav-objective": "Objective",
        "nav-education": "Education",
        "nav-experience": "Experience",
        "nav-skills": "Skills",
        "nav-modules": "Modules",
        "nav-projects": "Projects",
        "nav-certs": "Certifications",
        "sec-objective": "Objective",
        "sec-education": "Academic Education",
        "sec-experience": "Professional Experience",
        "sec-skills": "Technical Skills",
        "sec-modules": "Technical Training — Modules",
        "sec-projects-title": "Technical Projects",
        "sec-certifications-title": "Certifications & Courses",
        "empty-projects-msg": "No technical projects listed. Edit the HTML file using the commented template to add yours.",
        "empty-certs-msg": "No certifications listed. Edit the HTML file using the commented template to add yours.",
        "objetivo-text": "Mechanical Engineering student in the 6th semester with a technical background in Industrial Automation, seeking an <strong>internship</strong> to apply and deepen my multidisciplinary profile in mechanics, electronics, and automation. Experienced in project management in a junior enterprise and applied research in mobile robotics, I am interested in areas such as <strong>Automation & Control</strong>, <strong>Engineering Design</strong>, and <strong>Systems Engineering</strong>.",
        "skills-radar-labels": ["CAD/3D", "Programming", "Simulation", "Automation", "Fabrication", "Languages"]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // ── Global State ──
    let currentLang = localStorage.getItem('cv-lang') || 'pt';
    let skillsChart = null;

    // ── Theme Toggle ──
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    const savedTheme = localStorage.getItem('cv-theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('cv-theme', next);
        updateChartTheme(next);
    });

    // ── Language Toggle ──
    const langToggle = document.getElementById('lang-toggle');
    const langText = langToggle.querySelector('.lang-text');

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('cv-lang', lang);
        langText.textContent = lang === 'pt' ? 'EN' : 'PT';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update chart labels
        if (skillsChart) {
            skillsChart.data.labels = translations[lang]["skills-radar-labels"];
            skillsChart.update();
        }
    }

    langToggle.addEventListener('click', () => {
        const nextLang = currentLang === 'pt' ? 'en' : 'pt';
        applyLanguage(nextLang);
    });

    // ── Typing Animation ──
    const typingText = document.getElementById('typing-text');
    const titles = [
        "Automação & Controle",
        "Projetos Mecânicos",
        "Engenharia de Sistemas"
    ];
    const titlesEN = [
        "Automation & Control",
        "Mechanical Design",
        "Systems Engineering"
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const list = currentLang === 'pt' ? titles : titlesEN;
        const currentTitle = list[titleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 100;

        if (!isDeleting && charIndex === currentTitle.length) {
            speed = 1500; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % list.length;
            speed = 500; // Pause before typing next
        }

        setTimeout(typeEffect, speed);
    }

    // ── Scroll Spy ──
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.scrollspy-nav .nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ── Skills Radar Chart ──
    const canvas = document.getElementById('skills-radar-chart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const initialTheme = root.getAttribute('data-theme');
        
        function getChartColors(theme) {
            const isDark = theme === 'dark';
            return {
                grid: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                angleLines: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                ticks: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                pointLabel: isDark ? '#E2E8F0' : '#0F172A',
                fill: 'rgba(59, 130, 246, 0.2)',
                border: '#3B82F6'
            };
        }

        let colors = getChartColors(initialTheme);

        skillsChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: translations[currentLang]["skills-radar-labels"],
                datasets: [{
                    label: 'Nível',
                    data: [85, 80, 70, 75, 60, 65], // CAD, Prog, Simul, Auto, Fab, Idiomas
                    backgroundColor: colors.fill,
                    borderColor: colors.border,
                    borderWidth: 2,
                    pointBackgroundColor: colors.border,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: colors.border
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: colors.angleLines },
                        grid: { color: colors.grid },
                        pointLabels: {
                            color: colors.pointLabel,
                            font: { family: 'Outfit', size: 13, weight: '500' }
                        },
                        ticks: {
                            color: colors.ticks,
                            backdropColor: 'transparent',
                            stepSize: 20
                        },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        function updateChartTheme(theme) {
            if (!skillsChart) return;
            const newColors = getChartColors(theme);
            skillsChart.options.scales.r.angleLines.color = newColors.angleLines;
            skillsChart.options.scales.r.grid.color = newColors.grid;
            skillsChart.options.scales.r.pointLabels.color = newColors.pointLabel;
            skillsChart.options.scales.r.ticks.color = newColors.ticks;
            skillsChart.update();
        }
    }

    // Initialize Language & Typing after setup
    applyLanguage(currentLang);
    typeEffect();

    // ── Scroll Reveal Animation ──
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.closest('.skills-grid, .experience-grid')
                    ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
                    : 0;

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── Print: Force all accordion items open ──
    window.addEventListener('beforeprint', () => {
        document.querySelectorAll('.accordion-item').forEach(item => {
            item.setAttribute('open', '');
        });
    });
});
