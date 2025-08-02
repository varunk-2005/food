export default function SectionHeaders({ SubHeader, MainHeader }) {
  return (
    <>
        <div className="text-center z-10 py-10">
            <h3 className="uppercase text-gray-600 leading-4">{SubHeader}</h3>
            <h2 className="text-red-500 font-bold text-2xl mt-2">{MainHeader}</h2>
        </div>
    </>
  );
}
