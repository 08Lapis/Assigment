import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

function Table() {
    const [data, setData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectedIDs, setSelectedIDs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectButton, setSelectButton] = useState('Select All');
    const [firstRender,SetFirstRender] = useState(true);
    const [confirmation, SetConfirmation] = useState();
    
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

            alert(`All IDs are selected`);

            SetConfirmation(window.confirm(`Are you sure you want to delete all the rows?`)); 
        } else {
            alert(`Selected IDs : ${selectedIDs}`);

            SetConfirmation(window.confirm(`Are you sure you want to delete the row of ID:${selectedIDs}?`)); 
        }
        
        if(confirmation){
            // Remove the deleted row from the state
            setData(data.filter(customer => !selectedIDs.includes(customer.ID))); // How did it work? --> only the 'customer objects of the IDs' that are not present in the gID(the IDs that will be deleted or certain actions) are included in the result.
            
            setSelectedIDs([]);
            
            axios.post('http://localhost/asnphp/delete.php', { dId: selectedIDs })
            .then(response => {
                console.log('Response!!:', response.data.message);
                alert(response.data.message);
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

    return(
        <div>
            <input style={{marginLeft:'10px'}} type="text" placeholder="Search..." onChange={eSearch} /> <br/> <br/>

            <Link to='/form'>
                <button style={{marginLeft:'10px'}}> Create </button>
            </Link> <br/> <br/>

            {/* <button style={{marginLeft:'10px'}} onClick={eDelete}> Delete </button> <br/> <br/> */}

            <table style={{marginLeft:'10px'}} border="1">
                <thead>
                    <tr>
                        <th></th>
                        <th> ID </th>
                        <th> Name </th>
                        <th> NRC </th>
                        <th> Phone </th>
                        <th> Fruit </th>
                        <th> Price </th>
                        <th> Action </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((customer) => (
                        <tr key={customer.ID}>
                            <td>
                                <input type="checkbox" checked={selectedIDs.includes(customer.ID)} onChange={() => eCheck(customer.ID)} /> 
                                {/* Here, the arrow function is used as the Event Handler function and React passes the event object to the parameter*/}
                            </td>
                            <td style={{paddingLeft:'10px', paddingRight:'10px'}}>{customer.ID}</td>
                            <td style={{paddingLeft:'10px', paddingRight:'10px'}}>{customer.Name}</td>
                            <td style={{paddingLeft:'10px', paddingRight:'10px'}}>{customer.NRC}</td>
                            <td style={{paddingLeft:'10px', paddingRight:'10px'}}>{customer.Phone}</td>
                            <td style={{paddingLeft:'10px', paddingRight:'10px'}}>{customer.Fruit}</td>
                            <td style={{paddingLeft:'10px', paddingRight:'10px'}}>{customer.Price}</td>
                            <td style={{paddingLeft:'10px', paddingRight:'10px', paddingTop:'3px', paddingBottom:'3px'}}>
                                <Link to={`/edit/${customer.ID}`}>
                                    <button> Edit </button>
                                </Link> 
                            </td>
                            {/* <td>
                                <button onClick={() => eDelete(customer.ID)}> Delete </button>
                            </td> */}
                        </tr>    
                    ))}
                </tbody>
            </table> <br/> 

            <button style={{marginLeft:'10px', marginRight:'10px'}} onClick={eDelete}> Delete </button>
            <button onClick={eAllCheck}> {selectButton} </button>
        </div>
    );
}

export default Table;




