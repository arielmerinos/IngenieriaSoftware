import { useEffect,useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface DataResponse {
  message: string;
}

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

function App() {
  const [data, setData] = useState<DataResponse | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/hello/")
      .then(response => response.json())
      .then((json: DataResponse) => setData(json))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <div>
      <h1>React + Django con TS y SWC</h1>
      {data ? <p>{data.message}</p> : <p>Cargando...</p>}
    </div>
  );
}

export default App
