export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-coffee-800 mb-6">
              Tradição & Sabor
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-coffee-500 to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-coffee-600 max-w-3xl mx-auto leading-relaxed">
              No La Buena, combinamos a tradição gastronómica portuguesa com os sabores únicos de Moçambique, 
              criando uma experiência culinária inesquecível no coração de Maputo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <img 
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Café artesanal" 
                className="rounded-xl shadow-lg w-full h-64 object-cover mb-6 group-hover:shadow-xl transition-shadow duration-300" 
              />
              <h3 className="font-playfair text-2xl font-semibold text-coffee-800 mb-4">Café Artesanal</h3>
              <p className="text-coffee-600">Grãos selecionados e preparados com técnicas tradicionais para o café perfeito.</p>
            </div>
            
            <div className="text-center group">
              <img 
                src="https://pixabay.com/get/g87f0ab0f25d7539b55a2fe40729ef5f8c36b612616a97a556b8ee36ca18700547f8f2d10d48f73bb2b129a500b24dbcdf833098bc9ff1f2f6ef59867d6991c96_1280.jpg" 
                alt="Pastelaria artesanal" 
                className="rounded-xl shadow-lg w-full h-64 object-cover mb-6 group-hover:shadow-xl transition-shadow duration-300" 
              />
              <h3 className="font-playfair text-2xl font-semibold text-coffee-800 mb-4">Pastelaria Fresca</h3>
              <p className="text-coffee-600">Croissants, pastéis e doces preparados diariamente com ingredientes de qualidade.</p>
            </div>
            
            <div className="text-center group">
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Cozinha tradicional" 
                className="rounded-xl shadow-lg w-full h-64 object-cover mb-6 group-hover:shadow-xl transition-shadow duration-300" 
              />
              <h3 className="font-playfair text-2xl font-semibold text-coffee-800 mb-4">Cozinha Tradicional</h3>
              <p className="text-coffee-600">Pratos que celebram a rica herança gastronómica portuguesa e moçambicana.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
