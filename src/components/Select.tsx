import { useEffect, useRef, useState } from 'react'
import { options } from '../App'

export type SelectOption = {
  label: string
  value: string | number
}

type MultipleSelectProps = {
  multiple: true
  value: SelectOption[]
  setValue: (value: SelectOption[]) => void
}

type SingleSelectProps = {
  multiple?: false
  value?: SelectOption
  setValue: (value: SelectOption | undefined) => void
}

type SelectProps = {
  options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps) // ?

// interface IProps {
//   multiple: boolean
//   options: typeof options
//   value: typeof options[0] | typeof options[0][]
//   setValue: (value: any) => void
// }

const Select = ({ multiple, options, value, setValue }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlitedIndex, setHighlitedIndex] = useState(0)
  const selectContainerRef = useRef<HTMLDivElement>(null)

  function selectOption(highlitedOption: typeof options[0]) {
    // if (multiple && Array.isArray(value)) {
    if (multiple) {
      if (value.includes(highlitedOption)) {
        setValue(value.filter((value) => value !== highlitedOption))
      } else {
        // onChange([...value2, option])
        setValue([...value, highlitedOption])
      }
    } else {
      if (highlitedOption !== value) setValue(highlitedOption)
    }
  }

  // start from top when open list
  useEffect(() => {
    console.log('set index 0')
    setHighlitedIndex(0)
  }, [isOpen])

  // key control
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.target !== selectContainerRef.current) return // ?
      console.log(e) // key: "ArrowDown" // code: "Space"
      switch (e.code) {
        case 'ArrowDown':
          setIsOpen(true)
          highlitedIndex < options.length - 1 && setHighlitedIndex((prev) => prev + 1)
          break
        case 'ArrowUp':
          highlitedIndex > 0 && setHighlitedIndex((prev) => prev - 1)
          break
        case 'Enter':
        case 'Space':
          isOpen && setValue(options[highlitedIndex])
          // ! Argument of type 'SelectOption' is not assignable to parameter of type 'SelectOption & SelectOption[]'.
          // ! Translation: I was expecting SelectOption & SelectOption[], but you passed SelectOption
          setIsOpen((prev) => !prev)
          break
        case 'Escape':
          setIsOpen(false)
          break
        default:
          break
      }
    }

    // document.addEventListener('keydown', keyHandler)
    selectContainerRef.current?.addEventListener('keydown', keyHandler)
    return () => {
      // document.removeEventListener('keydown', keyHandler)
      selectContainerRef.current?.removeEventListener('keydown', keyHandler)
    }
  }, [highlitedIndex, isOpen])

  return (
    <div
      className='select'
      tabIndex={0}
      ref={selectContainerRef}
      onClick={() => setIsOpen((prev) => !prev)}
      // onKeyDown={(e) => e.code === 'Space' && setIsOpen2((prev) => !prev)}
      onBlur={() => setIsOpen(false)} // close on click outside
    >
      <div className='value'>
        {multiple
          ? value.map((value, index) => (
              <div className='valueChip' onClick={(e) => e.stopPropagation()} key={index}>
                {/* prevent open close if click on text */}
                {value.label}
                <button className='remove-btn' onClick={() => selectOption(value)}>
                  &times;
                </button>
              </div>
            ))
          : value?.label}
      </div>
      <div className='divider'></div>
      <div className='caret'></div>
      <ul className={['options', isOpen ? 'show' : ''].join(' ')}>
        {options.map((option, index) => (
          <li
            onClick={() => selectOption(option)}
            key={option.label}
            className={
              multiple
                ? ['option', value.includes(option) ? 'active' : ''].join(' ')
                : [
                    'option',
                    value === option ? 'active' : '',
                    index === highlitedIndex ? 'highlited' : '',
                  ].join(' ')
            }
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Select
