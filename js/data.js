/**
 * Site Data - JSON structure for academic homepage
 * Edit this file to update the website content
 */

const siteData = {
    // Profile Information
    profile: {
        name: {
            en: "Your Name",
            zh: "您的姓名"
        },
        title: "Ph.D. Candidate",
        institution: {
            name: "Your University",
            url: "https://www.example.edu"
        },
        quote: "Research is creating new knowledge.",
        location: "City, Country",
        email: "your.email@example.edu",
        avatar: "images/avatar.jpg",
        social: {
            github: "https://github.com/yourusername",
            googleScholar: "https://scholar.google.com/citations?user=YOUR_ID",
            linkedin: "https://linkedin.com/in/yourprofile",
            twitter: "https://twitter.com/yourhandle",
            orcid: "https://orcid.org/0000-0000-0000-0000"
        }
    },

    // About Section
    about: {
        description: [
            "I am a Ph.D. candidate in [Department] at [University], advised by <a href='#'>Prof. Advisor Name</a>.",
            "My research focuses on [Research Area], with a particular interest in [Specific Topic].",
            "Previously, I received my B.S. degree in [Major] from [University] in [Year]."
        ],
        researchInterests: [
            "Machine Learning",
            "Computer Vision",
            "Natural Language Processing",
            "Deep Learning",
            "Reinforcement Learning"
        ]
    },

    // News Section (sorted by date, descending)
    news: [
        {
            date: "2024.06",
            icon: "🎉",
            content: "Our paper on [Topic] has been accepted at <strong>Conference 2024</strong>!"
        },
        {
            date: "2024.05",
            icon: "📝",
            content: "Started internship at <a href='#'>Company Name</a> as Research Intern."
        },
        {
            date: "2024.03",
            icon: "🏆",
            content: "Received <strong>Best Paper Award</strong> at Workshop 2024."
        },
        {
            date: "2024.01",
            icon: "🔥",
            content: "New paper on [Topic] is available on arXiv: <a href='#'>arXiv:2401.xxxxx</a>."
        },
        {
            date: "2023.11",
            icon: "📝",
            content: "Presented our work at <strong>Conference 2023</strong> in City, Country."
        },
        {
            date: "2023.09",
            icon: "🎓",
            content: "Started Ph.D. program at [University] with [Prof. Name]."
        }
    ],

    // Publications Section
    // myName is used for highlighting your name in author list
    publications: {
        myName: "Your Name",
        items: [
            {
                title: "Title of Your First Paper",
                authors: "First Author, Your Name, Third Author, Fourth Author",
                venue: "Conference on Machine Learning (CML), 2024",
                badges: ["ccf-a", "oral"],
                links: [
                    { label: "PDF", url: "#" },
                    { label: "Code", url: "#" },
                    { label: "Poster", url: "#" }
                ]
            },
            {
                title: "Title of Your Second Paper",
                authors: "Your Name, Co-Author, Senior Author",
                venue: "Neural Information Processing Systems (NeurIPS), 2023",
                badges: ["ccf-a"],
                links: [
                    { label: "PDF", url: "#" },
                    { label: "Code", url: "#" },
                    { label: "Slides", url: "#" }
                ]
            },
            {
                title: "Title of Third Paper",
                authors: "First Author, Your Name, Another Author",
                venue: "International Conference on Computer Vision (ICCV), 2023",
                badges: ["ccf-a", "best-paper"],
                links: [
                    { label: "PDF", url: "#" },
                    { label: "Video", url: "#" }
                ]
            },
            {
                title: "Title of a Journal Paper",
                authors: "Your Name, Collaborator A, Collaborator B",
                venue: "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI), 2023",
                badges: ["ccf-a"],
                links: [
                    { label: "PDF", url: "#" },
                    { label: "Supp", url: "#" }
                ]
            },
            {
                title: "Title of a Workshop Paper",
                authors: "Your Name, Co-Author",
                venue: "Workshop at CVPR 2023",
                badges: ["poster"],
                links: [
                    { label: "PDF", url: "#" }
                ]
            }
        ]
    },

    // Awards Section
    awards: [
        {
            date: "2023",
            name: "Best Paper Award",
            institution: "International Conference on XYZ"
        },
        {
            date: "2022",
            name: "Outstanding Student Award",
            institution: "Your University"
        },
        {
            date: "2021",
            name: "National Scholarship",
            institution: "Ministry of Education"
        },
        {
            date: "2020",
            name: "Research Excellence Award",
            institution: "Department of Computer Science"
        }
    ],

    // Experience Section
    experience: [
        {
            date: "2023 - Present",
            title: "Ph.D. Candidate",
            institution: "University Name",
            supervisor: "Advisor: Prof. Advisor Name"
        },
        {
            date: "2022 - 2023",
            title: "Research Intern",
            institution: "Tech Company Name",
            supervisor: "Mentor: Dr. Mentor Name"
        },
        {
            date: "2019 - 2022",
            title: "Research Assistant",
            institution: "University Name",
            supervisor: "Advisor: Prof. Advisor Name"
        },
        {
            date: "2015 - 2019",
            title: "B.S. in Computer Science",
            institution: "University Name",
            supervisor: ""
        }
    ],

    // Services Section
    services: {
        reviewer: [
            "NeurIPS 2024",
            "ICML 2024",
            "ICLR 2023, 2024",
            "CVPR 2023, 2024",
            "ECCV 2024",
            "AAAI 2023, 2024",
            "TPAMI",
            "IJCV"
        ],
        pcMember: [
            "Workshop on XYZ 2024",
            "Conference ABC 2023"
        ]
    }
};
