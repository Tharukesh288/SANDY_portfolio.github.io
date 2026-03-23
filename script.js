document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top
    const backToTopBtn = document.querySelector('.back-to-top');
    if(backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Skills Animation on Scroll
    const skillItems = document.querySelectorAll('.skill-item');
    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.skill-fill');
                const percentageEl = entry.target.querySelector('.skill-percentage');
                const targetValue = parseInt(percentageEl.getAttribute('data-target'));
                
                // Animate progress bar
                fill.style.width = targetValue + '%';
                
                // Animate numbers
                let currentValue = 0;
                const updateCounter = () => {
                    const increment = targetValue / 50;
                    if (currentValue < targetValue) {
                        currentValue += increment;
                        percentageEl.innerText = Math.ceil(currentValue) + '%';
                        setTimeout(updateCounter, 20);
                    } else {
                        percentageEl.innerText = targetValue + '%';
                    }
                };
                updateCounter();
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    };

    const skillsObserver = new IntersectionObserver(animateSkills, {
        threshold: 0.5
    });

    skillItems.forEach(item => {
        skillsObserver.observe(item);
    });

    // Parallax effect on floating tools
    const floatingTools = document.querySelectorAll('.tool-icon');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        floatingTools.forEach((tool, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            // Combining float animation from css with js translation via a wrapper could be better
            // but for simplicity, we use margin translation for parallax to separate from CSS transform
            tool.style.marginLeft = `${xOffset}px`;
            tool.style.marginTop = `${yOffset}px`;
        });
    });

    // Horizontal Scroll for Work Section
    const workSection = document.querySelector('.work-section');
    const projectsContainer = document.querySelector('.projects-container');
    
    // Convert vertical scroll to horizontal in the horizontal container
    if (window.innerWidth > 768 && projectsContainer && workSection) {
        projectsContainer.addEventListener('wheel', (e) => {
            const maxScrollLeft = projectsContainer.scrollWidth - projectsContainer.clientWidth;
            
            if (e.deltaY !== 0) {
                // If not at the bounds of horizontal scroll, prevent default vertical and do horizontal
                if ((projectsContainer.scrollLeft < maxScrollLeft && e.deltaY > 0) || 
                    (projectsContainer.scrollLeft > 0 && e.deltaY < 0)) {
                    e.preventDefault();
                    projectsContainer.scrollLeft += e.deltaY;
                }
            }
        });
    }

    // Drag to scroll for horizontal container
    let isDown = false;
    let startX;
    let scrollLeft;

    if(projectsContainer) {
        projectsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            projectsContainer.classList.add('active');
            startX = e.pageX - projectsContainer.offsetLeft;
            scrollLeft = projectsContainer.scrollLeft;
        });
        projectsContainer.addEventListener('mouseleave', () => {
            isDown = false;
            projectsContainer.classList.remove('active');
        });
        projectsContainer.addEventListener('mouseup', () => {
            isDown = false;
            projectsContainer.classList.remove('active');
        });
        projectsContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - projectsContainer.offsetLeft;
            const walk = (x - startX) * 2; // scroll-fast multiplier
            projectsContainer.scrollLeft = scrollLeft - walk;
        });
    }
});
