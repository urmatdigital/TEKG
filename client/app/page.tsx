import Image from 'next/image';
import Link from 'next/link';
import { FaTruck, FaCalculator, FaBoxOpen, FaHeadset } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Доставка грузов</span>
              <span className="block text-blue-600">с Tulpar Cargo</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Быстрая и надежная доставка грузов по всему миру. Отправляйте посылки с уверенностью.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/auth/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Начать отправку
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <FaTruck className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Отслеживание</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Отслеживайте статус вашей посылки в режиме реального времени
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <FaCalculator className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Калькулятор</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Рассчитайте стоимость доставки онлайн
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <FaBoxOpen className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Упаковка</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Профессиональная упаковка для безопасной транспортировки
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <FaHeadset className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Поддержка</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Круглосуточная поддержка клиентов
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}