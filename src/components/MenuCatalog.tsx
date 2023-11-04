export default function MenuCatalog() {
  return (
    <>
      <h1>All Menu</h1>
      <form className="w-[60%] mx-auto items-center">
        <section
          aria-labelledby="summary-heading"
          className="mt-10 border-t border-gray-300"
        >
          <h2
            id="summary-heading"
            className="hidden absolute w-1 h-1 -m-1 overflow-hidden"
          >
            Order summary
          </h2>
          <div>
            <dl className="m-0">
              <div className="flex items-center justify-between mt-[1.5rem] mb-[1.5rem]">
                <dt className="text-base leading-6 font-semibold text-blue-900 ">
                  Subtotal
                </dt>
                <dd className="ml-[1rem] text-base leading-6 font-semibold text-blue-900">
                  $96.00
                </dd>
              </div>
            </dl>
          </div>
          <div className="kw">
            <button
              type="submit"
              className="w-[100%] bg-indigo-500 border border-solid border-[1px] rounded-[0.375rem] pl-4 pr-4 pb-3 pt-3 text-base leading-6 font-semibold shadow-[0 1px 2px 0 #0000000d] text-opacity-100 text-white border-transparent"
            >
              Checkout
            </button>
          </div>
        </section>
      </form>
    </>
  );
}
