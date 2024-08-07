import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

export default function Table() {
    const [data, setData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectedIDs, setSelectedIDs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectButton, setSelectButton] = useState('Select All');
    const [firstRender,SetFirstRender] = useState(true);
    
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

    const eCheck = (customerID) => {
        setSelectedIDs(prevSelectedIDs => {
            if(prevSelectedIDs.includes(customerID)){ // deselect
                return prevSelectedIDs.filter(addedIDs => addedIDs !== customerID);
            } else { // select
                return [...prevSelectedIDs, customerID];
            }
        })
    };

    const eDelete = () => {
        if (selectedIDs.length === 0) {
            alert('No items selected for deletion.');
            return;
        }

        if (selectedIDs.length === data.length) {
            // alert(`All IDs are selected`);

            var confirm1 = window.confirm(`Are you sure you want to delete all the rows?`);
        } else {
            // alert(`Selected IDs : ${selectedIDs}`);

            var confirm2 = window.confirm(`Are you sure you want to delete the row of ID:${selectedIDs}?`);
        }
        
        if(confirm1 || confirm2){
            
            axios.post('http://localhost/asnphp/delete.php', { dId: selectedIDs })
            .then(response => {
                console.log('Response!!:', response.data.message);
                alert(response.data.message);

                if (response.data.status === 'success'){
                    // Remove the deleted row from the state
                    setData(data.filter(customer => !selectedIDs.includes(customer.ID))); // How did it work? --> only the 'customer objects of the IDs' that are not present in the gID(the IDs that will be deleted or certain actions) are included in the result.
                    
                    setSelectedIDs([]);
                }
            })
            .catch(error => {
                console.error(error);
                alert(error);
            });
        }
    
    };

    const eAllCheck = () => {
        setSelectAll(!selectAll);
    };

    useEffect(() => {
        if (firstRender){  // Prevent running useEffect on the component mount
            SetFirstRender(false);
            return;
        }
        if (selectAll === false) {
            setSelectedIDs([]);
            setSelectButton('Select All')
        } else {
            setSelectedIDs(filteredData.map(customer => customer.ID));
            setSelectButton('Deselect All')
        }
    }, [selectAll])

    // const eEdit = () => {};

    return(
        <div>
            <input style={{marginLeft:'10px'}} type="text" placeholder="Search..." onChange={eSearch} /> <br/> <br/>

            {/* <Link to='/form'>
                <button style={{marginLeft:'10px'}}> Create </button>
            </Link> <br/> <br/> */}

            <button style={{marginLeft:'10px', marginRight:'10px'}} onClick={eAllCheck}> {selectButton} </button> 

            <button onClick={eDelete}> Delete </button>
            
            {/* <button style={{marginLeft:'10px', marginRight:'10px'}} onClick={eEdit}> Edit </button> */}
            <br/> <br/>

            <table>
                <thead>
                    <tr className="tr1">
                        <th></th>
                        <th> ID </th>
                        <th> Name </th>
                        <th> NRC </th>
                        <th> Phone </th>
                        <th> Fruit </th>
                        <th> Price </th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((customer) => (
                        <tr key={customer.ID}>
                            <td className='std1'>
                                <input type="checkbox" checked={selectedIDs.includes(customer.ID)} onChange={() => eCheck(customer.ID)} /> 
                                {/* Here, the arrow function is used as the Event Handler function and React passes the event object to the parameter*/}
                            </td>
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
                        </tr>    
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// export default Table;




