import React from "react";
// import "./MonetizeBanner.css"; // optional for custom styles
// import bannerImage from "../assets"; 

const MonetizeBanner: React.FC = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-[#16121c] border border-pink-600/40 rounded-xl p-6 my-6 mx-4 ">
      <div className="flex-1 text-white mb-6 md:mb-0">
        <h2 className="text-3xl font-bold text-pink-500 mb-3">Earn Money With Us</h2>
        <p className="text-lg text-gray-300 mb-4">
          Transform your creativity into income. Join thousands of creators monetizing their content on LustyHub!
        </p>
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-pink-500 text-xl">$</span> Competitive Payouts
          </div>
          <div className="flex items-center gap-2">
            <span className="text-pink-500 text-xl">📈</span> Weekly Payments
          </div>
          <div className="flex items-center gap-2">
            <span className="text-pink-500 text-xl">🎖️</span> Creator Support
          </div>
        </div>
        <div className="flex gap-4">
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg">
            Become a Creator
          </button>
          <button className="bg-[#1f1b2e] border border-white/20 text-white px-6 py-2 rounded-lg">
            Learn More
          </button>
        </div>
      </div>
      <div className="w-full md:w-[300px] flex justify-center">
        <img
          src="/creator-lab.jpg" // ✅ PUBLIC FOLDER path
          alt="Creator working"
          className="rounded-lg w-full object-cover max-h-[250px]"
        />
      </div>
    </section>
  );
};


export default MonetizeBanner;
