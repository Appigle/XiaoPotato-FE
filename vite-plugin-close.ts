// file vite-plugin-close.ts

export default function ClosePlugin() {
  return {
    name: 'ClosePlugin', // required, will show up in warnings and errors

    // use this to catch errors when building
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buildEnd(error: any) {
      if (error) {
        console.error('Error bundling');
        console.error(error);
        process.exit(1);
      } else {
        console.log('Build ended');
      }
    },

    // use this to catch the end of a build without errors
    closeBundle() {
      console.log('Bundle closed');
      process.exit(0);
    },
  };
}
