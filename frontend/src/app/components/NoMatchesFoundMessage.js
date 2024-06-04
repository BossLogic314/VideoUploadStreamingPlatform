export default function NoMatchesFoundMessage() {

    return (
        <div className="noMatchesFoundDiv flex justify-center items-center mt-[50px]">
            <div className="noMatchesFoundMessage rounded-[7px] shadow-[0_8px_28px_-20px]">
                <div className="noMatchesFoundText text-[30px] font-[400] italic py-[40px] px-[40px]">
                    No matches found for the search!
                </div>
            </div>
        </div>
    );
}