interface Props {
    label: string;
    type: string;
    id: string;
    value: string;
    valueArray: string;
    buttonText: string;
    placeholder: string;
    onSubmit: (e: any) => void;
    onChange: (e: any) => void;
  }

const Form = ({label, value, valueArray, onSubmit, onChange}: Props) => {
    return (
        <form onSubmit={onSubmit}>
            <label>
                {label}
            <select value={value} onChange={onChange}>
                {valueArray.split(',').map((val: string) => {
                    return <option value={val}>{val}</option>
                })}
                {/* <option value="BTCUSDT">BTC-USDT</option>
                <option value="ETHUSDT">ETH-USDT</option>
                <option value="SOLUSDT">SOL-USDT</option> */}
            </select>
            </label>
            <input type="submit" value="Submit" />
        </form>
        // <form className="row g-3" onSubmit={onSubmit}>
        //     <div className="col-auto">
        //         <h1>{label}</h1>
        //         {/* <label className="visually-hidden">{label}</label> */}
        //         <input type={type} className="form-control-plaintext" id={id} value={value} placeholder={placeholder} onChange={onChange}/>
        //     </div>
        //     <div className="col-auto">
        //         <button type="submit" className="btn btn-primary mb-3">{buttonText}</button>
        //     </div>
        // </form>
    )
};

export default Form