import React from 'react';

const BlogCard = ({ date, title, description, image, author }) => {
  return (
    <div className="bg-[#334155] rounded-md overflow-hidden shadow-lg">
      <img className="w-full h-48 object-cover" src={image} alt={title} />
      <div className="p-4">
        <div className="text-gray-400 text-sm mb-2">{date}</div>
        <div className="text-white font-bold text-lg mb-2">{title}</div>
        <p className="text-gray-400 text-sm">{description}</p>
        <div className="text-gray-400 text-xs mt-2">{author}</div>
      </div>
    </div>
  );
}

export default BlogCard;
