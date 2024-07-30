import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Form from './Form';
import Table from './Table';
import Home from './Home';
import Edit from './Edit';

function Nav() {

    return(
        <BrowserRouter>
            <div>
                <Link to='/home'>
                    <button style={{marginLeft:'10px', marginRight:'10px', marginTop:'10px'}}> To Home  </button>
                </Link> 

                <Link to='/form'>
                    <button style={{marginRight:'10px'}}> To Create </button>
                </Link> 
            
                <Link to='/table'>
                    <button style={{marginRight:'10px'}}> To Table </button>
                </Link> <br/> <br/>
            </div>

            <Routes>
                <Route path='/home' element={<Home />} />
                <Route path='/form' element={<Form />} />
                <Route path='/form/:paraId' element={<Form />} />
                <Route path='/table' element={<Table />} />
                <Route path='/edit/:paraId' element={<Edit />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Nav;

