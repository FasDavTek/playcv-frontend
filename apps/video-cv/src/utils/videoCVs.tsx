import { v4 as uuidv4 } from 'uuid';

interface VideoCV {
  id: string;
  uploaderName: string;
  role: string;
  videoUrl: string;
  uploadDate: string;
  views: number;
  isActive: boolean;
  imageSrc: string;
  price: number;
  description: string;
}

export const videoCVs: VideoCV[] = [
  {
    id: uuidv4(),
    uploaderName: "Sophia Rose",
    role: "Business Development Manager",
    videoUrl: "https://coverr.co/videos/business-development-manager-meeting-QW3R5U6D78?from=category&category=8",
    uploadDate: "2024-07-21",
    views: 225,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg",
    price: 20,
    description: "Experienced in driving business growth, managing client relationships, and developing market strategies.",
  },
  {
    id: uuidv4(),
    uploaderName: "Derek Blue",
    role: "Content Strategist",
    videoUrl: "https://www.videvo.net/video/content-strategist-brainstorming-ideas/6404/",
    uploadDate: "2024-07-22",
    views: 180,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184313/pexels-photo-3184313.jpeg",
    price: 20,
    description: "Focuses on creating and managing content strategies to enhance brand presence and engagement.",
  },
  {
    id: uuidv4(),
    uploaderName: "Angela White",
    role: "Data Analyst",
    videoUrl: "https://pixabay.com/videos/data-analysis-visualization-5264/",
    uploadDate: "2024-07-23",
    views: 240,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184332/pexels-photo-3184332.jpeg",
    price: 20,
    description: "Proficient in analyzing complex data sets, generating reports, and providing actionable insights.",
  },
  {
    id: uuidv4(),
    uploaderName: "Liam Gray",
    role: "Product Designer",
    videoUrl: "https://www.videvo.net/video/product-designer-sketching-ideas/7204/",
    uploadDate: "2024-07-24",
    views: 195,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184351/pexels-photo-3184351.jpeg",
    price: 20,
    description: "Creates intuitive product designs with a focus on user experience and functionality.",
  },
  {
    id: uuidv4(),
    uploaderName: "Ella Blue",
    role: "Social Media Manager",
    videoUrl: "https://www.pexels.com/video/social-media-manager-creating-content-3184338/",
    uploadDate: "2024-07-25",
    views: 210,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184342/pexels-photo-3184342.jpeg",
    price: 20,
    description: "Expert in crafting and implementing social media strategies to build brand awareness and engagement.",
  },
  {
    id: uuidv4(),
    uploaderName: "Oliver Red",
    role: "Event Coordinator",
    videoUrl: "https://coverr.co/videos/event-coordinator-planning-event-6X8P4Y3H9?from=category&category=8",
    uploadDate: "2024-07-26",
    views: 175,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184355/pexels-photo-3184355.jpeg",
    price: 20,
    description: "Experienced in organizing and executing successful events, including conferences, meetings, and social gatherings.",
  },
  {
    id: uuidv4(),
    uploaderName: "Mia Green",
    role: "Instructional Designer",
    videoUrl: "https://www.videvo.net/video/instructional-designer-creating-course-material/5506/",
    uploadDate: "2024-07-27",
    views: 185,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184358/pexels-photo-3184358.jpeg",
    price: 20,
    description: "Designs and develops educational materials and training programs for various learning environments.",
  },
  {
    id: uuidv4(),
    uploaderName: "Noah Silver",
    role: "Digital Marketer",
    videoUrl: "https://pixabay.com/videos/digital-marketing-strategy-7345/",
    uploadDate: "2024-07-28",
    views: 190,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    price: 20,
    description: "Expert in developing and executing digital marketing campaigns across various platforms.",
  },
  {
    id: uuidv4(),
    uploaderName: "Ava Rose",
    role: "Health & Safety Officer",
    videoUrl: "https://www.videvo.net/video/health-and-safety-officer-inspecting-site/6302/",
    uploadDate: "2024-07-29",
    views: 210,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184364/pexels-photo-3184364.jpeg",
    price: 20,
    description: "Ensures compliance with health and safety regulations and conducts safety inspections.",
  },
  {
    id: uuidv4(),
    uploaderName: "Ethan Gold",
    role: "Research Scientist",
    videoUrl: "https://coverr.co/videos/research-scientist-in-lab-9X8J6Y3K7?from=category&category=8",
    uploadDate: "2024-07-30",
    views: 200,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184365/pexels-photo-3184365.jpeg",
    price: 20,
    description: "Conducts experiments and research in various scientific fields to advance knowledge and innovation.",
  },
  {
    id: uuidv4(),
    uploaderName: "Isabella White",
    role: "Technical Writer",
    videoUrl: "https://www.pexels.com/video/technical-writer-working-on-documents-3184339/",
    uploadDate: "2024-07-31",
    views: 225,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184367/pexels-photo-3184367.jpeg",
    price: 20,
    description: "Creates clear and concise technical documentation, manuals, and guides.",
  },
  {
    id: uuidv4(),
    uploaderName: "James Green",
    role: "UX Researcher",
    videoUrl: "https://www.videvo.net/video/ux-researcher-interviewing-users/4207/",
    uploadDate: "2024-08-01",
    views: 215,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184368/pexels-photo-3184368.jpeg",
    price: 20,
    description: "Conducts user research to inform design decisions and improve user experiences.",
  },
  {
    id: uuidv4(),
    uploaderName: "Chloe Blue",
    role: "Operations Manager",
    videoUrl: "https://pixabay.com/videos/operations-manager-supervising-8347/",
    uploadDate: "2024-08-02",
    views: 180,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184370/pexels-photo-3184370.jpeg",
    price: 20,
    description: "Oversees daily operations, manages staff, and ensures efficient workflow within the organization.",
  },
  {
    id: uuidv4(),
    uploaderName: "William Brown",
    role: "Architect",
    videoUrl: "https://www.videvo.net/video/architect-drawing-plans/6004/",
    uploadDate: "2024-08-03",
    views: 210,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184371/pexels-photo-3184371.jpeg",
    price: 20,
    description: "Designs and plans architectural projects, focusing on both aesthetics and functionality.",
  },
  {
    id: uuidv4(),
    uploaderName: "Megan Black",
    role: "Public Relations Specialist",
    videoUrl: "https://coverr.co/videos/public-relations-specialist-meeting-client-5X7T3Z4D8?from=category&category=8",
    uploadDate: "2024-08-04",
    views: 195,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184373/pexels-photo-3184373.jpeg",
    price: 20,
    description: "Manages communication and media relations to enhance the company's public image.",
  },
  {
    id: uuidv4(),
    uploaderName: "Bob Brown",
    role: "Data Scientist",
    videoUrl: "https://coverr.co/videos/aerial-shot-of-mountains-forest-and-waterfall-H9NV2UJR0Z?from=category&category=8",
    uploadDate: "2024-07-12",
    views: 180,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184351/pexels-photo-3184351.jpeg",
    price: 20,
    description: "Specializes in statistical analysis, machine learning, and data visualization using Python and R.",
  },
  {
    id: uuidv4(),
    uploaderName: "Carol White",
    role: "UI/UX Designer",
    videoUrl: "https://www.pexels.com/video/woman-sketching-on-a-tablet-while-sitting-at-the-desk-3184326/",
    uploadDate: "2024-06-20",
    views: 210,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184342/pexels-photo-3184342.jpeg",
    price: 20,
    description: "Creates user-centered designs and intuitive interfaces for web and mobile applications.",
  },
  {
    id: uuidv4(),
    uploaderName: "David Black",
    role: "Project Manager",
    videoUrl: "https://www.videvo.net/video/man-talking-on-a-phone-while-using-a-laptop/21028/",
    uploadDate: "2024-07-05",
    views: 160,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184355/pexels-photo-3184355.jpeg",
    price: 20,
    description: "Skilled in coordinating teams, managing project timelines, and delivering successful project outcomes.",
  },
  {
    id: uuidv4(),
    uploaderName: "Emma Green",
    role: "Marketing Specialist",
    videoUrl: "https://pixabay.com/videos/business-work-office-desk-computer-2765/",
    uploadDate: "2024-06-30",
    views: 240,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184358/pexels-photo-3184358.jpeg",
    price: 20,
    description: "Expert in digital marketing strategies, content creation, and brand management.",
  },
  {
    id: uuidv4(),
    uploaderName: "Frank Blue",
    role: "DevOps Engineer",
    videoUrl: "https://coverr.co/videos/developer-working-on-laptop-PQ2FQ3HE38?from=category&category=8",
    uploadDate: "2024-07-09",
    views: 190,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    price: 20,
    description: "Experience in CI/CD pipelines, cloud infrastructure, and automation using Docker and Kubernetes.",
  },
  {
    id: uuidv4(),
    uploaderName: "Grace Pink",
    role: "Product Manager",
    videoUrl: "https://www.pexels.com/video/a-woman-discussing-with-her-colleagues-3184331/",
    uploadDate: "2024-07-11",
    views: 200,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184364/pexels-photo-3184364.jpeg",
    price: 20,
    description: "Strong background in product development, market analysis, and cross-functional team leadership.",
  },
  {
    id: uuidv4(),
    uploaderName: "Hank Gray",
    role: "Business Analyst",
    videoUrl: "https://www.videvo.net/video/close-up-of-hands-typing-on-keyboard/2476/",
    uploadDate: "2024-07-03",
    views: 170,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184365/pexels-photo-3184365.jpeg",
    price: 20,
    description: "Adept at analyzing business needs, gathering requirements, and providing data-driven insights.",
  },
  {
    id: uuidv4(),
    uploaderName: "Ivy Silver",
    role: "QA Engineer",
    videoUrl: "https://pixabay.com/videos/qa-testing-quality-assurance-code-7055/",
    uploadDate: "2024-06-29",
    views: 220,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184367/pexels-photo-3184367.jpeg",
    price: 20,
    description: "Expert in software testing, quality assurance, and developing automated test scripts.",
  },
  {
    id: uuidv4(),
    uploaderName: "Jack Gold",
    role: "Software Engineer",
    videoUrl: "https://coverr.co/videos/software-engineer-working-on-laptop-7X8Q4U5HU8?from=category&category=8",
    uploadDate: "2024-07-08",
    views: 280,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184370/pexels-photo-3184370.jpeg",
    price: 20,
    description: "Strong background in software development, coding best practices, and building scalable applications.",
  },
  {
    id: uuidv4(),
    uploaderName: "Kelly Bronze",
    role: "Graphic Designer",
    videoUrl: "https://www.pexels.com/video/designer-working-on-a-graphic-tablet-3184334/",
    uploadDate: "2024-07-06",
    views: 130,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184371/pexels-photo-3184371.jpeg",
    price: 20,
    description: "Specializes in visual branding, print design, and digital artwork with a focus on creativity and innovation.",
  },
  {
    id: uuidv4(),
    uploaderName: "Leo Red",
    role: "Content Writer",
    videoUrl: "https://www.videvo.net/video/woman-writing-notes-in-a-notebook/21389/",
    uploadDate: "2024-06-22",
    views: 250,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184373/pexels-photo-3184373.jpeg",
    price: 20,
    description: "Expert in creating engaging and informative content for websites, blogs, and marketing materials.",
  },
  {
    id: uuidv4(),
    uploaderName: "Mona Purple",
    role: "HR Manager",
    videoUrl: "https://pixabay.com/videos/hr-manager-interview-recruitment-6836/",
    uploadDate: "2024-07-04",
    views: 140,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184374/pexels-photo-3184374.jpeg",
    price: 20,
    description: "Experienced in talent acquisition, employee relations, and developing HR policies and procedures.",
  },
  {
    id: uuidv4(),
    uploaderName: "Sophia Rose",
    role: "Business Development Manager",
    videoUrl: "https://coverr.co/videos/business-development-manager-meeting-QW3R5U6D78?from=category&category=8",
    uploadDate: "2024-07-21",
    views: 225,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184380/pexels-photo-3184380.jpeg",
    price: 20,
    description: "Experienced in driving business growth, managing client relationships, and developing market strategies.",
  },
  {
    id: uuidv4(),
    uploaderName: "Derek Blue",
    role: "Content Strategist",
    videoUrl: "https://www.videvo.net/video/content-strategist-brainstorming-ideas/6404/",
    uploadDate: "2024-07-22",
    views: 180,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184382/pexels-photo-3184382.jpeg",
    price: 20,
    description: "Focuses on creating and managing content strategies to enhance brand presence and engagement.",
  },
  {
    id: uuidv4(),
    uploaderName: "Angela White",
    role: "Data Analyst",
    videoUrl: "https://pixabay.com/videos/data-analysis-visualization-5264/",
    uploadDate: "2024-07-23",
    views: 240,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184384/pexels-photo-3184384.jpeg",
    price: 20,
    description: "Proficient in analyzing complex data sets, generating reports, and providing actionable insights.",
  },
  {
    id: uuidv4(),
    uploaderName: "Liam Gray",
    role: "Product Designer",
    videoUrl: "https://www.videvo.net/video/product-designer-sketching-ideas/7208/",
    uploadDate: "2024-07-24",
    views: 150,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184386/pexels-photo-3184386.jpeg",
    price: 20,
    description: "Specializes in creating innovative product designs that meet user needs and market demands.",
  },
  {
    id: uuidv4(),
    uploaderName: "Chloe Black",
    role: "Systems Engineer",
    videoUrl: "https://coverr.co/videos/systems-engineer-setup-F9XZ0B8K89?from=category&category=8",
    uploadDate: "2024-07-25",
    views: 170,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184387/pexels-photo-3184387.jpeg",
    price: 20,
    description: "Expert in designing, implementing, and managing complex IT systems and infrastructures.",
  },
  {
    id: uuidv4(),
    uploaderName: "Oliver Silver",
    role: "Database Administrator",
    videoUrl: "https://www.videvo.net/video/database-administrator-monitoring/8402/",
    uploadDate: "2024-07-26",
    views: 220,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184389/pexels-photo-3184389.jpeg",
    price: 20,
    description: "Proficient in database management, optimization, and ensuring data security and integrity.",
  },
  {
    id: uuidv4(),
    uploaderName: "Elena Red",
    role: "SEO Specialist",
    videoUrl: "https://pixabay.com/videos/seo-specialist-optimizing-content-7203/",
    uploadDate: "2024-07-27",
    views: 210,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184390/pexels-photo-3184390.jpeg",
    price: 20,
    description: "Skilled in optimizing content for search engines, improving rankings, and driving organic traffic.",
  },
  {
    id: uuidv4(),
    uploaderName: "Mark Blue",
    role: "Cybersecurity Expert",
    videoUrl: "https://www.videvo.net/video/cybersecurity-expert-monitoring-systems/9403/",
    uploadDate: "2024-07-28",
    views: 190,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184391/pexels-photo-3184391.jpeg",
    price: 20,
    description: "Specializes in protecting systems and networks from cyber threats and ensuring data security.",
  },
  {
    id: uuidv4(),
    uploaderName: "Nina Purple",
    role: "IT Support Specialist",
    videoUrl: "https://coverr.co/videos/it-support-specialist-assisting-users-G8R0B8K90",
    uploadDate: "2024-07-29",
    views: 160,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184393/pexels-photo-3184393.jpeg",
    price: 20,
    description: "Provides technical support, resolves IT issues, and ensures smooth operation of IT systems.",
  },
  {
    id: uuidv4(),
    uploaderName: "Oscar Gold",
    role: "Network Engineer",
    videoUrl: "https://www.videvo.net/video/network-engineer-setting-up-servers/10403/",
    uploadDate: "2024-07-30",
    views: 230,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg",
    price: 20,
    description: "Experienced in designing, implementing, and maintaining network infrastructure and protocols.",
  },
  {
    id: uuidv4(),
    uploaderName: "Paula Pink",
    role: "Technical Writer",
    videoUrl: "https://pixabay.com/videos/technical-writer-creating-manuals-6403/",
    uploadDate: "2024-07-31",
    views: 170,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184395/pexels-photo-3184395.jpeg",
    price: 20,
    description: "Specializes in creating clear and concise technical documentation, manuals, and guides.",
  },
  {
    id: uuidv4(),
    uploaderName: "Quincy Orange",
    role: "Mobile Developer",
    videoUrl: "https://coverr.co/videos/mobile-developer-coding-app-G8H1K9L71",
    uploadDate: "2024-08-01",
    views: 200,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184396/pexels-photo-3184396.jpeg",
    price: 20,
    description: "Proficient in developing mobile applications for iOS and Android using modern technologies.",
  },
  {
    id: uuidv4(),
    uploaderName: "Rachel Green",
    role: "Game Developer",
    videoUrl: "https://www.videvo.net/video/game-developer-testing-gameplay/11203/",
    uploadDate: "2024-08-02",
    views: 300,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184397/pexels-photo-3184397.jpeg",
    price: 20,
    description: "Specializes in game development, designing gameplay mechanics, and creating immersive experiences.",
  },
  {
    id: uuidv4(),
    uploaderName: "Steve Brown",
    role: "AI Researcher",
    videoUrl: "https://pixabay.com/videos/ai-researcher-analyzing-data-7403/",
    uploadDate: "2024-08-03",
    views: 280,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg",
    price: 20,
    description: "Focuses on artificial intelligence research, developing algorithms, and advancing machine learning.",
  },
  {
    id: uuidv4(),
    uploaderName: "Tina Yellow",
    role: "Blockchain Developer",
    videoUrl: "https://coverr.co/videos/blockchain-developer-programming-H8J2L0M81",
    uploadDate: "2024-08-04",
    views: 220,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184399/pexels-photo-3184399.jpeg",
    price: 20,
    description: "Experienced in developing decentralized applications, smart contracts, and blockchain solutions.",
  },
  {
    id: uuidv4(),
    uploaderName: "Uma Silver",
    role: "Cloud Architect",
    videoUrl: "https://www.videvo.net/video/cloud-architect-planning-infrastructure/12203/",
    uploadDate: "2024-08-05",
    views: 250,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184400/pexels-photo-3184400.jpeg",
    price: 20,
    description: "Specializes in designing and managing cloud infrastructure, ensuring scalability and reliability.",
  },
  {
    id: uuidv4(),
    uploaderName: "Victor Violet",
    role: "Machine Learning Engineer",
    videoUrl: "https://pixabay.com/videos/machine-learning-engineer-training-models-7603/",
    uploadDate: "2024-08-06",
    views: 260,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184401/pexels-photo-3184401.jpeg",
    price: 20,
    description: "Experienced in developing machine learning models, data preprocessing, and model evaluation.",
  },
  {
    id: uuidv4(),
    uploaderName: "Wendy Blue",
    role: "Software Architect",
    videoUrl: "https://coverr.co/videos/software-architect-designing-systems-H9J3L2M81",
    uploadDate: "2024-08-07",
    views: 240,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184402/pexels-photo-3184402.jpeg",
    price: 20,
    description: "Specializes in designing software architecture, ensuring system scalability and performance.",
  },
  {
    id: uuidv4(),
    uploaderName: "Xander Brown",
    role: "Technical Support Engineer",
    videoUrl: "https://www.videvo.net/video/technical-support-engineer-assisting-customers/13203/",
    uploadDate: "2024-08-08",
    views: 180,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184403/pexels-photo-3184403.jpeg",
    price: 20,
    description: "Provides technical support, troubleshooting, and resolution of customer issues.",
  },
  {
    id: uuidv4(),
    uploaderName: "Yara Green",
    role: "DevOps Consultant",
    videoUrl: "https://pixabay.com/videos/devops-consultant-implementing-strategies-7803/",
    uploadDate: "2024-08-09",
    views: 230,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184404/pexels-photo-3184404.jpeg",
    price: 20,
    description: "Expert in DevOps practices, CI/CD implementation, and infrastructure automation.",
  },
  {
    id: uuidv4(),
    uploaderName: "Zachary Silver",
    role: "IT Manager",
    videoUrl: "https://coverr.co/videos/it-manager-overseeing-operations-F9H3J4K92",
    uploadDate: "2024-08-10",
    views: 210,
    isActive: true,
    imageSrc: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg",
    price: 20,
    description: "Experienced in IT management, overseeing operations, and ensuring smooth IT processes.",
  },
];
