import { useState } from 'react'

const options = [
  { label: 'First', value: 1 },
  { label: 'Second', value: 2 },
  { label: 'Third', value: 3 },
  { label: 'Fourth', value: 4 },
  { label: 'Fifth', value: 5 },
]

function App() {
  const [value, setValue] = useState(options[0])
  const [isOpen, setIsOpen] = useState(true)

  const [values, setValues] = useState([options[0]])
  const [isOpen2, setIsOpen2] = useState(true)

  function selectOption(selectedOption: typeof options[0]) {
    if (values.includes(selectedOption)) {
      setValues(values.filter((value) => value !== selectedOption))
    } else {
      // onChange([...value2, option])
      setValues([...values, selectedOption])
    }
  }

  return (
    <div className='App'>
      <div
        className='select'
        onClick={() => setIsOpen((prev) => !prev)}
        tabIndex={0} // close on click outside
        onBlur={() => setIsOpen(false)}
      >
        <div className='value'>{value.label}</div>
        <div className='divider'></div>
        <div className='caret'></div>
        <ul className={['options', isOpen ? 'show' : ''].join(' ')}>
          {options.map((option) => (
            <li
              onClick={() => setValue(option)}
              key={option.value}
              className={['option', value === option ? 'active' : ''].join(' ')}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
      {/* Multiple option */}
      <div
        className='select'
        onClick={() => setIsOpen2((prev) => !prev)}
        tabIndex={0} // close on click outside
        onBlur={() => setIsOpen2(false)}
      >
        <div className='value'>
          {values.map((value) => (
            <div className='valueChip' onClick={(e) => e.stopPropagation()}>
              {/* prevent open close if click on text */}
              {value.label}
              <span className='remove-btn' onClick={() => selectOption(value)}>
                &times;
              </span>
            </div>
          ))}
        </div>
        <div className='divider'></div>
        <div className='caret'></div>
        <ul className={['options', isOpen2 ? 'show' : ''].join(' ')}>
          {options.map((option) => (
            <li
              onClick={() => selectOption(option)}
              key={option.value}
              className={['option', values.includes(option) ? 'active' : ''].join(' ')}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
