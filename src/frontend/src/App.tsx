import { useEffect, useState } from 'react'
import LoginModal from './components/LoginModal';
import './App.css'

interface DataResponse {
  message: string;
}

function App() {
  const [data, setData] = useState<DataResponse | null>(null);
  const [activeTab, setActiveTab] = useState('oportunidades');

  useEffect(() => {
    fetch("http://localhost:8000/api/hello/")
      .then(response => response.json())
      .then((json: DataResponse) => setData(json))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // Cursos/oportunidades destacados
  const featuredItems = [
    {
      title: "Excel - de básico a Intermedio",
      provider: "Impulsa Academy",
      category: "Herramientas",
      date: "Abierto hasta Mar 31, 25",
      image: "/excel-course.jpg"
    },
    {
      title: "Business English: Listening and Speaking",
      provider: "Global Learning",
      category: "Idiomas",
      date: "Abierto hasta Mar 31, 25",
      image: "/english-course.jpg"
    },
    {
      title: "Inteligencia Artificial y Productividad",
      provider: "Tech Solutions",
      category: "Herramientas",
      date: "Abierto hasta Mar 31, 25",
      image: "/ai-course.jpg"
    },
    {
      title: "Marketing Digital",
      provider: "Digital University",
      category: "Habilidades",
      date: "Abierto hasta Mar 31, 25",
      image: "/marketing-course.jpg"
    }
  ];

  return (
    <section className="w-full min-h-screen">
      {/* Header */}
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-blue-600 font-bold text-2xl mr-2">Impulsa</div>
            <span className="text-gray-700">| Tu Futuro</span>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">Explora</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Blog</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Quiénes somos</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Ayuda</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button>...</button>
            <LoginModal />
            <button>...</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Lorem ipsum dolor sit amet, consectetur adipiscing elit</h1>
          <ul className="space-y-4 mb-6">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-2 text-gray-700">Cursos, contenidos y becas, sin coste para ti</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-2 text-gray-700">Para todos, acceso universal garantizado</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-2 text-gray-700">Solo necesitas registrarte</span>
            </li>
          </ul>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center hover:bg-blue-700 transition">
            Comienza a explorar
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="md:w-1/2 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="mb-2 flex items-center">
              <span className="text-blue-600 font-medium mr-2">Cursos</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="mb-2 flex items-center">
              <span className="text-blue-600 font-medium mr-2">Contenidos</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg col-span-2">
            <div className="mb-2 flex items-center">
              <span className="text-blue-600 font-medium mr-2">Becas</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
          <p className="text-center text-gray-600 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt<br />
            ut labore et dolore magna aliqua.
          </p>

          {/* Tabs */}
          <div className="max-w-md mx-auto mb-8 bg-white rounded-lg overflow-hidden border">
            <div className="flex">
              <button 
                className={`flex-1 py-3 ${activeTab === 'top10' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setActiveTab('top10')}
              >
                Top 10
              </button>
              <button 
                className={`flex-1 py-3 ${activeTab === 'novedades' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setActiveTab('novedades')}
              >
                Novedades
              </button>
            </div>
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={`/api/placeholder/400/320`} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">Curso Destacado</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 w-4 h-4 border border-gray-300 mr-2"></div>
                    <span className="text-sm text-gray-600">{item.provider}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs px-3 py-1 bg-blue-100 rounded-full text-blue-600">{item.category}</span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Resolvemos tus dudas</h2>
          
          {/* FAQ Item 1 - Expanded by default */}
          <div className="mb-4 border rounded-lg overflow-hidden bg-white">
            <div className="flex items-center justify-between p-4 cursor-pointer">
              <h3 className="font-medium">Lorem ipsum dolor sit amet, consectetur adipiscing elit?</h3>
              <button className="text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>
            <div className="p-4 pt-0 border-t">
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              <p>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
                mollit anim id est laborum.
              </p>
            </div>
          </div>
          
          {/* FAQ Item 2 - Collapsed */}
          <div className="mb-4 border rounded-lg overflow-hidden bg-white">
            <div className="flex items-center justify-between p-4 cursor-pointer">
              <h3 className="font-medium">Ut enim ad minim veniam, quis nostrud exercitation?</h3>
              <button className="text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* FAQ Item 3 - Collapsed */}
          <div className="mb-6 border rounded-lg overflow-hidden bg-white">
            <div className="flex items-center justify-between p-4 cursor-pointer">
              <h3 className="font-medium">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum?</h3>
              <button className="text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <button className="text-blue-600 font-medium px-6 py-2 rounded-full border border-blue-600 hover:bg-blue-50 transition">
              Ver más preguntas
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-700">Catálogo</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Becas</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Cursos con acceso directo</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Cursos con plazas</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Contenido</a></li>
              </ul>
            </div>
            
            {/* Column 2 */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-700">Categorías</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Ayuda económica</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Habilidades</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Herramientas</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Idiomas</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Investigación</a></li>
              </ul>
            </div>
            
            {/* Column 3 */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-700">Ediciones periódicas</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Global Challenge</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Becas Internacionales</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Becas de Investigación</a></li>
              </ul>
            </div>
            
            {/* Column 4 */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-700">Impulsa Tu Futuro</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Sobre nosotros</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Nuestro equipo</a></li>
              </ul>
              
              <h3 className="font-bold text-lg mt-6 mb-4 text-blue-700">Webs del grupo</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Impulsa Innovation</a></li>
              </ul>
            </div>
            
            {/* Column 5 */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-700">Ayuda</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Centro de ayuda</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Contacto</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* API Response Display (for debugging) */}
      <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
        {data ? <p>API Response: {data.message}</p> : <p>Cargando API...</p>}
      </div>
    </section>
  );
}

export default App