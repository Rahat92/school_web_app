import React from "react";

export default function HomePage() {
  return (
    <div className="font-sans text-gray-900">
      {/* SEO Meta Tags */}
        <title>Greenfield High School | Excellence in Education</title>
        <meta
          name="description"
          content="Greenfield High School provides quality education, modern facilities, and a nurturing environment for students to excel academically and socially."
        />
        <meta name="keywords" content="school, education, high school, learning, students, teachers" />
        <meta name="author" content="Greenfield High School" />

      {/* Navbar */}
      <header className="bg-white shadow sticky top-0 z-50">
        <nav className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-green-600">Greenfield High</h1>
          <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <li><a href="#about" className="hover:text-green-600">About</a></li>
            <li><a href="#programs" className="hover:text-green-600">Programs</a></li>
            <li><a href="#admission" className="hover:text-green-600">Admission</a></li>
            <li><a href="#contact" className="hover:text-green-600">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-green-50 py-20 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-green-700">
            Nurturing Minds, Building Futures
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-700">
            A place where learning meets excellence.
          </p>
          <a
            href="#admission"
            className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-full text-lg hover:bg-green-700 transition"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <img
            src="https://source.unsplash.com/600x400/?school,classroom"
            alt="School campus"
            className="rounded-2xl shadow-lg"
          />
          <div>
            <h3 className="text-3xl font-semibold text-green-700 mb-4">About Us</h3>
            <p className="text-gray-700 leading-relaxed">
              Greenfield High School has been delivering excellence in education
              for over 20 years. Our dedicated faculty and modern facilities
              ensure students receive the best academic, cultural, and
              extracurricular opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-semibold text-green-700 mb-8">Academic Programs</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Science", desc: "Comprehensive science curriculum with labs." },
              { title: "Arts", desc: "Creative programs in literature, drama, and music." },
              { title: "Sports", desc: "Training and facilities for physical development." },
            ].map((program, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
              >
                <h4 className="text-xl font-bold text-green-600 mb-2">{program.title}</h4>
                <p className="text-gray-700">{program.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Call-to-Action */}
      <section id="admission" className="py-20 bg-green-600 text-white text-center">
        <h3 className="text-3xl md:text-4xl font-bold">Join Our Community</h3>
        <p className="mt-4 text-lg">
          Admission for the 2025 academic year is now open.
        </p>
        <a
          href="#contact"
          className="mt-6 inline-block bg-white text-green-700 px-6 py-3 rounded-full text-lg hover:bg-gray-200 transition"
        >
          Contact Us
        </a>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 container mx-auto px-4">
        <h3 className="text-3xl font-semibold text-green-700 mb-6 text-center">Contact Us</h3>
        <div className="text-center text-gray-700">
          <p>📍 123 Greenfield Road, Dhaka</p>
          <p>📞 +880 123 456 789</p>
          <p>✉️ info@greenfieldhigh.edu</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Greenfield High School. All rights reserved.</p>
      </footer>
    </div>
  );
}
