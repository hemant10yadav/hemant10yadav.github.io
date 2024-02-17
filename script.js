// Scroll progress.
const scrollProgress = document.getElementById("scroll-progress");
const height =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;

const apiUrl = 'https://api.jsonbin.io/v3/b/65ab53a5dc7465401896fab6/';
const apiHeaders = {
    'Content-Type': 'application/json',
    'X-Access-Key': '$2a$10$6o8EcMIJ1UKT3GRFU01Biu676n/fxU1/ddMOgVJCWFgXxeAsr8Z4W',
}

let status;

window.addEventListener("scroll", () => {
    const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
    scrollProgress.style.width = `${(scrollTop / height) * 100}%`;
});

// Scroll Event
const sectionLinks = document.querySelectorAll("nav a");
sectionLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        sectionLinks.forEach((link) => link.classList.remove("active"));
        e.target.classList.add("active");
        const section = document.querySelector(e.target.hash);
        section.scrollIntoView({behavior: "smooth", block: "start"});
    });
});

// Highlight nav item

document.addEventListener('DOMContentLoaded', async function () {
    const navLinks = document.querySelectorAll('nav h4 a');
    const sections = document.querySelectorAll('section');

    const button = document.getElementById('resume');

    // Add a click event handler to the element
    button.addEventListener('click', async () => {
        if (!status) {
            await getData();
        }
        status = {...status, resumeDownloads: status.resumeDownloads + 1, lastUpdatedOn: new Date()};
        saveData();
    });

    function setActiveTab() {
        let currentSection = null;

        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= 100) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Set active tab on page load
    setActiveTab();

    // Check if user has already viewed the page if yes then skip the view update.
    if (!localStorage.getItem('viewed')) {
        await getData();
        status = {...status, views: status.views + 1, lastUpdatedOn: new Date()}
        localStorage.setItem("viewed", true);
        await saveData();
    }

    window.addEventListener('scroll', setActiveTab);
});


const getData = async () => {
    await fetch(apiUrl, {
        method: 'GET',
        headers: {
            ...apiHeaders,
            'X-Bin-Meta': false
        },
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data) {
                status = data;
            }
        }, () => {
        })
}

const saveData = async () => {
    if (status) {
        await fetch(apiUrl, {
            method: 'PUT',
            headers: apiHeaders,
            body: JSON.stringify(status),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                status = data.record;
            }, () => {
            })
    }

}

// show project section when they come into the view.

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
};

const callback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        } else {
            entry.target.classList.remove('in-view');
        }
    });
};

const observer = new IntersectionObserver(callback, options);
const allCards = document.querySelectorAll('.card');
allCards.forEach(card => {
    observer.observe(card);
});


document.addEventListener('DOMContentLoaded', function () {
    const videoElement = document.getElementById('myVideo');

    videoElement.addEventListener('play', async () => {

        if (!localStorage.getItem('videoViewed')) {
            if (!status) await getData();
            status = {...status, videoViews: (status.videoViews ? status.videoViews + 1 : 1), lastUpdatedOn: new Date()}
            await saveData();
            localStorage.setItem("videoViewed", true);
        }

    });
});
