import React, { useState, useEffect, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AsnCss.css'; 
import ShowEdit from './ShowEdit';

function Edit() {

    const [input, setInput] = useState({
        name:"",
        nrcF1:"12/",
        nrcF2:"KaMaYa",
        nrcF3:"(N)",
        nrcNum:"",
        phF1:"09",
        phNum:"",
        fruit:"",
        price:"",
        id:""
    });

    const [inputShow, setInputShow] = useState({
        name:"",
        nrcF1:"",
        nrcF2:"",
        nrcF3:"",
        nrcNum:"",
        phF1:"",
        phNum:"",
        fruit:"",
        price:"",
        // id:""
    });

    const [reset, setReset] = useState({
        name:"",
        nrcF1:"",
        nrcF2:"",
        nrcF3:"",
        nrcNum:"",
        phF1:"",
        phNum:"",
        fruit:"",
        price:""
    });

    const {paraId} = useParams();
    const navigate = useNavigate();

    const [warn1, setWarn1] = useState();
    const [warn2, setWarn2] = useState();
    const [warn3, setWarn3] = useState();
    const [warn4, setWarn4] = useState();
    const [warn5, setWarn5] = useState(false);
    const [warn6, setWarn6] = useState('Original Record');

    const paraIdRef = useRef();
    
    useEffect(() => {
        if (paraId !== paraIdRef.current) { // 'current' is the property of paraIdRef
            paraIdRef.current = paraId;
 //The logic here is, if Ref doesn't have paraId, Ref will be assigned with ParaId and the rest of the code will continue, 
 //and when the useEffect runs again, 
 //it will check if Ref has paraId, if it does, it will skip the code inside

            if (paraId) { // if paraId is 'undefined' it will become falsy
                
                console.log(`There is a parameter, ID : ${paraId}`);

                axios.get(`http://localhost/asnphp/edit.php?id=${paraId}`)
                .then(response => {
                    console.log("Response Data is", response.data)
                    if(response.data.error) {
                        alert(response.data.error);
                        setWarn5(true); 
                        return;
                    }

                    const {ID, Name, NRC, Phone, Fruit, Price} = response.data;

                    const rexNrc = NRC.match(/\d+$/);

                    const rexFormat1Nrc = NRC.match(/^\d+\//);

                    const rexFormat2Nrc = NRC.match(/[a-zA-Z]+/);

                    const rexFormat3Nrc = NRC.match(/\([a-zA-Z]\)/);

                    const rexPhF1 = Phone.match(/^\d{2}/);

                    const rexPh = Phone.replace(/^\d{2}/, '');

                    setInput({ 
                        ...input,
                        id:ID,
                        name:Name,
                        nrcF1:rexFormat1Nrc,
                        nrcF2:rexFormat2Nrc,
                        nrcF3:rexFormat3Nrc,
                        nrcNum:rexNrc,
                        phF1:rexPhF1,
                        phNum:rexPh,
                        fruit:Fruit,
                        price:Price
                    });

                    setInputShow({ 
                        ...inputShow,
                        name:Name,
                        nrcF1:rexFormat1Nrc,
                        nrcF2:rexFormat2Nrc,
                        nrcF3:rexFormat3Nrc,
                        nrcNum:rexNrc,
                        phF1:rexPhF1,
                        phNum:rexPh,
                        fruit:Fruit,
                        price:Price
                    });

                    setReset({ 
                        ...reset,
                        name:Name,
                        nrcF1:rexFormat1Nrc,
                        nrcF2:rexFormat2Nrc,
                        nrcF3:rexFormat3Nrc,
                        nrcNum:rexNrc,
                        phF1:rexPhF1,
                        phNum:rexPh,
                        fruit:Fruit,
                        price:Price
                    });
                })
                .catch(error => {
                    console.error(error);
                    alert("Core error: ",error);
                });
            }
        }
        
    }, [paraId]);
    
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

        if(warn5 === true){
            alert("You can't edit a record that does not exist");
            navigate('/table');
            return;
        }

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
            setWarn2("NRC number can't be all zero");
        }

        if (!pattern.test(input.phNum)){  
            setWarn3("Enter only number in the Phone Number field");
        } else if (!patternPh.test(input.phNum)){
            setWarn3("Must have only 6 to 9 digits in the Phone Number field");
        } 

        if (!patternName.test(input.name) || !patternNameCount.test(input.name) || !pattern.test(input.nrcNum) || !patternNrc.test(input.nrcNum) || !patternNrcNoAllZero.test(input.nrcNum) || !pattern.test(input.phNum) || !patternPh.test(input.phNum)){
            return;
        };
        
        // Edit
        let requestE = {
            id: input.id,
            name: input.name,
            nrc: input.nrcF1+input.nrcF2+input.nrcF3+input.nrcNum,
            phone: input.phF1+input.phNum,
            fruit: input.fruit,
            price: input.price
        }
        console.log(`There is a parameter, ID : ${paraId}`);
        console.log("Payload ::::",requestE);
        axios.post(`http://localhost/asnphp/edit.php?`, requestE)
        .then(response => {
            if(response.data.status === "errorPSE"){
                alert(response.data.message);
                return;
            }
            
            let RP = response.data.status;
            let RPD = response.data.duplicateMessage;

            if(RP === "success"){
                alert(response.data.message);
                setWarn6('Edited Record');

                const NameE = response.data.EditedData.username;
                const NRCE = response.data.EditedData.nrc;
                const PhoneE = response.data.EditedData.phone;
                const FruitE = response.data.EditedData.fruit;
                const PriceE = response.data.EditedData.fruitPrice;

                    const rexNrc = NRCE.match(/\d+$/);

                    const rexFormat1Nrc = NRCE.match(/^\d+\//);

                    const rexFormat2Nrc = NRCE.match(/[a-zA-Z]+/);

                    const rexFormat3Nrc = NRCE.match(/\([a-zA-Z]\)/);

                    const rexPhF1 = PhoneE.match(/^\d{2}/);

                    const rexPh = PhoneE.replace(/^\d{2}/, '');

                    setInputShow({ 
                        ...inputShow,
                        name:NameE,
                        nrcF1:rexFormat1Nrc,
                        nrcF2:rexFormat2Nrc,
                        nrcF3:rexFormat3Nrc,
                        nrcNum:rexNrc,
                        phF1:rexPhF1,
                        phNum:rexPh,
                        fruit:FruitE,
                        price:PriceE
                    });

                console.log(`Edited Data : `, response.data.EditedData)
                // navigate('/table');
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
            console.error(error.message);
            alert(error.message);
        });
    };

    const eReset = () => {
        setInput({...input,
            name:reset.name,
            nrcF1:reset.nrcF1,
            nrcF2:reset.nrcF2,
            nrcF3:reset.nrcF3,
            nrcNum:reset.nrcNum,
            phF1:reset.phF1,
            phNum:reset.phNum,
            fruit:reset.fruit,
            price:reset.price
        });
        
        setWarn1('');
        setWarn2('');
        setWarn3('');
        setWarn4('');
    }

    return(
                    
        <div className="grid-container">
            <div className="grid-item1">
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
            </div>
            <ShowEdit inputShow={inputShow} />
            <div className="grid-item3"> {warn6} </div>
        </div>
    );
}

export default Edit;

