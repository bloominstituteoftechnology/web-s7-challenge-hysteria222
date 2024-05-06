import React, { useEffect, useState } from 'react'
import * as yup from 'yup'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.

const formSchema = yup.object().shape({
  fullName: yup.string().trim()
    .min(3, 'full name must be at least 3 characters')
    .max(20, 'full name must be at most 20 characters')
    .required(), 
  size: yup.string()
    .oneOf(['S', 'M', 'L]', ], validationErrors.sizeIncorrect)
    .required()
})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const intitialValues = {
  fullName: '',
  size: '',
  toppings: [], 
}

const intitialErrors = {
  
}

export default function Form() {
  const [values, setValues] = useState(intitialValues)
  const [errors, setErrors] = useState()
  const [success, setSuccess] = useState()
  const [failure, setFailure] = useState()

  const handleChange = (evt) => {
    let { type, checked, name, value } = evt.target;
    if (type === "checkbox") value = checked;
    setValues({ ...values, [name]: value });
    
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



  return (
    <form>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>Thank you for your order!</div>}
      {failure  && <div className='failure'>Something went wrong</div>}

      <div className="input-group" onChange={handleChange}>
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" />
        </div>
        {errors && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size">
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="1">S</option>
            <option value="2">M</option>
            <option value="3">L</option>
          </select>
        </div>
        {errors && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        
       {toppings.map((topping) => {
        return (
          <label key={topping.id}>
          <input
            name={topping.text}
            type="checkbox"
          />
          {topping.text}<br />
        </label>
        )
        })
      }

      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" />
    </form>
  )
}
