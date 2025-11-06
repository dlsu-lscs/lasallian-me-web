
import React from 'react';
import { App } from '../types/app.types';
import { Button } from '@/components/atoms/Button';
import { FaStar } from 'react-icons/fa';


export interface AppDetailProps {
  app: App;
}

const StarRating = ({ rating, totalReviews }: { rating: number; totalReviews: number }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    const isFilled = rating >= starValue;

    return (
      <FaStar
        key={index}
        className={`w-5 h-5 ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    );
  });

  return (
    <div className="flex items-center space-x-1">
      {stars}
      <span className="text-gray-500 ml-1">({totalReviews})</span>
    </div>
  );
};

export function AppDetail({ app }: AppDetailProps) {

  const totalReviews = 20;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: App Info and Description */}
        <div className="lg:col-span-2">

          {/* Header Section */}
            <div className="flex-1 min-w-0">

              {/* App Icon/Image */}
              <div className="w-full h-48 sm:h-64 mb-6 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                {app.icon ? (
                  <img
                    src={app.icon}
                    alt={`${app.name} header image`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-300 text-3xl font-bold">App Image Placeholder</span>
                )}
              </div>

              <div className="flex items-center justify-between">

                <h1 className="text-4xl font-extrabold text-gray-900 truncate">
                  {app.name}
                </h1>

              </div>

              <p className="text-xl text-gray-600 mt-1">
                By Author Name
              </p>

              <div className="mt-2">
                <StarRating rating={app.rating} totalReviews={totalReviews} />
              </div>
            </div>


          {/* Main Content Tabs/Sections */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">

              {['Description', 'Tags', 'How to use?', 'Links'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`
                            ${item === 'Description' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                            whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm
                        `}
                  aria-current={item === 'Description' ? 'page' : undefined}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Description Content */}
          <div className="prose max-w-none text-gray-700">
            <h2 className="text-2xl font-bold mb-3">Description</h2>
            <p className="mb-4">{app.description}</p>
          </div>

        </div>

        {/* Right Column: Reviews Section */}
        <div className="lg:col-span-1 lg:border-l border-gray-200 lg:pl-8">

          <div className="bg-white rounded-xl p-6 shadow-md mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Leave a Review</h2>

            {/* Star rating input placeholder*/}
            <div className="flex mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <FaStar key={index} className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors" />
              ))}
            </div>

            {/* Input placeholder*/}
            <input
              type="text"
              placeholder="Enter your comment"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
            />

            {/* Submit Button*/}
            <Button variant="primary" className="w-full">
              Submit
            </Button>
          </div>

          {/* Reviews List*/}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
              <Button variant="outline" size="sm" className="flex items-center">
                {/*Filter photo*/}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                Filter
              </Button>
            </div>

            {/* Mock Review Items*/}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border-b border-gray-100 py-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-800">User</p>
                      <StarRating rating={index % 2 === 0 ? 5 : 4} totalReviews={0} />
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">...</button>
                </div>
                <p className="text-gray-700 mt-2">Great app!</p>
                <p className="text-sm text-gray-400 mt-1">Report</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}


