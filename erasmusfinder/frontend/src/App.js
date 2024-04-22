import './App.css';
import {Routes,Route} from 'react-router-dom'

import Navegation from './components/Navegation'
import SignUp from './components/SignUp'
import Home from './components/Home'
import Destination from './components/Destination'
import Profile from './components/Profile'

function App() {
  return (
    <div className="">
      <div className='container p-3'>
      <Navegation/>
        <Routes>
          <Route path ="/" element={<Home/>}/>
          <Route path ="/SignUp" element={<SignUp/>}/>
          <Route path ="/Destination/:id" element={<Destination/>}/>
          <Route path ="/Profile" element={<Profile/>}/>
          <Route path ="/Profile/:id" element={<Profile/>}/>          
        </Routes>
      </div>
    </div>
  );
}

export default App;
