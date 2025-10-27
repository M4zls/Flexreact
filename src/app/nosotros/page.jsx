'use client';

export default function Example() {
  return (
    <div className="relative isolate overflow-hidden bg-black min-h-screen py-32 sm:py-40">
      <img
        alt=""
        src="https://wallpaper.forfun.com/fetch/90/90bcf5ee927d2ac4487970ebb937bef2.jpeg"
        className="absolute inset-0 -z-10 size-full object-cover object-center scale-110"
      />
      <div
        aria-hidden="true"
        className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
      >
      </div>
      <div
        aria-hidden="true"
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0"
      >
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">Sobre Nosotros</h2>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
            Flex está compuesto por dos personas apasionadas que buscan expandir el mundo de las zapatillas. 
            Creemos en la calidad, el estilo y la autenticidad de cada par que ofrecemos.
          </p>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
            Nuestra misión es llevar las mejores marcas y modelos a cada rincón, conectando a los amantes del calzado 
            con productos que no solo visten, sino que cuentan historias y forjan caminos.
          </p>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
            En Flex, no solo vendemos zapatillas, creamos experiencias. Cada producto es seleccionado cuidadosamente 
            para asegurar que nuestros clientes reciban lo mejor en diseño, comodidad y estilo.
          </p>
        </div>
      </div>
    </div>
  )
}