import { useState } from 'react'
import Select, { SelectOption } from './components/Select'

export const options = [
  { label: 'First', value: 1 },
  { label: 'Second', value: 2 },
  { label: 'Third', value: 3 },
  { label: 'Fourth', value: 4 },
  { label: 'Fifth', value: 5 },
]

function App() {
  const [value, setValue] = useState<SelectOption | undefined>(options[0])
  const [values, setValues] = useState<SelectOption[]>([options[0]])

  return (
    <div className='App'>
      <Select options={options} value={value} setValue={(val) => setValue(val)} />
      <Select
        multiple
        options={options}
        value={values}
        setValue={(val) => setValues(val)}
      />
    </div>
  )
}

export default App
