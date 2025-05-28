"use client";

const brands = [
  { name: 'plum' },
  { name: 'treebo' },
  { name: 'ZOSTEL' },
  { name: 'vividseats' },
  { name: 'Great Learning' },
];

export default function Brands() {
  return (
    <section className="w-full bg-[#08160b] text-white py-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center px-4">
        <p className="text-lg font-semibold mb-6 text-center">
          Powering 5000+ businesses across 50+ countries
        </p>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {brands.map((brand) => (
            <span key={brand.name} className="text-2xl font-bold opacity-80 uppercase tracking-wide">
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
} 