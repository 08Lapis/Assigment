import {Link } from 'react-router-dom';

export default function Nav() {

    return(
        <>
            <div style={{margin:'10px'}}>
                <Link to='/form'>
                    <button style={{marginRight:'10px'}}> To Create </button>
                </Link> 
            
                <Link to='/table'>
                    <button> To Table </button> 
                </Link> <br/> <br/>
            </div>
        </>
    );
}

// export default Nav;

