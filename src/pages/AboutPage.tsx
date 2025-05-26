
import React from 'react';
import Layout from '../components/Layout';
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-purple-600">About NutriBuddy</h1>
            
            <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At NutriBuddy, we help people achieve their health and fitness goals through personalized guidance. 
                Our platform provides custom workout plans, nutrition advice, and wellness support that fits your 
                lifestyle and needs.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                NutriBuddy was created in 2023 by a team of fitness enthusiasts and developers who wanted to make 
                wellness more accessible. We noticed that many fitness apps were either too complicated or too 
                basic, so we built a platform that gives personalized recommendations while staying simple to use.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Approach</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We focus on complete wellness that includes exercise, nutrition, and mental health. Our platform 
                learns from your habits and preferences to give you recommendations that work for your life. 
                Whether you're just starting or you're already experienced, NutriBuddy helps you progress at 
                your own pace.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-purple-600 font-bold text-xl mb-2">10K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-purple-600 font-bold text-xl mb-2">50+</div>
                  <div className="text-gray-600">Workout Plans</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-purple-600 font-bold text-xl mb-2">95%</div>
                  <div className="text-gray-600">User Satisfaction</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Our Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-purple-100 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">A</span>
                  </div>
                  <h3 className="font-semibold text-lg">Asif Yousaf</h3>
                  <p className="text-purple-600">CEO & Founder</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-purple-100 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">W</span>
                  </div>
                  <h3 className="font-semibold text-lg">Waleed</h3>
                  <p className="text-purple-600">Developer</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-purple-100 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">A</span>
                  </div>
                  <h3 className="font-semibold text-lg">Awais</h3>
                  <p className="text-purple-600">Designer</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-purple-100 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">T</span>
                  </div>
                  <h3 className="font-semibold text-lg">Taha</h3>
                  <p className="text-purple-600">UI/UX Designer</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-purple-100 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">R</span>
                  </div>
                  <h3 className="font-semibold text-lg">Raheel</h3>
                  <p className="text-purple-600">Project Manager</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-purple-100 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">O</span>
                  </div>
                  <h3 className="font-semibold text-lg">Obaid</h3>
                  <p className="text-purple-600">Social Marketing</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
