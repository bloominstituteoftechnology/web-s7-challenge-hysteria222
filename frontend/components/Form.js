import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import axios from 'axios'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.

const formSchema = yup.object().shape({
  fullName: yup.string()
    .min(3,validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup.string()
    .oneOf(['S', 'M', 'L]', ], validationErrors.sizeIncorrect),
  pepperoni: yup.boolean(),
  greenPeppers:  yup.boolean(),
  pineapple:  yup.boolean(),
  mushrooms:  yup.boolean(),
  ham:  yup.boolean(),
})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'pepperoni' },
  { topping_id: '2', text: 'greenPeppers' },
  { topping_id: '3', text: 'pineapple' },
  { topping_id: '4', text: 'mushrooms' },
  { topping_id: '5', text: 'ham' },
]



export default function Form() {
  const [values, setValues] = useState({ 
    fullName: '',
    size: '',
    pepperoni: false,
    greenPeppers: false, 
    pineapple: false, 
    mushrooms: false, 
    ham: false
  })
  const [errors, setErrors] = useState({
    fullName: '',
    size: '',
  })
  const [success, setSuccess] = useState()
  const [failure, setFailure] = useState()
  const [enabled, setEnabled] = useState(false)


  useEffect(() => {
    formSchema.isValid(values).then((isValid) => {
      setEnabled(isValid);
    });
  }, [values]);


  const handleChange = evt => {
    let { type, checked, name, value } = evt.target 
    if (type === "checkbox") value = checked
    console.log(value)
    setValues({
      ...values, 
      [name]: value
    })
    yup 
      .reach(formSchema, name)
      .validate(value)
      .then(() => {
        setErrors({ ...errors, [name]: "" });
      })
      .catch((err) => {
        setErrors({ ...errors, [name]: err.errors[0] });
        });
  }

 

  
  const handleSubmit = (evt) => {
    evt.preventDefault();
  
      const aa = []
     for(const prop in values){
      if (values[prop] === true){
        aa.push(prop)
      }
     }
    const payloadID = aa.map(toppingName => {
    const matchingTopping = toppings.find(topping => topping.text === toppingName)
      if (matchingTopping) 
        return matchingTopping.topping_id
      })
    const payload = {
      fullName: values.fullName,
      size: values.size,
      toppings: payloadID
     }
   
    
    axios
      .post("http://localhost:9009/api/order", payload)
      .then((res) => {
        setSuccess(res.data.message);
        setFailure("");
      })
      .catch((err) => {
        setFailure(err.response);
        setSuccess("");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>{success}</div>}
      {failure  && <div className='failure'>{failure}</div>}

      <div className="input-group" >
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" name={"fullName"} onChange={handleChange} value={values.fullName}/>
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name={"size"} onChange={handleChange} value={values.size}>
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        
       {toppings.map((topping) => {
        return (
          <label  key={topping.id}>
          <input
            name={topping.text}
            type="checkbox"
            onChange={handleChange} 
            checked={values[topping.text]}
            value={values[topping.text]}
          />
          {topping.text}<br />
        </label>
        )
        })
      }

      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={!enabled} />
    </form>
  )
}
