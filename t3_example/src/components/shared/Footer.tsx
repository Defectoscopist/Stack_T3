
export const Footer = () => {
  return (
    <footer className="bg-[#2a2523] text-[#f5f5f5]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-[#f5f5f5]">Brand</h3>
            <p className="mt-3 text-sm text-[#cccccc]">Премиальная бытовая техника, продуманная до мелочей.</p>
          </div>
          <div>
            <h4 className="font-semibold text-[#f5f5f5]">Компания</h4>
            <ul className="mt-3 space-y-1 text-sm text-[#cccccc]">
              <li>О нас</li>
              <li>Карьера</li>
              <li>Партнёрам</li>
              <li>Контакты</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#f5f5f5]">Поддержка</h4>
            <ul className="mt-3 space-y-1 text-sm text-[#cccccc]">
              <li>Гарантия</li>
              <li>Сервис</li>
              <li>FAQ</li>
              <li>Доставка и оплата</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#f5f5f5]">Связаться</h4>
            <p className="mt-3 text-sm text-[#cccccc]">8 (800) 333-33-33</p>
            <p className="text-sm text-[#cccccc]">Москва, ул. Тверская, 7</p>
          </div>
        </div>

        <div className="border-t border-acent pt-4 text-center text-xs text-[#cccccc]">
          © {new Date().getFullYear()} Brand. Все права защищены.
        </div>
      </div>
    </footer>
  );
};