// Dynamic data structure for easy content management
// This file is optional - you can also edit content directly in HTML

const siteData = {
    // Education data
    education: [
        {
            className: 'education-item',
            title: 'Ph.D. in Computer Science',
            school: 'University Name',
            major: 'Artificial Intelligence',
            advisor: 'Prof. Name',
            year: '2020 - Present',
            details: 'Research focus on machine learning and natural language processing.'
        },
        {
            className: 'education-item',
            title: 'M.S. in Computer Science',
            school: 'University Name',
            major: 'Computer Science',
            advisor: 'Prof. Name',
            year: '2018 - 2020',
            details: 'Specialized in algorithms and data structures.'
        },
        {
            className: 'education-item',
            title: 'B.S. in Computer Science',
            school: 'University Name',
            major: 'Computer Science',
            year: '2014 - 2018',
            details: 'Graduated with honors.'
        }
    ],

    // Research areas
    research: [
        {
            icon: '🤖',
            title: 'Machine Learning',
            description: 'Deep learning, reinforcement learning, and their applications in real-world problems.'
        },
        {
            icon: '🧠',
            title: 'Natural Language Processing',
            description: 'Language models, text generation, and sentiment analysis.'
        },
        {
            icon: '📊',
            title: 'Data Mining',
            description: 'Large-scale data analysis and pattern recognition.'
        }
    ],

    // Publications
    papers: [
        {
            title: 'Title of Paper One',
            authors: 'Author One, Author Two, Author Three',
            venue: 'Conference Name 2024',
            pdf: '#',
            code: '#',
            cite: '#'
        },
        {
            title: 'Title of Paper Two',
            authors: 'Author One, Author Two',
            venue: 'Journal Name 2023',
            pdf: '#',
            code: '#',
            cite: '#'
        }
    ],

    // Projects
    projects: [
        {
            title: 'Project Name One',
            description: 'A detailed description of the project and its goals.',
            tags: ['Python', 'PyTorch', 'NLP'],
            link: '#',
            image: 'placeholder'
        },
        {
            title: 'Project Name Two',
            description: 'Another project description showcasing technical skills.',
            tags: ['JavaScript', 'React', 'API'],
            link: '#',
            image: 'placeholder'
        }
    ],

    // Work experience
    experience: [
        {
            title: 'Senior Research Engineer',
            company: 'Company Name',
            duration: '2022 - Present',
            description: 'Leading research in machine learning applications.'
        },
        {
            title: 'Research Intern',
            company: 'Research Lab',
            duration: '2021 - 2022',
            description: 'Worked on cutting-edge AI research projects.'
        }
    ],

    // Awards
    awards: [
        {
            name: 'Best Paper Award',
            organization: 'Conference Name',
            year: '2024'
        },
        {
            name: 'Outstanding Student Award',
            organization: 'University Name',
            year: '2022'
        }
    ],

    // Skills
    skills: {
        'Programming Languages': ['Python', 'JavaScript', 'C++', 'Java'],
        'Machine Learning': ['PyTorch', 'TensorFlow', 'Scikit-learn'],
        'Web Development': ['HTML/CSS', 'React', 'Node.js'],
        'Tools': ['Git', 'Docker', 'Linux']
    },

    // Blog posts
    blog: [
        {
            date: 'January 15, 2025',
            title: 'Understanding Deep Learning',
            excerpt: 'An introduction to deep learning concepts and applications.',
            link: '#'
        },
        {
            date: 'December 20, 2024',
            title: 'Optimizing Neural Networks',
            excerpt: 'Tips and techniques for better model performance.',
            link: '#'
        }
    ],

    // Contact information
    contact: {
        email: 'your.email@example.com',
        address: 'City, Country',
        phone: '+1 234 567 890'
    }
};

// Expose data globally for main.js to use
window.siteData = siteData;
