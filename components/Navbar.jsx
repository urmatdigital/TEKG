import Link from 'next/link';
import { LinkComponent } from '@/components/ui/LinkComponent';

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center px-4 h-16">
        <div className="flex items-center space-x-8">
          <LinkComponent href="/" className="flex items-center">
            <img
              src="/tulpar_logo.svg"
              alt="Tulpar"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <div className="logo-text ml-2">
              <span className="primary">TULPAR</span>{" "}
              <span className="accent">EXPRESS</span>
            </div>
          </LinkComponent>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/services/calculator" 
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
            >
              Калькулятор
            </Link>
            {/* Здесь можно добавить другие пункты меню */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 