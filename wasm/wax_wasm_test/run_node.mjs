import Module from '../../build_wasm/beekeeper_wasm.mjs';

const my_entrypoint = async() => {
  const provider = await Module();
  const instance = new provider.protocol();

  console.log(instance);
};

my_entrypoint()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
