import * as React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
const SnackBar: React.FC<{ message: React.ReactNode; container: Node; root?: Node }> = ({
  message,
  container,
  root,
}) => {
  React.useEffect(() => {
    setTimeout(() => {
      if (root) {
        root.removeChild(container)
      }
    }, 2000)
  }, [root, container])
  return (
    <>
    
      <div id="snackbar" className={'show'}>
        {message}
      </div>
    </>
  )
}

const SnackBarMessage = (message: string, snippetContainer?: HTMLElement | null) => {
  const container = document.createElement('div')
  let tempContainer = snippetContainer
  if (!tempContainer) {
    tempContainer = document.body
  }

  ReactDOM.render(
    ReactDOM.createPortal(
      <SnackBar message={message} container={container} root={tempContainer} />,
      tempContainer.appendChild(container),
    ),
    container,
  )
}

export default SnackBarMessage