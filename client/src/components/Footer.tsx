export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-16 border-t border-gray-200 pt-8 pb-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-500 text-sm mb-4 md:mb-0">
          &copy; {currentYear} Human-Sounding AI Summarizer. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-gray-700">Privacy Policy</a>
          <a href="#" className="text-gray-500 hover:text-gray-700">Terms of Service</a>
          <a href="#" className="text-gray-500 hover:text-gray-700">Contact</a>
        </div>
      </div>
    </footer>
  );
}
