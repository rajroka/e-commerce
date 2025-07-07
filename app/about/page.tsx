'use client';

import React from 'react';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-white text-gray-800 px-6 py-16">
      <section className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">About Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We’re passionate about providing high-quality products and unforgettable experiences.
          </p>
        </div>

        {/* Intro Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is simple — to deliver value through innovative products, outstanding customer service,
              and an unwavering commitment to quality. We believe in creating long-term relationships with
              customers, built on trust and satisfaction.
            </p>
          </div>
          <div className="w-full h-72 relative">
            <Image
              src="/images/about-mission.jpg"
              alt="Our Mission"
              layout="fill"
              className="rounded-xl object-cover"
            />
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Behind every great product is a team of passionate individuals. We are designers, developers, marketers, and dreamers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Raj Roka', role: 'Founder & CEO', img: '/images/team1.jpg' },
            { name: 'Sita Sharma', role: 'Lead Developer', img: '/images/team2.jpg' },
            { name: 'Karan Thapa', role: 'UI/UX Designer', img: '/images/team3.jpg' },
            { name: 'Riya Gurung', role: 'Marketing Head', img: '/images/team4.jpg' },
          ].map((member, i) => (
            <div key={i} className="text-center">
              <div className="w-32 h-32 mx-auto relative mb-4">
                <Image
                  src={member.img}
                  alt={member.name}
                  layout="fill"
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold mb-6">Our Core Values</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700 list-disc pl-5">
            <li>Customer First</li>
            <li>Innovation Driven</li>
            <li>Quality Obsessed</li>
            <li>Trust & Transparency</li>
            <li>Continuous Growth</li>
            <li>Team Collaboration</li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
