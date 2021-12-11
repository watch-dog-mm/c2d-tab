import { useEffect, useRef } from 'react'

type AnyEvent = MouseEvent | TouchEvent
type ClickedOutsideCallback = (event: AnyEvent) => void

/**
 * Custom hook to detect click outside of an element.
 *
 * @example
 * // Start with null but tell TypeScript we are looking for an HTMLDivElement
 * const const ref = useRef<HTMLDivElSettingement>(null)
 * useOnClickOutside(ref, () => {})
 *
 * <div ref={ref}></div>
 */
export default function useOnClickOutside<
  Element extends HTMLElement,
  Ref extends React.RefObject<Element | null>
>(ref: Ref, callback: ClickedOutsideCallback) {
  const savedCallback = useRef<ClickedOutsideCallback | null>(null)

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const listener = (event: AnyEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      savedCallback.current?.(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener(`touchstart`, listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener(`touchstart`, listener)
    }
  }, [ref])
}
