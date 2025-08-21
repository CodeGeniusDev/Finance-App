import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 bg-gray-100 dark:bg-gray-700 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          © {currentYear}{' '}
          <a 
            href="https://portfolio.triplealpha.blog" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            CodeGenius.Dev
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
