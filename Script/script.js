document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});

// Intersection Observer for section animations
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    observer.observe(section);
});

// Form submission handling
// const form = document.querySelector('.contact-form');
// form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     // Add your form submission logic here
//     alert('Message sent! (Demo only)');
// });

const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

timelineItems.forEach(item => {
    item.style.animationPlayState = 'paused';
    timelineObserver.observe(item);
});

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded');
    window.scrollTo(0, 0);
    try {
        await fetchAndDisplayProjects();
        await fetchAndDisplayEducation();
    } catch (error) {
        console.error('Error:', error);
    }
});

// async function fetchAndDisplayProjects() {
//     try {
//         const response = await fetch('./Data/projects.json');
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log('Projects:', data);
//         const projectsGrid = document.querySelector('.projects-grid');
//         data.forEach(project => {
//             const projectLink = document.createElement('a');
//             projectLink.href = project.link;
//             projectLink.target = '_blank';
//             projectLink.rel = 'noopener noreferrer';
//             projectLink.classList.add('project-card'); // Make the link act as the card
            
//             const projectImage = document.createElement('img');
//             projectImage.src = project.image;
//             projectImage.alt = project.title;
            
//             const projectContent = document.createElement('div');
//             projectContent.classList.add('project-content');
            
//             const projectTitle = document.createElement('h3');
//             projectTitle.textContent = project.title;
            
//             const projectDescription = document.createElement('p');
//             projectDescription.textContent = project.description;
            
//             const projectTechStack = document.createElement('p');
//             projectTechStack.innerHTML = `<strong>Technology Used:</strong> ${project.technologyUsed}`;
            
//             projectContent.appendChild(projectTitle);
//             projectContent.appendChild(projectDescription);
//             projectContent.appendChild(projectTechStack);
//             projectLink.appendChild(projectImage);
//             projectLink.appendChild(projectContent);
//             projectsGrid.appendChild(projectLink);
//         });
//     } catch (error) {
//         console.error('Error fetching project data:', error);
//     }
// }
async function fetchAndDisplayProjects() {
    try {
        const response = await fetch('./Data/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        const carousel = document.querySelector('.carousel');
        const pagination = document.querySelector('.pagination');
        let currentIndex = 0;

        // Create project cards
        data.forEach((project, index) => {
            const projectLink = document.createElement('a');
            projectLink.href = project.link;
            projectLink.target = '_blank';
            projectLink.rel = 'noopener noreferrer';
            projectLink.classList.add('project-card');
            if (index === 0) projectLink.classList.add('active-card');
            
            // Add your existing project card content
            const projectImage = document.createElement('img');
            projectImage.src = project.image;
            projectImage.alt = project.title;
            
            const projectContent = document.createElement('div');
            projectContent.classList.add('project-content');
            
            const projectTitle = document.createElement('h3');
            projectTitle.textContent = project.title;
            
            const projectDescription = document.createElement('p');
            projectDescription.textContent = project.description;
            
            const projectTechStack = document.createElement('p');
            projectTechStack.innerHTML = `<strong>Technology Used:</strong> ${project.technologyUsed}`;
            
            projectContent.appendChild(projectTitle);
            projectContent.appendChild(projectDescription);
            projectContent.appendChild(projectTechStack);
            projectLink.appendChild(projectImage);
            projectLink.appendChild(projectContent);
            
            carousel.appendChild(projectLink);

            // Create pagination dot
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('data-index', index);
            pagination.appendChild(dot);
        });

        // Add carousel functionality
        const cards = document.querySelectorAll('.project-card');
        const dots = document.querySelectorAll('.dot');
        const totalCards = cards.length;

        function arrangeCards() {
            cards.forEach((card, index) => {
                const offset = index - currentIndex;
                const zIndex = 5 - Math.abs(offset);
                const opacity = offset === 0 ? 1 : 0.7;
                const scale = offset === 0 ? 1.1 : 0.8;
                const translateX = offset * 60 + '%';
                const translateZ = offset === 0 ? '50px' : '0';
                
                card.style.transform = `translateX(${translateX}) scale(${scale}) translateZ(${translateZ})`;
                card.style.zIndex = zIndex;
                card.style.opacity = opacity;
                
                if (offset === 0) {
                    card.classList.add('active-card');
                } else {
                    card.classList.remove('active-card');
                }
            });

            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        arrangeCards(); // Initial arrangement

        // Navigation functions
        function goToNext() {
            currentIndex = (currentIndex + 1) % totalCards;
            arrangeCards();
        }

        function goToPrev() {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            arrangeCards();
        }

        // Event listeners
        document.querySelector('.nav-prev').addEventListener('click', goToPrev);
        document.querySelector('.nav-next').addEventListener('click', goToNext);
        
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                currentIndex = parseInt(this.getAttribute('data-index'));
                arrangeCards();
            });
        });

    } catch (error) {
        console.error('Error fetching project data:', error);
    }
}

async function fetchAndDisplayEducation() {
    try {
        const response = await fetch('./Data/education.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Sort data by comparing years (extract first year from date string)
        const sortedData = data.sort((a, b) => {
            const yearA = parseInt(a.date.split(' ')[0]);
            const yearB = parseInt(b.date.split(' ')[0]);
            return yearB - yearA;
        });

        const educationContainer = document.querySelector('.education-container');
        
        // Add timeline line
        const timelineLine = document.createElement('div');
        timelineLine.classList.add('timeline-line');
        educationContainer.appendChild(timelineLine);
        
        sortedData.forEach((education, index) => {
            const educationItem = document.createElement('div');
            educationItem.classList.add('education-item');
            
            const timelineDot = document.createElement('div');
            timelineDot.classList.add('timeline-dot');
            
            const timelineContent = document.createElement('div');
            timelineContent.classList.add('timeline-content');
            
            // School name as title
            const educationTitle = document.createElement('h3');
            educationTitle.textContent = education.school;
            
            const educationDate = document.createElement('div');
            educationDate.classList.add('date');
            educationDate.textContent = education.date;
            
            const educationCert = document.createElement('div');
            educationCert.classList.add('certificate');
            educationCert.textContent = education.certificate;
            
            // Add details if they exist
            const detailsList = document.createElement('ul');
            detailsList.classList.add('details-list');
            
            if (education.details && education.details.length > 0) {
                education.details.forEach(detail => {
                    const detailItem = document.createElement('li');
                    detailItem.textContent = detail;
                    detailsList.appendChild(detailItem);
                });
            }
            
            timelineContent.appendChild(educationTitle);
            timelineContent.appendChild(educationDate);
            timelineContent.appendChild(educationCert);
            if (education.details.length > 0) {
                timelineContent.appendChild(detailsList);
            }
            
            educationItem.appendChild(timelineDot);
            educationItem.appendChild(timelineContent);
            educationContainer.appendChild(educationItem);
        });

        // Initialize Intersection Observer
        const educationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observe all education items
        document.querySelectorAll('.education-item').forEach(item => {
            educationObserver.observe(item);
        });

    } catch (error) {
        console.error('Error fetching education data:', error);
    }
}
document.querySelector('.hamburger-menu').addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.add('active');
});

// Handle close button click to close menu
document.querySelector('.close-menu').addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.add('closing');
    
    setTimeout(() => {
        navLinks.classList.remove('active');
        navLinks.classList.remove('closing');
    }, 300); // Match animation duration
});

// Close menu when a nav link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.add('closing');
            
            setTimeout(() => {
                navLinks.classList.remove('active');
                navLinks.classList.remove('closing');
            }, 300);
        }
    });
});