export default function ShowEdit({inputShow}) {
    return(
        <div className="grid-item2-content">
            <>
                {/* Name */}
                <input className='inputBox' style={{marginLeft:'10px'}} type='text' name='name' value={inputShow.name} placeholder='Username' readOnly /> <br/> <br/> 

                {/* NRC */}
                <select className='inputBox' style={{marginLeft:'10px', marginRight:'3px'}} value={inputShow.nrcF1} readOnly >
                    <option value='12/' hidden> 12/ </option>
                    <option value='10/' hidden> 10/ </option>
                </select>

                <select className='inputBox' style={{marginRight:'3px'}} value={inputShow.nrcF2} readOnly >
                    <option value='KaMaYa' hidden> KaMaYa </option>
                    <option value='MaYaKa' hidden> MaYaKa </option>
                </select>

                <select className='inputBox' style={{marginRight:'3px'}} value={inputShow.nrcF3} readOnly >
                    <option value='(N)' hidden> (N) </option>
                </select>

                <input className='inputBox' type='text' name='nrc' value={inputShow.nrcNum} placeholder='NRC' readOnly /> <br/> <br/> 

                {/* Phone */}
                <select className='inputBox' style={{marginLeft:'10px', marginRight:'3px'}} value={inputShow.phF1} readOnly >
                    <option value='09' hidden> 09 </option>
                    <option value='01' hidden> 01 </option>
                </select>

                <input className='inputBox' type='text' name='phone' value={inputShow.phNum} placeholder='Phone' readOnly /> <br/> <br/> 

                {/* Fruit */}
                <select className='inputBox' style={{marginLeft:'10px'}} value={inputShow.fruit} readOnly >
                    <option value="" disabled hidden> Select a fruit </option>
                    <option value='Apple' hidden> Apple </option>
                    <option value='Orange' hidden> Orange </option>
                    <option value='Banana' hidden> Banana </option>
                    <option value='Mango' hidden> Mango </option>
                    <option value='Strawberry' hidden> Strawberry </option>
                </select> <br/> <br/> 
                
                {/* Price */}
                <input className='price' style={{marginLeft:'10px'}} type='text' value={inputShow.price} placeholder="Price" readOnly /> <br/> <br/>

                {/* Buttons */}
                {/* <button style={{marginLeft:'10px', marginRight:'88px'}} onClick={eSubmit}> Save </button>

                <button onClick={eReset}> Reset </button> */}
            </>
        </div>
    );
}

// export default ShowEdit;


