import { useState, useEffect } from 'react'

import { createWaxFoundation } from '@hiveio/wax/vite';

window.waxLoaded = false;

function App() {
  const [version, setVersion] = useState('')

  useEffect(() => {
    createWaxFoundation().then(wax => {
      setVersion(wax.getVersion());

      window.waxLoaded = true;
    });
  }, []);

  return (
    <>
      {version}
    </>
  )
}

export default App
