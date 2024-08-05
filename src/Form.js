import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Form() {

    const [input, setInput] = useState({
        name:'',
        nrcF1:'12/',
        nrcF2:'KaMaYa',
        nrcF3:'(N)',
        nrcNum:'',
        phF1:'09',
        phNum:'',
        fruit:'',
        price:'',
        id:''
    });

    const navigate = useNavigate();

    const [warn1, setWarn1] = useState();
    const [warn2, setWarn2] = useState();
    const [warn3, setWarn3] = useState();
    const [warn4, setWarn4] = useState();
    
    // Name 
    const eNameChange = (event) => {
        setInput({...input, name : event.target.value});
        setWarn1('');
    }
    
    // NRC 
    const eNrcF1Select = (event) => {
        setInput({...input, nrcF1 : event.target.value});
    }

    const eNrcF2Select = (event) => {
        setInput({...input, nrcF2 : event.target.value});
    }

    const eNrcF3Select = (event) => {
        setInput({...input, nrcF3 : event.target.value});
    }

    const eNrcNumSelect = (event) => {
        setInput({...input, nrcNum : event.target.value});
        setWarn2('');
    }

    // Phone 
    const ePhF1Select = (event) => {
        setInput({...input, phF1 : event.target.value});
    }

    const ePhNumSelect = (event) => {
        setInput({...input, phNum : event.target.value});
        setWarn3('');
    }

    // Fruit and Price
    const eSelect = (event) => {
        const inFru = event.target.value;
        setWarn4('');
        const fruits = inFru; 
        let price = '';
        switch (fruits) {
            case "Apple":
                price = "$10";
                break;
            case "Banana":
                price = "$20";
                break;
            case "Orange":
                price = "$15";
                break;
            case "Strawberry":
                price = "$25";
                break;
            case "Mango":
                price = "$30";
                break;
            default:
                price = "";
                break;
        }
        setInput({...input, fruit : inFru, price: price}); // a state can't be updated more than once in the same block as only the last one will be updated and the above ones will be overridden.
    }

    // Save
    const eSubmit = (event) => {
        // event.preventDefault();

        if (!input.name) {
            setWarn1("Name field can't be blank");
        } 
        if (!input.nrcNum) {
            setWarn2("NRC field can't be blank");
        } 
        if (!input.phNum) {
            setWarn3("Phone Number field can't be blank");
        } 
        if (!input.fruit) {
            setWarn4("Select field can't be blank");
        }

        if (!input.name || !input.nrcNum || !input.phNum || !input.fruit) {
            return;
        }

        var patternName = /^[a-zA-Z\d][a-zA-Z\d\s]*$/;
        var patternNameCount = /^[a-zA-Z\d][a-zA-Z\d\s]{0,29}$/;
        var pattern = /^\d+$/;
        var patternNrc = /^\d{6}$/;
        var patternPh = /^\d{6,9}$/;

        if (!patternName.test(input.name)){
            setWarn1("Special characters are not allowed");
        } else if (!patternNameCount.test(input.name)){
            setWarn1("Must have only 30 characters in the Name field");
        }

        if (!pattern.test(input.nrcNum)){
            setWarn2("Enter only number in the NRC field");
        } else if (!patternNrc.test(input.nrcNum)){
            setWarn2("Must have only 6 digits in the NRC field");
        }

        if (!pattern.test(input.phNum)){  
            setWarn3("Enter only number in the Phone Number field");
        } else if (!patternPh.test(input.phNum)){
            setWarn3("Must have only 6 to 9 digits in the Phone Number field");
        } 

        if (!patternName.test(input.name) || !patternNameCount.test(input.name) || !pattern.test(input.nrcNum) || !patternNrc.test(input.nrcNum) || !pattern.test(input.phNum) || !patternPh.test(input.phNum)){
            return;
        };
        
        //Submit
        let request = {
            name: input.name,
            nrc: input.nrcF1+input.nrcF2+input.nrcF3+input.nrcNum,
            phone: input.phF1+input.phNum,
            fruit: input.fruit,
            price: input.price
        }
        axios.post('http://localhost/asnphp/form.php', request)
        .then(response => {
            let RP = response.data.message;
            let RPD = response.data.duplicateMessage;

            if(RP === "Data saved successfully"){
                alert(response.data.message);
                navigate('/table');
                return;
            } 
            if (RPD.includes("This name already exists")){
                setWarn1("This name already exists");
            } 
            if (RPD.includes("This NRC already exists")){
                setWarn2("This NRC already exists");
            } 
            if (RPD.includes("This phone number already exists")){
                setWarn3("This phone number already exists");
            }
        })
        .catch(error => {
            console.error(error);
            alert(error);
        });
    };

    const eReset = (event) => {
        setInput({
            name:'',
            nrcF1:'12/',
            nrcF2:'KaMaYa',
            nrcF3:'(N)',
            nrcNum:'',
            phF1:'09',
            phNum:'',
            fruit:'',
            price:'',
            id:''
        });
        
        setWarn1('');
        setWarn2('');
        setWarn3('');
        setWarn4('');
    }

    return(
        <>
            {/* Name */}
            <input style={{marginLeft:'10px'}} type='text' name='name' value={input.name} onChange={eNameChange} placeholder='Username' /> 
            <span style={{color : 'red', fontWeight : 'bold'}}> {warn1} </span> <br/> <br/> 

            {/* NRC */}
            <select style={{marginLeft:'10px', marginRight:'3px'}} value={input.nrcF1} onChange={eNrcF1Select}>
                <option value='12/'> 12/ </option>
                <option value='10/'> 10/ </option>
            </select>

            <select style={{marginRight:'3px'}} value={input.nrcF2} onChange={eNrcF2Select}>
                <option value='KaMaYa'> KaMaYa </option>
                <option value='MaYaKa'> MaYaKa </option>
            </select>

            <select style={{marginRight:'3px'}} value={input.nrcF3} onChange={eNrcF3Select}>
                <option value='(N)'> (N) </option>
            </select>

            <input type='text' name='nrc' value={input.nrcNum} onChange={eNrcNumSelect} placeholder='NRC' />
            <span style={{color : 'red', fontWeight : 'bold'}}> {warn2} </span> <br/> <br/> 

            {/* Phone */}
            <select style={{marginLeft:'10px', marginRight:'3px'}} value={input.phF1} onChange={ePhF1Select}>
                <option value='09'> 09 </option>
                <option value='01'> 01 </option>
            </select>

            <input type='text' name='phone' value={input.phNum} onChange={ePhNumSelect} placeholder='Phone' /> 
            <span style={{color : 'red', fontWeight : 'bold'}}> {warn3} </span> <br/> <br/> 

            {/* Fruit */}
            <select style={{marginLeft:'10px'}} value={input.fruit} onChange={eSelect}>
                <option value="" disabled hidden> Select a fruit </option>
                <option value='Apple'> Apple </option>
                <option value='Orange'> Orange </option>
                <option value='Banana'> Banana </option>
                <option value='Mango'> Mango </option>
                <option value='Strawberry'> Strawberry </option>
            </select>
            <span style={{color : 'red', fontWeight : 'bold'}}> {warn4} </span> <br/> <br/> 
            
            {/* Price */}
            <input style={{marginLeft:'10px'}} type='text' value={input.price} placeholder="Price" readOnly /> <br/> <br/>

            {/* Buttons */}
            <button style={{marginLeft:'10px', marginRight:'88px'}} onClick={eSubmit}> Save </button>

            <button onClick={eReset}> Reset </button>
        </>
    );
}

export default Form;

