import { Oval, RotatingLines } from "react-loader-spinner";

export const RotatingLinesSpinnerForBtn = ({ color }: { color: string }) => {
    return (
        <RotatingLines
            strokeColor={color}
            strokeWidth="3"
            animationDuration="0.75"
            width="24"
            visible={true}
        />
    );
};

export const RotatingLinesSpinnerForChat = ({ color }: { color: string }) => {
    return (
        <div className="flex justify-center items-center">
            <Oval
                height={30}
                width={30}
                color={color}
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor={color}
                strokeWidth={3}
                strokeWidthSecondary={3}
            />
        </div>
    );
};