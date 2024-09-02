import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Form() {

    const defaultInput = {
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
    };
    const [input, setInput] = useState(defaultInput);

    const navigate = useNavigate();

    const [warn1, setWarn1] = useState();
    const [warn2, setWarn2] = useState();
    const [warn3, setWarn3] = useState();
    const [warn4, setWarn4] = useState();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState('Select a fruit');
    const fruits = ['Apple', 'Orange', 'Banana', 'Mango', 'Strawberry'];
    // const nrcFM1 = ['12/', '10/'];
    // const nrcFM2 = ['KaMaYa', 'MaYaKa'];
    // const nrcFM3 = ['(N)'];
    // const phFM = ['09'];

    const selectBoxRef = useRef();
    const dropDownRef = useRef();

    // Select Fruit
    const eDropDown = () => {
        console.log('Toggle dropdown clicked');
        setIsOpen(!isOpen)
    };

    const eItemSelect = (fruit) => {
        console.log(`Selected fruit: ${fruit}`);
        setSelectedItem(fruit);
        setIsOpen(false);
        setWarn4('');

        let price = '';
        switch (fruit) {
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
        setInput({...input, fruit : fruit, price: price}); // a state can't be updated more than once without the updater function in the same block as only the last one will be updated and the above ones will be overridden.
    };

    const eClickOutside = (event) => {
        if (
            selectBoxRef.current &&
            dropDownRef.current &&
            !selectBoxRef.current.contains(event.target) && // if the clicked element is not inside the Ref
            !dropDownRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', eClickOutside);
        } else {
            document.removeEventListener('mousedown', eClickOutside);
        }
    }, [isOpen]);
    
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

    // Save
    const eSubmit = () => {
        // event.preventDefault();

        if (!input.name) {
            setWarn1("Name field cannot be blank");
        } 
        if (!input.nrcNum) {
            setWarn2("NRC field cannot be blank");
        } 
        if (!input.phNum) {
            setWarn3("Phone Number field cannot be blank");
        } 
        if (!input.fruit) {
            setWarn4("Select field cannot be blank");
        }

        if (!input.name || !input.nrcNum || !input.phNum || !input.fruit) {
            return;
        }

        var patternName = /^[a-zA-Z\d][a-zA-Z\d\s]*$/;
        var patternNameCount = /^[a-zA-Z\d][a-zA-Z\d\s]{0,29}$/;
        var pattern = /^\d+$/;
        var patternNrc = /^\d{6}$/;
        var patternNrcNoAllZero = /^(?!0{6})\d{6}$/;
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
        } else if (!patternNrcNoAllZero.test(input.nrcNum)){ 
            setWarn2("The NRC number cannot be all zeros");
        }

        if (!pattern.test(input.phNum)){  
            setWarn3("Enter only number in the Phone Number field");
        } else if (!patternPh.test(input.phNum)){
            setWarn3("Must have only 6 to 9 digits in the Phone Number field");
        } 

        if (!patternName.test(input.name) || !patternNameCount.test(input.name) || !pattern.test(input.nrcNum) || !patternNrc.test(input.nrcNum) || !patternNrcNoAllZero.test(input.nrcNum) || !pattern.test(input.phNum) || !patternPh.test(input.phNum)){
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

    const eReset = () => {
        setInput(defaultInput);
        setWarn1('');
        setWarn2('');
        setWarn3('');
        setWarn4('');
        setSelectedItem('Select a fruit');
    };

    return(
        <div className='createFormGrid'>
            <div className='createForm'>
                {/* Name */}
                <span className='warns'> {warn1} </span> <br/> 
                <input className='inputBox' type='text' id='name' name='name' value={input.name} onChange={eNameChange} placeholder='Username' /> 
                <br/> <br/>
                

                {/* NRC */}
                <span className='warns'> {warn2} </span> <br/>
                <select className='inputBox' style={{marginRight:'3px'}} value={input.nrcF1} onChange={eNrcF1Select}>
                    <option value='12/'> 12/ </option>
                    <option value='10/'> 10/ </option>
                </select>

                <select className='inputBox' style={{marginRight:'3px'}} value={input.nrcF2} onChange={eNrcF2Select}>
                    <option value='KaMaYa'> KaMaYa </option>
                    <option value='MaYaKa'> MaYaKa </option>
                </select>

                <select className='inputBox' style={{marginRight:'3px'}} value={input.nrcF3} onChange={eNrcF3Select}>
                    <option value='(N)'> (N) </option>
                </select>

                <input className='inputBox' type='text' name='nrc' value={input.nrcNum} onChange={eNrcNumSelect} placeholder='NRC' />
                <br/> <br/> 

                {/* Phone */}
                <span className='warns'> {warn3} </span> <br/>
                <select className='inputBox' style={{marginRight:'3px'}} value={input.phF1} onChange={ePhF1Select}>
                    <option value='09'> 09 </option>
                    <option value='01'> 01 </option>
                </select>

                <input className='inputBox' type='text' name='phone' value={input.phNum} onChange={ePhNumSelect} placeholder='Phone' /> 
                <br/> <br/> 

                {/* Fruit */}
                <span className='warns'> {warn4} </span> <br/>
                <div className='containerForSelectBox'>
                    <div className='selectBox' onClick={eDropDown} ref={selectBoxRef}>
                        {selectedItem}
                    </div>
                    {isOpen && 
                        (
                            <div className='containerForItems' ref={dropDownRef}>
                                {fruits.map((fruit, index) => (
                                    <div key={index} className='fruitItem' onClick={() => eItemSelect(fruit)}>
                                        {fruit}
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div>
                <br/> <br/> 
                
                {/* Price */}
                <input className='price' type='text' value={input.price} placeholder="Price" readOnly /> <br/> <br/> <br/>

                {/* Buttons */}
                <button className='bottom' style={{marginRight:'88px'}} onClick={eSubmit}> Save </button>

                <button className='bottom' onClick={eReset}> Reset </button>
            </div>
        </div>
    );
}

// export default Form;

