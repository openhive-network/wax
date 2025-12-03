import { useState, useEffect } from 'react'
import { createWaxFoundation } from '@hiveio/wax';

console.log('Settting up global waxLoaded and waxError vars...');

window.waxLoaded = undefined;
window.waxError = null;

function App() {
  const [version, setVersion] = useState('')

  useEffect(() => {
    console.log('Attempting to call createWaxFoundation...');
    createWaxFoundation()
      .then(wax => {
        console.log('createWaxFoundation completed - wasm loaded.');
        setVersion(wax.getVersion());
        window.waxLoaded = true;
        console.log(`Exiting... Using version: ${wax.getVersion()}`);
      })
      .catch(err => {
        console.error('WASM LOADING ERROR:', err);
        window.waxError = String(err);
        window.waxLoaded = false; // explicitly set
      });
  }, []);

  return (
    <>
      {version}
    </>
  )
}

export default App