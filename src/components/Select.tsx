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
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0)
  //   const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const selectContainerRef = useRef<HTMLDivElement>(null)

  //   function selectOption(HighlightedOption: typeof options[0]) {
  function selectOption(highlightedOption: SelectOption) {
    // if (multiple && Array.isArray(value)) {
    if (multiple) {
      if (value.includes(highlightedOption)) {
        // multi select -> already in array -> remove option from array / unselect
        setValue(value.filter((value) => value !== highlightedOption))
      } else {
        // multi select -> new value -> add to array of selected options
        // onChange([...value2, option])
        setValue([...value, highlightedOption])
      }
    } else {
      // if single select -> replace value
      if (highlightedOption !== value) setValue(highlightedOption)
    }
  }

  // start from top when open list
  useEffect(() => {
    console.log('set index 0')
    setHighlightedIndex(0)
    // setHighlightedIndex(-1)
  }, [isOpen])

  // key control
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.target !== selectContainerRef.current) return // ?
      console.log(e) // key: "ArrowDown" // code: "Space"
      switch (e.code) {
        case 'ArrowDown':
          setIsOpen(true)
          highlightedIndex < options.length - 1 && setHighlightedIndex((prev) => prev + 1)
          highlightedIndex === -1 && setHighlightedIndex(0)
          break
        case 'ArrowUp':
          highlightedIndex > 0 && setHighlightedIndex((prev) => prev - 1)
          break
        case 'Enter':
        case 'Space':
          //   isOpen && setValue(options[HighlightedIndex])
          // ! Argument of type 'SelectOption' is not assignable to parameter of type 'SelectOption & SelectOption[]'.
          // ! Translation: I was expecting SelectOption & SelectOption[], but you passed SelectOption
          isOpen && selectOption(options[highlightedIndex])
          setIsOpen((prev) => !prev)
          //   setHighlightedIndex(-1)
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
  }, [highlightedIndex, isOpen])

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
                ? [
                    'option',
                    value.includes(option) ? 'active' : '',
                    index === highlightedIndex ? 'highlighted' : '',
                  ].join(' ')
                : [
                    'option',
                    value === option ? 'active' : '',
                    index === highlightedIndex ? 'highlighted' : '',
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
