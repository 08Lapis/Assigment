import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

function Table() {
    const [data, setData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    
    useEffect(() => {
        axios.get('http://localhost/asnphp/table.php')
        .then(response => {
        const redata = response.data;
        setData(redata);
        // console.log('Response!!:', redata);
        })
        .catch(error => {
        console.error(error);
        alert(error);
        });
    }, []);

    const eSearch = (e) => {
        setSearchInput(e.target.value.toLowerCase());
    };

    const filteredData = data.filter(customer => {
        return (
            customer.ID.toLowerCase().includes(searchInput) ||
            customer.Name.toLowerCase().includes(searchInput) ||
            customer.NRC.toLowerCase().includes(searchInput) ||
            customer.Phone.toLowerCase().includes(searchInput) ||
            customer.Fruit.toLowerCase().includes(searchInput) ||
            customer.Price.toLowerCase().includes(searchInput)
        );
    });

    const eDelete = (dId) => {
        let confirmation = window.confirm(`Are you sure you want to delete the row of ID:${dId}?`)
        if(confirmation){
            // Remove the deleted row from the state
            setData(data.filter(customer => customer.ID !== dId));

            axios.post('http://localhost/asnphp/delete.php', { dId: dId })
            .then(response => {
                console.log('Response!!:', response.data.message);
                alert(response.data.message);
            })
            .catch(error => {
                console.error(error);
                alert.error(error);
            });
        }
    };

    const eDeleteAll = () => {
        let confirmation = window.confirm('Are you sure you want to delete all the rows?')
        if(confirmation){
            // Clear the state
            setData([]);

            axios.post('http://localhost/asnphp/deleteall.php')
            .then(response => {
                console.log('Response!!:', response.data.message)
                alert(response.data.message);
            })
            .catch(error => {
                console.error(error);
                alert.error(error);
            });
        }
    };

    return(
        <div>
            <input style={{marginLeft:'10px'}} type="text" placeholder="Search..." onChange={eSearch} /> <br/> <br/>

            <Link to='/form'>
                <button style={{marginLeft:'10px'}}> Create </button>
            </Link> <br/> <br/>

            <table style={{marginLeft:'10px'}} border="1">
                <thead>
                    <tr>
                        <th> ID </th>
                        <th> Name </th>
                        <th> NRC </th>
                        <th> Phone </th>
                        <th> Fruit </th>
                        <th> Price </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((customer) => (
                        <tr key={customer.ID}>
                            <td>{customer.ID}</td>
                            <td>{customer.Name}</td>
                            <td>{customer.NRC}</td>
                            <td>{customer.Phone}</td>
                            <td>{customer.Fruit}</td>
                            <td>{customer.Price}</td>
                            <td>
                                <Link to={`/edit/${customer.ID}`}>
                                    <button> Edit </button>
                                </Link> 
                            </td>
                            <td>
                                <button onClick={() => eDelete(customer.ID)}> Delete </button>
                            </td>
                        </tr>    
                    ))}
                </tbody>
            </table> <br/> 

            <button style={{marginLeft:'10px'}} onClick={eDeleteAll}> Delete All </button>
        </div>
    );
}

export default Table;

