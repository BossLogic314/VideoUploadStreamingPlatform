import './styles/Loader.css'

export default function Loader() {

    return (
        <div className="h-screen w-screen fixed top-0"
        id="loaderOverlay">
            <div className="loaderDiv flex flex-col justify-center items-center mt-[50px]">
                <div className="loader"></div>
                <div className="waitMessage text-[28px] mt-[15px]" id="waitMessage">Please wait...</div>
                <div className="uploadingMessage text-[28px]" id="uploadingMessage">Your request is being processed</div>
            </div>
        </div>
    );
}