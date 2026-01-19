import React, { useState } from 'react';
import { Cloud, MapPin, Clock, Briefcase, Users, Heart, Rocket, Coffee, Dumbbell, Plane, GraduationCap, TrendingUp, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const CareersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');

    const benefits = [
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Premium Health Insurance",
            description: "Comprehensive health coverage for you and your family"
        },
        {
            icon: <Plane className="w-8 h-8" />,
            title: "5 Weeks Vacation",
            description: "Plus bank holidays for a great work/life balance"
        },
        {
            icon: <Coffee className="w-8 h-8" />,
            title: "Remote Flexible",
            description: "Work from anywhere, anytime"
        },
        {
            icon: <GraduationCap className="w-8 h-8" />,
            title: "Continuous Learning",
            description: "€3000 annual budget for your development"
        },
        {
            icon: <Dumbbell className="w-8 h-8" />,
            title: "Gym Access",
            description: "Free access to our partner gyms"
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Stock Options",
            description: "Share in the growth of the company"
        }
    ];

    const jobs = [
        {
            id: 1,
            title: "Senior Backend Engineer",
            department: "Engineering",
            location: "Paris, France",
            type: "Permanent",
            description: "We are looking for a senior backend developer to join our cloud infrastructure team.",
            skills: ["Node.js", "PostgreSQL", "Docker", "Kubernetes"],
            salary: "65-85K€"
        },
        {
            id: 2,
            title: "Frontend Developer React",
            department: "Engineering",
            location: "Paris, France / Remote",
            type: "Permanent",
            description: "Build exceptional user interfaces for our cloud platform.",
            skills: ["React", "TypeScript", "TailwindCSS", "Vite"],
            salary: "55-75K€"
        },
        {
            id: 3,
            title: "DevOps Engineer",
            department: "Engineering",
            location: "Lyon, France",
            type: "Permanent",
            description: "Optimize our cloud infrastructure and deployment pipelines.",
            skills: ["AWS", "Terraform", "CI/CD", "Monitoring"],
            salary: "60-80K€"
        },
        {
            id: 4,
            title: "Product Manager",
            department: "Product",
            location: "Paris, France",
            type: "Permanent",
            description: "Define product vision and drive development of new features.",
            skills: ["Product Strategy", "Analytics", "UX", "Agile"],
            salary: "70-90K€"
        },
        {
            id: 5,
            title: "UX/UI Designer",
            department: "Design",
            location: "Remote",
            type: "Permanent",
            description: "Design intuitive and visually stunning user experiences.",
            skills: ["Figma", "Design System", "User Research", "Prototyping"],
            salary: "50-70K€"
        },
        {
            id: 6,
            title: "Sales Account Executive",
            department: "Sales",
            location: "Paris, France",
            type: "Permanent",
            description: "Grow our client portfolio and exceed sales targets.",
            skills: ["SaaS Sales", "B2B", "Negotiation", "CRM"],
            salary: "45K€ + Commission"
        },
        {
            id: 7,
            title: "Customer Success Manager",
            department: "Support",
            location: "Paris, France / Remote",
            type: "Permanent",
            description: "Ensure satisfaction and retention of our enterprise clients.",
            skills: ["Customer Support", "Cloud", "Communication", "Problem Solving"],
            salary: "40-55K€"
        },
        {
            id: 8,
            title: "Data Scientist",
            department: "Data",
            location: "Paris, France",
            type: "Permanent",
            description: "Leverage our data to improve our products and services.",
            skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
            salary: "60-80K€"
        }
    ];

    const departments = ['all', 'Engineering', 'Product', 'Design', 'Sales', 'Support', 'Data'];
    const locations = ['all', 'Paris, France', 'Lyon, France', 'Remote'];

    const filteredJobs = jobs.filter(job => {
        const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
        const matchLocation = selectedLocation === 'all' || job.location.includes(selectedLocation);
        return matchSearch && matchDepartment && matchLocation;
    });

    const values = [
        {
            title: "Innovation",
            description: "We encourage experimentation and calculated risk-taking"
        },
        {
            title: "Collaboration",
            description: "Teamwork is at the heart of our success"
        },
        {
            title: "Excellence",
            description: "We aim for excellence in everything we do"
        },
        {
            title: "Diversity",
            description: "We celebrate diversity and inclusion"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Join Our
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Team
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                        Build the future of cloud computing with the best talents in the industry
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Users className="w-5 h-5 text-orange-500" />
                            <span className="font-medium">200+ Employees</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-5 h-5 text-orange-500" />
                            <span className="font-medium">5 Offices</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Rocket className="w-5 h-5 text-orange-500" />
                            <span className="font-medium">Growing Fast</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-slate-800">Perks & Benefits</h2>
                        <p className="text-slate-600 text-xl">We take care of our teams</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="p-8 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl hover:shadow-xl transition-all group">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform shadow-lg">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800">{benefit.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-12 shadow-2xl">
                        <h2 className="text-4xl font-bold text-white mb-8 text-center">Our Values</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, idx) => (
                                <div key={idx} className="p-6 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                                    <h3 className="text-2xl font-bold text-white mb-2">{value.title}</h3>
                                    <p className="text-white/90">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Listings */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-slate-800">Open Positions</h2>
                        <p className="text-slate-600 text-xl">{filteredJobs.length} opportunities available</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-6 mb-8">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search a job..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>
                                        {dept === 'all' ? 'All Departments' : dept}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>
                                        {loc === 'all' ? 'All Locations' : loc}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Jobs Grid */}
                    <div className="space-y-6">
                        {filteredJobs.map((job) => (
                            <div key={job.id} className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-8 hover:shadow-xl transition-all group">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                                                {job.title}
                                            </h3>
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                                {job.type}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 mb-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-orange-500" />
                                                <span className="text-sm font-medium">{job.department}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-orange-500" />
                                                <span className="text-sm font-medium">{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-orange-500" />
                                                <span className="text-sm font-medium">{job.salary}</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 mb-4 leading-relaxed">{job.description}</p>

                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button className="group/btn px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-400/50 transition-all flex items-center gap-2 font-medium whitespace-nowrap">
                                        Apply Now
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-600 text-lg">No positions match your criteria.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-3xl p-12 text-center shadow-xl">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">
                            Can't find the perfect role?
                        </h2>
                        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                            Send us a spontaneous application. We are always looking for exceptional talent!
                        </p>
                        <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-2xl hover:shadow-orange-400/50 transition-all transform hover:scale-105 font-semibold text-lg">
                            Spontaneous Application
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CareersPage;
