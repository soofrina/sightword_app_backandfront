const TailwindSample = () => (
  <div className='rounded-lg border border-gray-400 hover:border-gray-500 bg-gray-100 w-6/12 h-6/12 flex flex-col gap-1 p-2'>
    <b className='text-lg'>A Tailwind Sample</b>
    <div>
      <p>This component is entirely styled with TailwindCSS.</p>
      <p>
        If TailwindCSS is correctly configured with Storybook, this division
        should render correctly with styles and hover effects.
      </p>
    </div>
    <div className='w-100'>
      <button className='float-right px-2 py-1 mt-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700'>
        A button
      </button>
    </div>
  </div>
);

export default TailwindSample;
