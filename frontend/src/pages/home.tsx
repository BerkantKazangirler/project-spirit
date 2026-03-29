import { useNavigate } from "react-router";
import {
  Satellite,
  Mail,
  Phone,
  MapPin,
  Globe,
  Send,
  Share2,
  ArrowRight,
  Target,
  Users,
  Zap,
  ChevronDown,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { ImageWithFallback } from "../components/ui/image";
import { useState } from "react";

export function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const teamMembers = [
    {
      name: "Berkant Kazangirler",
      role: "AI & Backend Lead",
      image:
        "https://raw.githubusercontent.com/BerkantKazangirler/project-spirit/refs/heads/main/SDBerkant.webp",
      bio: "Expert in YOLOv8 training and Satellite Data Pipeline. Specializes in disaster detection AI systems.",
    },
    {
      name: "Ali Efe Kerimoğlu",
      role: "Front-End Developer",
      image:
        "https://raw.githubusercontent.com/BerkantKazangirler/project-spirit/refs/heads/main/IMG_8859.png",
      bio: "Specializing in Mapbox GL JS and Real-time Geo-data visualization for crisis management interfaces.",
    },
    {
      name: "Kerem Özyavuz",
      role: "UI/UX Specialist",
      image:
        "https://raw.githubusercontent.com/BerkantKazangirler/project-spirit/refs/heads/main/SPMrPrflS1.png",
      bio: "Focused on Crisis Management Interface Design with emphasis on user experience during emergencies.",
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Mesajınız alındı! En kısa sürede size dönüş yapacağız.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E1A]/80 backdrop-blur-xl border-b border-[#00D1FF]/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Satellite
                  className="w-8 h-8 text-[#00D1FF]"
                  strokeWidth={2.5}
                />
                <div className="absolute inset-0 blur-lg bg-[#00D1FF]/40"></div>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white">
                  Project Spirit
                </h1>
                <p className="text-xs text-[#00D1FF] font-medium">
                  AI Disaster Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <button
                onClick={() => scrollToSection("about")}
                className="text-sm text-gray-300 hover:text-[#00D1FF] transition-colors"
              >
                Hakkımızda
              </button>
              <button
                onClick={() => scrollToSection("team")}
                className="text-sm text-gray-300 hover:text-[#00D1FF] transition-colors"
              >
                Ekibimiz
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-sm text-gray-300 hover:text-[#00D1FF] transition-colors"
              >
                İletişim
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2.5 bg-gradient-to-r from-[#00D1FF] to-[#0080FF] rounded-lg text-sm font-bold text-black hover:shadow-lg hover:shadow-[#00D1FF]/50 transition-all flex items-center gap-2"
              >
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1770370419338-f9a813302baa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBzcGFjZSUyMHRlY2hub2xvZ3klMjBvcmJpdCUyMGVhcnRofGVufDF8fHx8MTc3NDcxNTM4NXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Satellite in space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A]/60 via-[#0A0E1A]/80 to-[#0A0E1A]"></div>
        </div>

        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern
                id="hero-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="#00D1FF"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D1FF]/10 border border-[#00D1FF]/30 rounded-full backdrop-blur-sm mb-8">
              <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-pulse"></div>
              <span className="text-xs font-bold text-[#00D1FF] uppercase tracking-wider">
                Real-time Disaster Response System
              </span>
            </div>
          </div>

          <h1 className="text-7xl font-black text-white mb-6 leading-tight">
            Rapid Response
            <br />
            <span className="bg-gradient-to-r from-[#00D1FF] to-[#0080FF] bg-clip-text text-transparent">
              Powered by Space-Tech
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            ANKA combines satellite imagery, AI-powered object detection, and
            BKZS mesh networking to deliver critical intelligence for disaster
            response teams in real-time.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="group px-8 py-4 bg-gradient-to-r from-[#00D1FF] to-[#0080FF] rounded-lg text-lg font-bold text-black hover:shadow-2xl hover:shadow-[#00D1FF]/50 transition-all flex items-center gap-3"
            >
              Enter Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg text-lg font-bold text-white hover:bg-white/10 transition-all"
            >
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            <Card className="bg-[#0A0E1A]/60 backdrop-blur-xl border border-[#00D1FF]/30 p-6">
              <div className="text-4xl font-black text-[#00D1FF] mb-2">43%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                AI Accuracy
              </div>
            </Card>
            <Card className="bg-[#0A0E1A]/60 backdrop-blur-xl border border-[#00D1FF]/30 p-6">
              <div className="text-4xl font-black text-[#00D1FF] mb-2">
                &lt;50ms
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                Response Time
              </div>
            </Card>
            <Card className="bg-[#0A0E1A]/60 backdrop-blur-xl border border-[#00D1FF]/30 p-6">
              <div className="text-4xl font-black text-[#00D1FF] mb-2">
                24/7
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                Monitoring
              </div>
            </Card>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            Scroll
          </span>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about"
        className="py-24 bg-gradient-to-b from-[#0A0E1A] to-[#0F1419]"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D1FF]/10 border border-[#00D1FF]/30 rounded-full mb-6">
              <span className="text-xs font-bold text-[#00D1FF] uppercase tracking-wider">
                Hakkımızda
              </span>
            </div>
            <h2 className="text-5xl font-black text-white mb-6">Our Mission</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Using cutting-edge space technology for humanitarian aid and
              disaster response
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-[#00D1FF]/10 to-transparent border border-[#00D1FF]/30 p-8 hover:border-[#00D1FF]/50 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-[#00D1FF]/20 border border-[#00D1FF]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Satellite className="w-7 h-7 text-[#00D1FF]" />
              </div>
              <h3 className="text-xl font-black text-white mb-4">
                Satellite Intelligence
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Real-time satellite imagery analysis using BKZS (Turkish
                National Satellite System) for immediate disaster zone
                assessment.
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-[#FF8A00]/10 to-transparent border border-[#FF8A00]/30 p-8 hover:border-[#FF8A00]/50 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-[#FF8A00]/20 border border-[#FF8A00]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-[#FF8A00]" />
              </div>
              <h3 className="text-xl font-black text-white mb-4">
                AI-Powered Detection
              </h3>
              <p className="text-gray-400 leading-relaxed">
                YOLOv8-based object detection identifies collapsed structures,
                blocked roads, and survivors with 94.7% mAP50 accuracy.
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-[#00D1FF]/10 to-transparent border border-[#00D1FF]/30 p-8 hover:border-[#00D1FF]/50 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-[#00D1FF]/20 border border-[#00D1FF]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-[#00D1FF]" />
              </div>
              <h3 className="text-xl font-black text-white mb-4">
                Mesh Networking
              </h3>
              <p className="text-gray-400 leading-relaxed">
                BKZS-integrated mesh network ensures reliable communication
                between field teams, even in infrastructure-damaged areas.
              </p>
            </Card>
          </div>

          {/* Vision Statement */}
          <Card className="mt-16 bg-[#0F1419] border border-[#00D1FF]/20 p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-black text-white mb-6">
                Our Vision
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Project Spirit was founded with the mission to leverage Turkey's
                space infrastructure for humanitarian purposes. By integrating
                satellite technology, artificial intelligence, and mesh
                networking, we provide disaster response teams with the
                real-time intelligence they need to save lives and coordinate
                rescue operations effectively.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00D1FF]"></div>
                  <span>TUA Astro Hackathon Participant</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-[#0F1419]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D1FF]/10 border border-[#00D1FF]/30 rounded-full mb-6">
              <Users className="w-4 h-4 text-[#00D1FF]" />
              <span className="text-xs font-bold text-[#00D1FF] uppercase tracking-wider">
                Ekibimiz
              </span>
            </div>
            <h2 className="text-5xl font-black text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A dedicated team of experts in AI, software engineering, and
              design
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="bg-[#0A0E1A] border border-[#00D1FF]/20 overflow-hidden hover:border-[#00D1FF]/50 transition-all group"
              >
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-white mb-2">
                    {member.name}
                  </h3>
                  <div className="inline-block px-3 py-1 bg-[#00D1FF]/10 border border-[#00D1FF]/30 rounded-full text-xs font-bold text-[#00D1FF] mb-4">
                    {member.role}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 bg-gradient-to-b from-[#0F1419] to-[#0A0E1A]"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D1FF]/10 border border-[#00D1FF]/30 rounded-full mb-6">
              <Mail className="w-4 h-4 text-[#00D1FF]" />
              <span className="text-xs font-bold text-[#00D1FF] uppercase tracking-wider">
                İletişim
              </span>
            </div>
            <h2 className="text-5xl font-black text-white mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Have questions or want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-[#0F1419] border border-[#00D1FF]/20 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#0A0E1A] border border-white/10 rounded-lg text-white focus:border-[#00D1FF]/50 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#0A0E1A] border border-white/10 rounded-lg text-white focus:border-[#00D1FF]/50 focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#0A0E1A] border border-white/10 rounded-lg text-white focus:border-[#00D1FF]/50 focus:outline-none transition-colors resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#00D1FF] to-[#0080FF] rounded-lg text-lg font-bold text-black hover:shadow-lg hover:shadow-[#00D1FF]/50 transition-all"
                >
                  Send Message
                </button>
              </form>
            </Card>

            {/* Contact Info & Mini Map */}
            <div className="space-y-6">
              <Card className="bg-[#0F1419] border border-[#00D1FF]/20 p-6">
                <h3 className="text-xl font-black text-white mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#00D1FF]/10 border border-[#00D1FF]/30 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#00D1FF]" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Headquarters
                      </div>
                      <div className="text-white">
                        Istanbul Technical University
                        <br />
                        Maslak, Istanbul, Turkey
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#00D1FF]/10 border border-[#00D1FF]/30 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#00D1FF]" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Email</div>
                      <div className="text-white">info@frc10042.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#00D1FF]/10 border border-[#00D1FF]/30 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#00D1FF]" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Phone</div>
                      <div className="text-white">+90 (433) 555-0123</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Mini Map Placeholder */}
              <Card className="bg-[#0F1419] border border-[#00D1FF]/20 overflow-hidden">
                <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900">
                  {/* Simple map placeholder with grid */}
                  <svg className="w-full h-full opacity-20">
                    <defs>
                      <pattern
                        id="map-grid"
                        width="30"
                        height="30"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 30 0 L 0 0 0 30"
                          fill="none"
                          stroke="#00D1FF"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#map-grid)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-[#FF8A00] border-4 border-white shadow-lg shadow-[#FF8A00]/50"></div>
                      <div className="absolute inset-0 w-4 h-4 rounded-full bg-[#FF8A00] animate-ping"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-[#0A0E1A]/90 backdrop-blur-sm border border-[#00D1FF]/30 rounded-lg px-3 py-2">
                    <div className="text-xs text-gray-400">Karabük, Turkey</div>
                    <div className="text-xs font-mono text-white">
                      41.1058°N, 29.0174°E
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0E1A] border-t border-[#00D1FF]/20 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Satellite className="w-8 h-8 text-[#00D1FF]" />
                <div>
                  <h3 className="text-lg font-black text-white">
                    Project Spirit
                  </h3>
                  <p className="text-xs text-[#00D1FF]">
                    AI Disaster Intelligence
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Leveraging space technology and AI for rapid disaster response
                and humanitarian aid.
              </p>
            </div>

            {/* Partners */}
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
                Partners
              </h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-sm text-gray-400 hover:text-[#00D1FF] transition-colors"
                >
                  TUA (Turkish Space Agency)
                </a>
                <a
                  href="#"
                  className="block text-sm text-gray-400 hover:text-[#00D1FF] transition-colors"
                >
                  Spirit Dynamics
                </a>
                <a
                  href="#"
                  className="block text-sm text-gray-400 hover:text-[#00D1FF] transition-colors"
                >
                  AFAD
                </a>
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
                Connect
              </h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00D1FF]/10 hover:border-[#00D1FF]/30 transition-all"
                >
                  <Globe className="w-5 h-5 text-gray-400" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00D1FF]/10 hover:border-[#00D1FF]/30 transition-all"
                >
                  <Send className="w-5 h-5 text-gray-400" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00D1FF]/10 hover:border-[#00D1FF]/30 transition-all"
                >
                  <Share2 className="w-5 h-5 text-gray-400" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              © 2026 Project Spirit. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-gray-500">
              <a href="#" className="hover:text-[#00D1FF] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#00D1FF] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
