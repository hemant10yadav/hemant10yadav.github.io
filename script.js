// Scroll progress.
const scrollProgress = document.getElementById("scroll-progress");
const height =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;

const apiUrl = 'https://api.jsonbin.io/v3/b/65aabceb266cfc3fde7c2fbc/';
const apiHeaders = {
    'Content-Type': 'application/json',
    'X-Access-Key': '$2a$10$c/ExHNlDWJdBCh/qIWGOwuxLioErGf1mO0FPzkiBIT551ujo3J37y',
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

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('nav h4 a');
    const sections = document.querySelectorAll('section');

    const button = document.getElementById('resume');

    // Add a click event handler to the element
    button.addEventListener('click', function () {
        if (status) {
            status = {...status, resumeDownloaded: status.resumeDownloaded + 1, lastUpdatedOn: new Date()};
        }
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

    (function readFile() {
        fetch(apiUrl, {
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
                console.log(data)
                if (data) {
                    data = {...data, requests: data.requests + 1, lastUpdatedOn: new Date()}
                    status = data;
                    saveData();
                }
            }, () => {
            })
    })();

    window.addEventListener('scroll', setActiveTab);
});


const saveData = () => {
    console.log(status)
    if (status) {
        fetch(apiUrl, {
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