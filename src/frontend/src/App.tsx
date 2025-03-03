import { useEffect,useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface DataResponse {
  message: string;
}

function App() {
  const [data, setData] = useState<DataResponse | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/hello/")
      .then(response => response.json())
      .then((json: DataResponse) => setData(json))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className='w-full h-full flex-col'>
      <h1 className='text-4xl font-bold'>React + Django con TS y SWC</h1>
      {data ? <p>{data.message}</p> : <p>Cargando...</p>}
    </div>
  );
}

export default App
