interface Props {
    label: string;
    type: string;
    id: string;
    value: string;
    buttonText: string;
    onSubmit: (e: any) => void;
    // onChange: (e: any) => void;
  }

  const Form = ({label, type, id, value, buttonText, onSubmit} : Props) => {
    return (
      <form className="row g-3" onSubmit={onSubmit}>
        <div className="col-auto">
          <h1>{label}</h1>
          {/* <label className="visually-hidden">{label}</label> */}
          <select name="symbol">
            <option value="BTCUSDT">BTCUSDT</option>
            <option value="ETHUSDT">ETHUSDT</option>
            <option value="SOLUSDT">SOLUSDT</option>
          </select>
          <select name="side">
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <select name="type">
            <option value="LIMIT">LIMIT</option>
            <option value="MARKET">MARKET</option>
            <option value="STOP_LOSS">STOP_LOSS</option>
            <option value="STOP_LOSS_LIMIT">STOP_LOSS_LIMIT</option>
            <option value="TAKE_PROFIT">TAKE_PROFIT</option>
            <option value="TAKE_PROFIT_LIMIT">TAKE_PROFIT_LIMIT</option>
            <option value="LIMIT_MAKER">LIMIT_MAKER</option>
          </select>
          <select name="timeInForce">
            <option value="GTC">GTC</option>
            <option value="IOC">IOC</option>
            <option value="FOK">FOK</option>
          </select>
          <input type={type} id="quantity" name="quantity" placeholder="Quantity"/>
          <input type={type} id="price" name="price" placeholder="Price"/>
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary mb-3">{buttonText}</button>
        </div>
      </form>
    )
  }

export default Form